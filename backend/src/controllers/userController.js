const bcrypt = require("bcrypt");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { UserModel } = require("../models/UserModel");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const UserRules = z.object({
      username: z.string().min(4).max(20),
      email: z.string().email(),
      password: z.string().min(6).max(15),
    });

    const parsedData = UserRules.safeParse({ username, email, password });
    if (!parsedData.success) {
      return res.status(400).json({ message: "Please give valid Inputs" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      userId: uuidv4(),
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("/register error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const isUserPresent = await UserModel.findOne({ email });
  if (!isUserPresent) {
    return res.status(400).json({ message: "Invalid email or user not found" });
  }

  const verification = await bcrypt.compare(password, isUserPresent.password);
  if (!verification) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ userId: isUserPresent.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.status(200).json({
    message: "Sign in successful",
    jwt_token: token,
    user: {
      userId: isUserPresent.userId,
      username: isUserPresent.username,
      email: isUserPresent.email,
    },
  });
};

const automationRegister = async (req, res) => {
  try {
    const { username, email, userId } = req.body || {};
    const webhookURL = process.env.N8N_WEBHOOK_URL;

    if (!webhookURL) {
      return res.status(200).json({ forwarded: false, message: "N8N_WEBHOOK_URL not configured" });
    }

    const payload = { username, email, userId };
    const resp = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      return res.status(200).json({ forwarded: false, status: resp.status });
    }
    return res.status(200).json({ forwarded: true, status: resp.status });
  } catch (err) {
    console.error("Automation proxy error:", err);
    return res.status(200).json({ forwarded: false, error: err.message });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await UserModel.findOne({ email: userEmail }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email does not exist" });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to registered mail",
      user: { username: user.username, email: user.email, userId: user.userId },
    });
  } catch (err) {
    console.error("Error checking email:", err);
    return res.status(500).json({ success: false, message: "Server error while checking email", error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne({ userId: req.user.userId }).select("-password").lean();
    return res.status(200).json({ userDetails: user });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Email and new password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({ success: false, message: "Server error while updating password", error: err.message });
  }
};

module.exports = { register, login, automationRegister, checkEmail, getProfile, updatePassword };

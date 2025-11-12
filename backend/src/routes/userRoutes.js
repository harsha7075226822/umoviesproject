const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/authMiddleware");
const { register, login, automationRegister, checkEmail, getProfile, updatePassword } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.post("/automation/register", automationRegister);
router.post("/check-email", checkEmail);
router.get("/profile", verifyToken, getProfile);
router.put("/updatepassword", updatePassword);

module.exports = router;

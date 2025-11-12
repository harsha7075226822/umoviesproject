const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchemaFormat = {
  userId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
};

const UserSchema = new Schema(UserSchemaFormat, { timestamps: true });

const UserModel = model("UserDetails", UserSchema);

module.exports = { UserModel };

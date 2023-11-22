import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        const emailRegx = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return emailRegx.test(email);
      },
      message: "Email format is invalid",
    },
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        return password.length >= 8;
      },
      message: "Password must be 8 charactor long",
    },
  },

  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (confirmPassword) {
        return confirmPassword === this.password;
      },
      message: "Password does not matched",
    },
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(1);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.confirmPassword = undefined;
    next();
  }
});

export default mongoose.model("user", userSchema);

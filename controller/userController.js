import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const fetch = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const create = async (req, res) => {
  try {
    const userData = new User(req.body);
    const { email } = userData;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const savedUser = await userData.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById({ _id: id });
    if (!userExist) {
      return res.status(404).json({ message: "user not found" });
    }
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById({ _id: id });
    if (!userExist) {
      return res.status(404).json({ message: "user not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(201).json({ message: "user deleted" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//login api
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not exist" });
    }

    const isValidatePassword = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isValidatePassword) {
      return res.status(401).json({ message: "email or password invalid" });
    }

    const tokenExist = req.cookies.token;
    if (tokenExist) {
      return res.status(400).json({ message: "already login" });
    }

    const token = jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ message: "login successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//logout
export const logoutUser = async (req, res) => {
  try {
    const tokenExist = req.cookies.token;
    if (!tokenExist) {
      return res.status(400).json({ message: "login required" });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateloginUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findOne({ _id: id });
    if (!userExist) {
      return res.status(400).json({ message: "user not exist" });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { name, lastName, email, password, phone } = req.body;

  try {

    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      lastName,
      email,
      password: passwordHash,
      phone,
      role: "customer",
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      id: userSaved._id,
      name: userSaved.name,
      lastName: userSaved.lastName,
      email: userSaved.email,
      phone: userSaved.phone,
      role: userSaved.role
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      id: userFound._id,
      name: userFound.name,
      lastName: userFound.lastName,
      email: userFound.email,
      phone: userFound.phone,
      role: userFound.role
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
};

export const logout = (req, res) => {

  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.json({
    message: "Logout successful",
  });
};

export const profile = async (req, res) => {
  try {

    const userFound = await User.findById(req.user.id);

    if (!userFound) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      userId: userFound._id,
      name: userFound.name,
      lastName: userFound.lastName,
      email: userFound.email,
      phone: userFound.phone,
      role: userFound.role,
      createdAt: userFound.createdAt,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error getting profile",
      error: error.message,
    });
  }
};

export const createWorker = async (req, res) => {
  const { name, lastName, email, password, phone } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const worker = new User({
      name,
      lastName,
      email,
      password: passwordHash,
      phone,
      role: "worker",
    });

    const saved = await worker.save();
    const { password: _pw, ...safe } = saved.toObject();

    return res.status(201).json({
      id: safe._id,
      name: safe.name,
      lastName: safe.lastName,
      email: safe.email,
      phone: safe.phone,
      role: safe.role,
      createdAt: safe.createdAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
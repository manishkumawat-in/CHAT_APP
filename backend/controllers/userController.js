import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";


export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try { 

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
            
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, { httpOnly: true });

        user.password = null;
        return res.json({ success: true, userData: user });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, { httpOnly: true });

        user.password = null;
        return res.json({ success: true, userData: user });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("token");
        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    const { name, bio } = req.body;

    try {

        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.name = name || user.name;
        user.bio = bio || user.bio;

        await user.save();

        return res.json({ success: true, userData: user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const updateImage = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!req.file) {
            return res.json({ success: false, message: "Image is required" });
        }

        const uploadData = await cloudinary.uploader.upload(req.file.path , { folder: "chat_app/profile_images" })

        user.image = uploadData.secure_url || user.image;

        await user.save();

        return res.json({ success: true, userData: user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.password = null;
        return res.json({ success: true, userData: user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
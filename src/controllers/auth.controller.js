
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.modal.js";
import Blacklist from "../models/blacklist.modal.js";

const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const isUserExist = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserExist) {
            return res.status(400).json({
                message: "User already exists with this username or email",
                success: false
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashPassword
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.cookie("token", token);
        const userDataResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
        }

        const response = {
            success: true,
            message: "User registered successfully",
            user: userDataResponse
        }

        return res.status(201).json(response);
    } catch (error) {
        const errorResponse = {
            success: false,
            message: "Failed to register user",
            error: error.message
        }
        return res.status(500).json(errorResponse);
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
            return res.status(400).json({
                message: "Invalid credentials.",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials.",
                success: false
            });
        }

        const token = jwt.sign(
            { id: isUserExist._id, username: isUserExist.username },
            process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.cookie("token", token);
        const userDataResponse = {
            id: isUserExist._id,
            username: isUserExist.username,
            email: isUserExist.email,
        }

        const response = {
            success: true,
            message: "User logged in successfully",
            user: userDataResponse
        }

        return res.status(200).json(response);

    } catch (error) {
        const errorResponse = {
            success: false,
            message: "Failed to login user",
            error: error.message
        }
        return res.status(500).json(errorResponse);
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            await Blacklist.create({ token });
        }
        res.clearCookie("token");
        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        });

    } catch (error) {
        const errorResponse = {
            success: false,
            message: "Failed to logout user",
            error: error.message
        }
        return res.status(500).json(errorResponse);
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const userDataResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        return res.status(200).json({
            message: "User profile",
            success: true,
            user: userDataResponse
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get user profile",
            success: false,
            error: error.message
        });
    }
}

const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const userDataResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        return res.status(200).json({
            message: "User fetched successfully.",
            success: true,
            user: userDataResponse
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch user.",
            success: false,
            error: error.message
        });
    }
}
export {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    getMe
}

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.modal.js";

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

export {
    registerUser,
    loginUser
}
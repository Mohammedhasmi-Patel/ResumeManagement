import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "Username is taken."],
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is taken."],
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    }
}, { timestamps: true });

const User = mongoose.model("users", userSchema);

export default User;
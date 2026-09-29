import mongoose from "mongoose";


const blacklistSchema = mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
    }
}, { timestamps: true });

const Blacklist = mongoose.model("blacklists", blacklistSchema);

export default Blacklist;
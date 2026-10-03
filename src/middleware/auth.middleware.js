import Blacklist from "../models/blacklist.modal.js"
import jwt from "jsonwebtoken"

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, please login" });
        }

        const isTokenBlackList = await Blacklist.findOne({ token });
        if (isTokenBlackList) {
            return res.status(401).json({ message: "Unauthorized, please login" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, please login" })
    }
}

export default authenticateUser;
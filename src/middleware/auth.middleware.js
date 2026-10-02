import Blacklist from "../models/blacklist.modal.js"
import jwt from "jsonwebtoken"

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, please login" })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (await Blacklist.findOne({ token })) {
            return res.status(401).json({ message: "Unauthorized, please login" })
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, please login" })
    }
}

export default authenticateUser;
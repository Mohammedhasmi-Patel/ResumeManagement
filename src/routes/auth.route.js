import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe, getProfile } from "../controllers/auth.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/profile", authenticateUser, getProfile);
authRouter.get("/get-me", authenticateUser, getMe);

export default authRouter;
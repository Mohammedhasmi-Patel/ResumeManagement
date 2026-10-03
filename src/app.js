import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./routes/interview.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));
app.use("/api/auth", authRouter);
app.use("/api/reports", interviewRouter);
app.use("/api/interviews", interviewRouter);


export default app;

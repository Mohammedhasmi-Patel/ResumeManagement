import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import upload from "../middleware/file.middleware.js";
import { generateReport, getInterviewReportById, listAllReports } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/", authenticateUser, upload.single("resume"), generateReport);
interviewRouter.get("/:interviewId", authenticateUser, getInterviewReportById);
interviewRouter.get("/", authenticateUser, listAllReports);

export default interviewRouter;

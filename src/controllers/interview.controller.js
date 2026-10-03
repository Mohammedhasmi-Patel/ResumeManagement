import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.service.js";
import InterviewReport from "../models/interviewReport.modal.js";

export const generateReport = async (req, res) => {
    try {
        const resumeFile = req.file;
        const { selfDescription, jobDescription } = req.body;

        if (!selfDescription || !jobDescription || !resumeFile) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const parser = new PDFParse({ data: resumeFile.buffer });
        const pdfContent = await parser.getText();
        await parser.destroy();
        const resumeText = pdfContent.text;

        const generatedAiReport = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await InterviewReport.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...generatedAiReport
        });

        return res.status(200).json({
            success: true,
            message: "Report generated successfully",
            data: interviewReport
        });

    } catch (error) {
        console.error("[Interview Controller Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getInterviewReportById = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const report = await InterviewReport.findById(interviewId)
            .select("-resume -selfDescription -jobDescription -user -__v");
        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch interview report",
            error: error.message
        });
    }
};


export const listAllReports = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const reports = await InterviewReport.find({ user: userId })
            .select("_id jobDescription matchScore skillGaps createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Interview reports fetched successfully",
            data: reports
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch interview reports",
            error: error.message
        });
    }
};

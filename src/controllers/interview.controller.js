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

        const pdfContent = await (new PDFParse(Uint8Array.PDFParse(resumeFile.buffer))).getText();
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

import { GoogleGenAI } from "@google/genai";
import * as z from "zod";


const ai = new GoogleGenAI();

// Ensure these model strings exist in your Google AI Studio project
const MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.0-flash"
];

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the resume and the job describe"),
    technicalSkills: z.array(z.object({
        question: z.string().describe("The technical question asked by the interviewer"),
        answer: z.string().describe("The answer to the technical question"),
        intention: z.string().describe("The intention of asking the technical question")
    })),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("The behavioural question asked by the interviewer"),
        answer: z.string().describe("The answer to the behavioural question"),
        intention: z.string().describe("The intention of asking the behavioural question")
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"]).describe("The severity level: low, medium, or high")
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })).describe("A day wise preparation plan for the candidate")
});

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
    const prompt = `
    Generate an interview report based on the following information:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    `;

    const schema = z.toJSONSchema(interviewReportSchema);
    delete schema.$schema;

    let lastError = null;

    for (const model of MODELS) {
        try {
            console.log(`[Gemini API] Attempting call with model: ${model}`);
            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            return JSON.parse(response.text);


        } catch (error) {
            console.warn(`[Gemini API] Model ${model} failed:`, error?.message || error);
            lastError = error;
            continue;
        }
    }

    throw lastError || new Error("All model endpoints failed to process the request.");
};

export const invokeGemini = async (prompt = "Hello") => {
    let lastError = null;
    for (const model of MODELS) {
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: prompt
            });
            return response.text;
        } catch (error) {
            lastError = error;
            continue;
        }
    }
    throw lastError || new Error("All model endpoints failed to process the request.");
};

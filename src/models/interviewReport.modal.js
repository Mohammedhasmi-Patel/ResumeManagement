import mongoose from "mongoose";


const technicalSkillsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: [true, "Severity is required"]
    }
}, { _id: false });


const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
}, { _id: false });



const preparationSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: true
    },
    tasks: {
        type: [String],
        required: [true, "Tasks are required"]
    }
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalSkills: [technicalSkillsSchema],
    skillGaps: [skillGapSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    preparationPlan: [preparationSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
});


const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);
export default InterviewReport;
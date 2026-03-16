const pdfParse=require('pdf-parse')
const {generateInterviewReport , generateResumePdf} = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

function convertQA(arr) {
    const result = []

    for (let i = 0; i < arr.length; i += 6) {
        result.push({
            question: arr[i + 1],
            intention: arr[i + 3],
            answer: arr[i + 5]
        })
    }

    return result
}
function convertSkillGaps(arr) {
    const result = []

    for (let i = 0; i < arr.length; i += 4) {
        result.push({
            skill: arr[i + 1],
            severity: arr[i + 3]
        })
    }

    return result
}

function convertPlan(arr) {
    const result = []

    for (let i = 0; i < arr.length;) {
        const day = arr[i + 1]
        const focus = arr[i + 3]

        const tasks = []
        i += 5

        while (typeof arr[i] === "string" && arr[i] !== "day") {
            tasks.push(arr[i])
            i++
        }

        result.push({ day, focus, tasks })
    }

    return result
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterviewReportController(req,res){
    

    const resumeContent =await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription,jobDescription }=req.body

    const interviewReportByAi=await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })

    // console.log("AI RESPONSE:", interviewReportByAi)

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        matchScore: interviewReportByAi.matchScore || 0,
        technicalQuestions: convertQA(interviewReportByAi.technicalQuestions || []),
        behavioralQuestions: convertQA(interviewReportByAi.behavioralQuestions || []),
        skillGaps: convertSkillGaps(interviewReportByAi.skillGaps || []),
        preparationPlan: convertPlan(interviewReportByAi.preparationPlan || []),
        title:interviewReportByAi.title,
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports={generateInterviewReportController , getInterviewReportByIdController , getAllInterviewReportsController , generateResumePdfController}
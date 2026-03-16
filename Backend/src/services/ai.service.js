const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Score between 0 and 100 showing how well the candidate matches the job"),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .min(10)
          .describe("Technical interview question"),

        intention: z
          .string()
          .min(10)
          .describe("Why the interviewer asks this question"),

        answer: z
          .string()
          .min(20)
          .describe("Key points or strategy to answer this question")
      })
    )
    .min(5)
    .default([])
    .describe("Technical interview questions"),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .min(10)
          .describe("Behavioral interview question"),

        intention: z
          .string()
          .min(10)
          .describe("Purpose behind asking the question"),

        answer: z
          .string()
          .min(20)
          .describe("Recommended way to answer using examples or STAR method")
      })
    )
    .min(3)
    .default([])
    .describe("Behavioral interview questions"),

  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .min(2)
          .describe("Skill missing or weak in the candidate profile"),

        severity: z
          .enum(["low", "medium", "high"])
          .describe("Importance of this skill for the job")
      })
    )
    .min(3)
    .default([])
    .describe("Skills the candidate should improve"),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .int()
          .min(1)
          .describe("Day number of the preparation plan"),

        focus: z
          .string()
          .min(5)
          .describe("Main topic to focus on that day"),

        tasks: z
          .array(z.string().min(5))
          .min(1)
          .describe("Tasks to complete that day")
      })
    )
    .min(5)
    .default([])
    .describe("Day-wise preparation plan"),

  title: z
    .string()
    .min(2)
    .describe("Job title for which this interview report is generated"),
    
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {



    const prompt = `
        You are an AI interviewer.

        Analyze the candidate and generate a structured interview report.

        Candidate Resume:
        ${resume}

        Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}

        IMPORTANT:
        "title" must be the job title extracted from the Job Description.
        Example: "Frontend Developer", "MERN Stack Developer", "Backend Engineer".

        Return ONLY valid JSON in the following structure:

        {
        "matchScore": number (0-100),
        "technicalQuestions": [
            {
            "question": "string",
            "intention": "string",
            "answer": "string"
            }
        ],
        "behavioralQuestions": [
            {
            "question": "string",
            "intention": "string",
            "answer": "string"
            }
        ],
        "skillGaps": [
            {
            "skill": "string",
            "severity": "low | medium | high"
            }
        ],
        "preparationPlan": [
            {
            "day": number,
            "focus": "string",
            "tasks": ["string"]
            }
        ]
        }

        Generate at least:
        - 5 technical questions
        - 3 behavioral questions
        - 3 skill gaps
        - 5 day preparation plan
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })


    // console.log(response.text)
    // return JSON.parse(response.text)

    const aiData = JSON.parse(response.text)

    return {
        title: aiData.title || "Interview Preparation Report",
        matchScore: aiData.matchScore || 0,
        technicalQuestions: aiData.technicalQuestions || [],
        behavioralQuestions: aiData.behavioralQuestions || [],
        skillGaps: aiData.skillGaps || [],
        preparationPlan: aiData.preparationPlan || [],
        
    }


}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}


module.exports =  {generateInterviewReport , generateResumePdf }


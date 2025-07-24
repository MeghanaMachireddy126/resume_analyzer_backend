const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const extractTextFromPDF = async (fileBuffer) => {
  const data = await pdfParse(fileBuffer);
  return data.text;
};

const analyzeResume = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are an expert technical recruiter and career coach. Analyze the following resume text and return a structured JSON object:

Resume Text:
"""
${resumeText}
"""

JSON Structure:
{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",
  "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "projects": [{"title": "string", "description": "string"}],
  "certifications": ["string"],
  "resume_rating": "number (1-10)",
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}") + 1;
  const json = JSON.parse(text.substring(start, end));

  return json;
};

module.exports = {
  extractTextFromPDF,
  analyzeResume,
};


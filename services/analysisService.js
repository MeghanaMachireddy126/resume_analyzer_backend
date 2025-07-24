const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function analyzeResume(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You're a helpful AI assistant analyzing resumes.

Here is a resume text:
"""
${text}
"""

Provide:
- Candidate's name (if available)
- Key skills
- Work experience summary
- Education highlights
- Suitability score for a software engineering role (0-100)
Return your answer as JSON.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    const jsonStart = output.indexOf("{");
    const json = JSON.parse(output.slice(jsonStart));

    return json;
  } catch (err) {
    console.error("❌ Error in LLM analysis:", err);
    return { error: "Failed to analyze resume" };
  }
}

module.exports = { analyzeResume };

const { extractTextFromPDF, analyzeResume } = require("../services/analysisService");

const analyzeResumeHandler = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];

    if (contentType !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are accepted" });
    }

    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));

    req.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);

      const resumeText = await extractTextFromPDF(pdfBuffer);
      const analysis = await analyzeResume(resumeText);

      res.json(analysis);
    });
  } catch (error) {
    console.error("Resume analysis error:", error.message);
    res.status(500).json({ error: "Resume analysis failed" });
  }
};

module.exports = {
  analyzeResumeHandler,
};

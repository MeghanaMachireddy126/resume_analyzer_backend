const fs = require("fs");
const pdfParse = require("pdf-parse");
const pool = require("../db/db");
const { analyzeResume } = require("../services/analysisService");

const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const pdfBuffer = fs.readFileSync(file.path);
    const pdfText = (await pdfParse(pdfBuffer)).text;

    const analysis = await analyzeResume(pdfText);

    await pool.query(
      "INSERT INTO resumes (filename, content, analysis) VALUES ($1, $2, $3)",
      [file.originalname, pdfText, JSON.stringify(analysis)]
    );

    fs.unlinkSync(file.path); // Clean up

    res.status(200).json({
      message: "Resume uploaded & analyzed successfully",
      analysis,
    });
  } catch (err) {
    console.error("❌ Error in uploadResume:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadResume };

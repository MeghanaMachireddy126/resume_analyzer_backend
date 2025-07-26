const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// Dummy GET route to avoid "Cannot GET /resumes"
app.get("/resumes", (req, res) => {
  res.json({ message: "Resumes endpoint is working!" });
});

// POST route to upload a resume and return parsed content
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);

    // Delete file after reading
    fs.unlinkSync(req.file.path);

    res.json({
      content: data.text,
      info: data.info,
      metadata: data.metadata,
    });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

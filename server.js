const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Dummy root route
app.get('/', (req, res) => {
  res.send('Resume Analyzer Backend is running ✅');
});

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    fs.unlinkSync(req.file.path); // cleanup

    res.json({
      text: pdfData.text,
      analysis: {
        wordCount: pdfData.text.split(/\s+/).length,
        skills: {
          Python: pdfData.text.includes('Python'),
          JavaScript: pdfData.text.includes('JavaScript'),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();
const { analyzeResumeHandler } = require("../controllers/resumeController");

// POST /api/resumes/analyze
router.post("/analyze", analyzeResumeHandler);

module.exports = router;

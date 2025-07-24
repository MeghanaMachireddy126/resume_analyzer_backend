const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Resume Analyzer Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

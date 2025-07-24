const pool = require("../db");

const saveResume = async (filename, content, summary) => {
  const query = `
    INSERT INTO resumes (filename, content, summary)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [filename, content, summary];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllResumes = async () => {
  const { rows } = await pool.query("SELECT * FROM resumes ORDER BY created_at DESC;");
  return rows;
};

module.exports = {
  saveResume,
  getAllResumes,
};

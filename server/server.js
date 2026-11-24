const fs = require('node:fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const sql = require('mssql');

const app = express();
const webDirectory = path.join(__dirname, '..', 'web');
const trackQuery = fs.readFileSync(path.join(__dirname, '..', 'db', 'queries.sql'), 'utf8');
const port = Number(process.env.PORT || 3000);

function getDatabaseConfig() {
  const database = process.env.DB_NAME || '';
  if (!/^[A-Za-z][A-Za-z0-9_]*_myapp$/.test(database)) {
    throw new Error('Set DB_NAME in .env to your own database name, ending in _myapp.');
  }
  if (!process.env.DB_SERVER || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('Set DB_SERVER, DB_USER, and DB_PASSWORD in .env.');
  }

  return {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 1433),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database,
    options: { encrypt: true, trustServerCertificate: true }
  };
}

app.get('/api/genres', async (_req, res) => {
  try {
    const pool = await sql.connect(getDatabaseConfig());
    const result = await pool.request().query(`
      SELECT GenreID AS id, GenreName AS name, GenreDescription AS description
      FROM dbo.Genres
      ORDER BY GenreName;
    `);
    return res.json(result.recordset);
  } catch (error) {
    console.error('GET /api/genres failed:', error);
    return res.status(500).json({ error: 'Could not load genres. Check the server terminal and database connection.' });
  }
});

app.get('/api/tracks', async (req, res) => {
  const rawGenre = req.query.genre;
  if (rawGenre !== undefined && typeof rawGenre !== 'string') {
    return res.status(400).json({ error: 'Choose one genre or leave the filter empty.' });
  }

  const selectedGenre = rawGenre?.trim() || null;
  if (selectedGenre && selectedGenre.length > 80) {
    return res.status(400).json({ error: 'Genre must be 80 characters or fewer.' });
  }
  const genre = selectedGenre === 'all' ? null : selectedGenre;

  try {
    const pool = await sql.connect(getDatabaseConfig());
    const result = await pool.request()
      .input('genre', sql.NVarChar(80), genre)
      .query(trackQuery);
    return res.json(result.recordset);
  } catch (error) {
    console.error('GET /api/tracks failed:', error);
    return res.status(500).json({ error: 'Could not load tracks. Check the server terminal and database connection.' });
  }
});

app.use(express.static(webDirectory));

app.listen(port, () => {
  console.log(`Sound Scout is running at http://localhost:${port}`);
});

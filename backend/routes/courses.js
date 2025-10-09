import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import { parse } from "csv-parse";

const router = Router();

// Resolve CSV path relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_PATH = path.resolve(__dirname, "../scraper/hunter_csci_courses.csv");

let COURSES = [];

function loadCSV() {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => {
        rows.push({
          code: row.code || "",
          title: row.title || "",
          // keep 7-digit string with leading zeros intact
          course_id: (row.course_id ?? "").toString().padStart(7, "0"),
          status: (row.status ?? "").toString(), // e.g. "Available" | "No Sections"
        });
      })
      .on("end", () => {
        COURSES = rows;
        resolve();
      })
      .on("error", reject);
  });
}

function matchesQuery(course, qTokens) {
  if (!qTokens.length) return true;
  const hay = `${course.code} ${course.title}`.toLowerCase();
  return qTokens.every((t) => hay.includes(t));
}

// GET /api/courses?query=csci 127&available=1&limit=50
router.get("/courses", (req, res) => {
  const query = String(req.query.query ?? "").toLowerCase().trim();
  const onlyAvailable = ["1", "true", "yes"].includes(String(req.query.available).toLowerCase());
  const limit = Math.min(parseInt(req.query.limit ?? "50", 10) || 50, 200);

  const qTokens = query ? query.split(/\s+/) : [];

  let results = COURSES.filter((c) => matchesQuery(c, qTokens));
  if (onlyAvailable) {
    results = results.filter((c) => c.status.toLowerCase() === "available");
  }

  res.json({ total: results.length, items: results.slice(0, limit) });
});

// Load once at startup, then hot-reload on file change
await loadCSV();
fs.watchFile(CSV_PATH, { interval: 2000 }, async () => {
  try {
    await loadCSV();
    console.log("[courses] CSV reloaded");
  } catch (e) {
    console.error("[courses] reload failed:", e.message);
  }
});

export default router;

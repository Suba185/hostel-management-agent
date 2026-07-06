import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import initSqlJs from 'sql.js';
import { Student, Warden, Complaint } from './src/types';

dotenv.config();

const app = express();
const PORT = 3001;

// Express JSON body parser
app.use(express.json());

// Database configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hostel.db');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbInstance: any = null;

async function getDbConnection() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
      console.log('Loaded existing SQLite database via sql.js');
    } catch (e) {
      console.error('Error reading DB file, creating fresh database:', e);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
    console.log('Created fresh SQLite database via sql.js');
  }

  return dbInstance;
}

function saveDb() {
  if (!dbInstance) return;

  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

async function dbRun(sql: string, params: any[] = []) {
  const db = await getDbConnection();
  db.run(sql, params);
  saveDb();
  return { changes: 1 };
}

async function dbGet<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  const db = await getDbConnection();

  const stmt = db.prepare(sql);
  stmt.bind(params);

  let row: T | undefined;

  if (stmt.step()) {
    row = stmt.getAsObject() as T;
  }

  stmt.free();

  return row;
}

async function dbAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDbConnection();

  const stmt = db.prepare(sql);
  stmt.bind(params);

  const rows: T[] = [];

  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }

  stmt.free();

  return rows;
}

async function initializeDatabase() {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS students(
        name TEXT NOT NULL,
        registerNumber TEXT UNIQUE,
        department TEXT,
        year TEXT,
        hostelBlock TEXT,
        roomNumber TEXT,
        email TEXT UNIQUE,
        password TEXT
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS wardens(
        name TEXT NOT NULL,
        wardenId TEXT UNIQUE,
        hostelBlock TEXT,
        email TEXT UNIQUE,
        password TEXT
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS complaints(
        id TEXT PRIMARY KEY,
        studentName TEXT,
        registerNumber TEXT,
        hostelBlock TEXT,
        complaintType TEXT,
        description TEXT,
        status TEXT DEFAULT 'Pending',
        createdAt TEXT,
        studentEmail TEXT
      )
    `);

    console.log("Database initialized successfully.");

  } catch (err) {
    console.error(err);
  }
}

initializeDatabase();

// Gemini Client

let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {

  if (!aiClient) {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing.");
    }

    aiClient = new GoogleGenAI({
      apiKey
    });
  }

  return aiClient;
}

// -------------------------------
// STUDENT REGISTER
// -------------------------------

app.post("/student/register", async (req, res) => {

  try {

    const {
      name,
      registerNumber,
      department,
      year,
      hostelBlock,
      roomNumber,
      email,
      password
    } = req.body;

    if (
      !name ||
      !registerNumber ||
      !department ||
      !year ||
      !hostelBlock ||
      !roomNumber ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required."
      });
    }

    const exists = await dbGet<Student>(
      "SELECT * FROM students WHERE LOWER(email)=?",
      [email.toLowerCase()]
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists."
      });
    }

    await dbRun(
      `INSERT INTO students
      (name,registerNumber,department,year,hostelBlock,roomNumber,email,password)
      VALUES(?,?,?,?,?,?,?,?)`,
      [
        name,
        registerNumber,
        department,
        year,
        hostelBlock,
        roomNumber,
        email,
        password
      ]
    );

    res.json({
      success: true,
      message: "Student Registered Successfully"
    });

  } catch (err:any) {

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

});
// -------------------------------
// STUDENT LOGIN
// -------------------------------

app.post("/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const student = await dbGet<Student>(
      "SELECT * FROM students WHERE LOWER(email)=? AND password=?",
      [email.toLowerCase(), password]
    );

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const { password: _, ...studentData } = student;

    res.json({
      success: true,
      user: studentData
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// -------------------------------
// WARDEN REGISTER
// -------------------------------

app.post("/warden/register", async (req, res) => {
  try {

    const {
      name,
      wardenId,
      hostelBlock,
      email,
      password
    } = req.body;

    if (
      !name ||
      !wardenId ||
      !hostelBlock ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required."
      });
    }

    const exists = await dbGet<Warden>(
      "SELECT * FROM wardens WHERE LOWER(email)=?",
      [email.toLowerCase()]
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists."
      });
    }

    await dbRun(
      `INSERT INTO wardens
      (name,wardenId,hostelBlock,email,password)
      VALUES(?,?,?,?,?)`,
      [
        name,
        wardenId,
        hostelBlock,
        email,
        password
      ]
    );

    res.json({
      success: true,
      message: "Warden Registered Successfully"
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// -------------------------------
// WARDEN LOGIN
// -------------------------------

app.post("/warden/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const warden = await dbGet<Warden>(
      "SELECT * FROM wardens WHERE LOWER(email)=? AND password=?",
      [email.toLowerCase(), password]
    );

    if (!warden) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const { password: _, ...wardenData } = warden;

    res.json({
      success: true,
      user: wardenData
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// -------------------------------
// SUBMIT COMPLAINT
// -------------------------------

app.post("/complaint", async (req, res) => {
  try {

    const {
      studentName,
      registerNumber,
      hostelBlock,
      complaintType,
      description,
      studentEmail
    } = req.body;

    const id = Math.random().toString(36).substring(2, 10);

    const createdAt = new Date().toISOString();

    await dbRun(
      `INSERT INTO complaints
      (id,studentName,registerNumber,hostelBlock,complaintType,description,status,createdAt,studentEmail)
      VALUES(?,?,?,?,?,?,?,?,?)`,
      [
        id,
        studentName,
        registerNumber,
        hostelBlock,
        complaintType,
        description,
        "Pending",
        createdAt,
        studentEmail
      ]
    );

    res.json({
      success: true,
      message: "Complaint Submitted Successfully"
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// -------------------------------
// GET COMPLAINTS
// -------------------------------

app.get("/complaints", async (req, res) => {

  try {

    const { studentEmail } = req.query;

    if (studentEmail) {

      const complaints = await dbAll<Complaint>(
        "SELECT * FROM complaints WHERE LOWER(studentEmail)=?",
        [(studentEmail as string).toLowerCase()]
      );

      return res.json({
        success: true,
        complaints
      });

    }

    const complaints = await dbAll<Complaint>(
      "SELECT * FROM complaints ORDER BY createdAt DESC"
    );

    res.json({
      success: true,
      complaints
    });

  } catch (err: any) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});
// -------------------------------
// UPDATE COMPLAINT STATUS
// -------------------------------

app.put("/complaint/status", async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID and Status are required."
      });
    }

    const complaint = await dbGet<Complaint>(
      "SELECT * FROM complaints WHERE id=?",
      [id]
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found."
      });
    }

    await dbRun(
      "UPDATE complaints SET status=? WHERE id=?",
      [status, id]
    );

    res.json({
      success: true,
      message: "Complaint status updated successfully."
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// -------------------------------
// GEMINI CHATBOT
// -------------------------------

app.post("/chat", async (req, res) => {

  try {

    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required."
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
You are a Hostel Management Assistant.

Answer ONLY hostel related questions.

Examples:
- Hostel Rules
- Complaint Status
- Mess Timings
- WiFi
- Leave
- Maintenance
- Room Change

If the question is unrelated reply:

"I can only assist with hostel related questions."
`;

    const contents: any[] = [];

    if (history && Array.isArray(history)) {
      history.forEach((item: any) => {
        contents.push({
          role: item.sender === "user" ? "user" : "model",
          parts: [
            {
              text: item.text
            }
          ]
        });
      });
    }

    contents.push({
      role: "user",
      parts: [
        {
          text: message
        }
      ]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({
      success: true,
      reply: response.text
    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

// --------------------------------
// START SERVER
// --------------------------------

async function startServer() {

  if (process.env.NODE_ENV !== "production") {

    const vite = await createViteServer({
      server: {
        middlewareMode: true
      },
      appType: "spa"
    });

    app.use(vite.middlewares);

    console.log("Vite middleware loaded.");

  } else {

    const dist = path.join(process.cwd(), "dist");

    app.use(express.static(dist));

    app.get("*", (req, res) => {
      res.sendFile(path.join(dist, "index.html"));
    });

  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `🚀 Hostel Management Agent running on http://localhost:${PORT}`
    );
  });

  server.on("error", (err) => {
    console.error("Server Error:", err);
  });

}

startServer();

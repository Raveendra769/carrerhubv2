import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes";
import authMiddleware from "./middleware/authMiddleware";
import roleMiddleware from "./middleware/roleMiddleware";
import { AuthRequest } from "./types/auth";
dotenv.config({ path: "./.env" });

/* =========================
   INIT
========================= */
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

/* =========================
   FILE UPLOAD (MULTER)
========================= */
const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF allowed"));
    }
  }
});

// serve uploaded files
app.use("/uploads", express.static(uploadPath));

/* =========================
   MongoDB
========================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/careerhub")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* =========================
   SCHEMA
========================= */
const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true, // 🔥 prevents duplicates
      lowercase: true,
      trim: true
    },
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
    position: String,
    resume: String,
    stage: {
      type: String,
      enum: ["Applied", "Interview", "Offer"],
      default: "Applied"
    }
  },
  { timestamps: true } // 🔥 adds createdAt
);

const Candidate = mongoose.model("Candidate", candidateSchema);

/* =========================
   EMAIL API
========================= */
app.post("/send-email", async (req: any, res: Response) => {
  const { email, name, status } = req.body;

  // 🔥 DEBUG LOGS (VERY IMPORTANT)
  console.log("🚀 EMAIL ROUTE ENTERED");
  console.log("BODY:", req.body);
  console.log("EMAIL USER:", process.env.EMAIL_USER);
  console.log("EMAIL PASS EXISTS:", !!process.env.EMAIL_PASS);

  if (!email || !name || !status) {
    return res.status(400).json({
      message: "Missing email, name, or status",
    });
  }

  const statusLower = status.toLowerCase();

  let message = "";

  switch (statusLower) {
    case "applied":
      message = `Hello ${name}, your application has been received.`;
      break;

    case "interview":
      message = `Hello ${name}, you are selected for interview.`;
      break;

    case "offer":
      message = `Congrats ${name}, you got an offer 🎉`;
      break;

    case "rejected":
      message = `Sorry ${name}, your application was rejected.`;
      break;

    default:
      return res.status(400).json({
        message: "Invalid status received",
      });
  }

  try {
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
await transporter.sendMail({
  from: '"CareerHub" <kodatiraveendra@gmail.com>',
  to: email,
  subject: "CareerHub Update",
  html: `<h2>${message}</h2>`,
});

    console.log("✅ EMAIL SENT SUCCESSFULLY");

    res.json({ message: "Email sent successfully" });
  } catch (err: any) {
    console.error("❌ EMAIL ERROR:", err);

    res.status(500).json({
      message: "Email sending failed",
      error: err?.message || err,
    });
  }
});

/* =========================
   CANDIDATE APIs
========================= */

// ✅ GET (sorted latest first)
app.get("/candidates", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let data;

  if (user.role === "admin") {
    data = await Candidate.find().sort({ createdAt: -1 });
  } else {
    data = await Candidate.find({ createdBy: user.id }).sort({ createdAt: -1 });
  }

  res.json(data);
});
// ✅ ADD (WITH RESUME + duplicate check)
app.post(
  "/candidates",
  authMiddleware,
  roleMiddleware(["admin", "recruiter"]),
  upload.single("resume"),
  async (req: AuthRequest, res: Response) => {
    try {

      // ✅ ALWAYS define first
      const user = req.user;

      // ✅ safety check
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { name, email, position, stage } = req.body;

      const existing = await Candidate.findOne({
        email: email.toLowerCase().trim()
      });

      if (existing) {
        return res.status(400).json({
          message: "Candidate with this email already exists"
        });
      }

      const newCandidate = new Candidate({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        position,
        stage,
        resume: req.file?.filename,

        // ✅ THIS WILL NOW WORK
        createdBy: user.id
      });

      await newCandidate.save();
      res.json(newCandidate);

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// ✅ UPDATE
app.put(
  "/candidates/:id",
  authMiddleware,
  roleMiddleware(["admin", "recruiter"]),
  async (req: AuthRequest, res: Response)=> {
    try {
      const updated = await Candidate.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: "after" }
      );

      if (!updated) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Update failed" });
    }
  }
);
// ✅ DELETE
app.delete(
  "/candidates/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req: AuthRequest, res: Response) => {
    try {
      const deleted = await Candidate.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          message: "Candidate not found",
        });
      }

      return res.json({
        message: "Deleted successfully",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Delete failed",
      });
    }
  }
);

/* =========================
   ERROR HANDLER
========================= */
app.use((err: any, req: Request, res: Response, next: any) => {
  if (err.message === "Only PDF allowed") {
    return res.status(400).json({ message: "Only PDF files are allowed" });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

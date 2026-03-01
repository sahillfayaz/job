const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");


const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);   // ✅ FIXED
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  }
});

// APPLY FOR JOB
router.post("/:jobId", protect, upload.single("resume"), async (req, res) => {

  try {

    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply" });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = new Application({
  job: req.params.jobId,
  candidate: req.user.id,
  resume: req.file ? req.file.path : null
});


    await application.save();

// Get candidate details
const candidate = await User.findById(req.user.id);

// Send confirmation email
await sendEmail(
  candidate.email,
  "Job Application Submitted",
  `You have successfully applied for ${job.title}`
);

res.status(201).json({ message: "Applied successfully" });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET APPLICATIONS FOR A JOB (Employer Only)
router.get("/job/:jobId", protect, async (req, res) => {
  try {

    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers allowed" });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Make sure this employer owns this job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view applicants" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// UPDATE APPLICATION STATUS (Employer Only)
router.put("/:applicationId", protect, async (req, res) => {
  try {

    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers allowed" });
    }

    const application = await Application.findById(req.params.applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check employer owns the job
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = req.body.status;

await application.save();

// 🔽 SEND EMAIL TO CANDIDATE
const candidate = await User.findById(application.candidate);

await sendEmail(
  candidate.email,
  "Application Status Updated",
  `Your application for "${application.job.title}" is now: ${application.status}`
);

// 🔼 END EMAIL PART

res.json({ message: "Application status updated", application });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET APPLICATIONS FOR LOGGED-IN CANDIDATE
router.get("/", protect, async (req, res) => {
  try {

    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates allowed" });
    }

    const applications = await Application.find({
      candidate: req.user.id
    }).populate("job");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

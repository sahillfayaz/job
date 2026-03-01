const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const protect = require("../middleware/authMiddleware");


// CREATE JOB
router.post("/", protect, async (req, res) => {
  try {

    // Allow only employers
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = new Job({
      ...req.body,
      employer: req.user.id
    });

    await job.save();
    res.status(201).json(job);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// GET ALL JOBS

// GET MY JOBS (Employer Only)
router.get("/my", protect, async (req, res) => {
  try {

    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers allowed" });
    }

    const jobs = await Job.find({ employer: req.user.id });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {

    const { title, location, page = 1, limit = 5 } = req.query;

    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(filter)
      .populate("employer")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      jobs
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;

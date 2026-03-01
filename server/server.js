const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const fs = require("fs");

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));




app.get("/", (req, res) => {
  res.send("Job Board API Running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

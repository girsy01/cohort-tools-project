const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const cohortsJSON = require("./cohorts.json");
const studentsJSON = require("./students.json");
const FRONTEND_URL = process.env.ORIGIN || `http://localhost:${PORT}`;

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

//install mongoose
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-project")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to Mongo", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: [FRONTEND_URL],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
//cohort routes
app.post("/api/cohorts", (req, res) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
    .then((createdCohort) => {
      console.log("Cohort created: ", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create the cohort" });
    });
});
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohort) => {
      console.log("Found cohorts:", cohort);
      res.status(200).json(cohort);
    })
    .catch((err) => console.log(err));
});
//student routes
app.post("/api/students", (req, res) => {
  Student.create();
});
app.get("/api/students", (req, res) => {
  Student.find({})
    .then((student) => {
      console.log("Found students:", student);
      res.status(200).json(student);
    })
    .catch((err) => console.log(err));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

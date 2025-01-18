const Student = require("../models/Student.model.js");

const router = require("express").Router();

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               linkedinUrl:
 *                 type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               program:
 *                 type: string
 *               background:
 *                 type: string
 *               image:
 *                 type: string
 *               cohort:
 *                 type: string
 *               projects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 *       500:
 *         description: Failed to create the student
 */
router.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects,
  })
    .then((student) => {
      console.log("Student created:", student);
      res.status(201).json(student);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to create the student." });
    });
});

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Retrieve all students
 *     tags:
 *       - Students
 *     responses:
 *       200:
 *         description: List of all students
 *       500:
 *         description: Failed to retrieve students
 */
router.get("/api/students", (req, res, next) => {
  Student.find({})
    .populate("cohort")
    .then((student) => {
      console.log("Found students:", student);
      res.status(200).json(student);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

/**
 * @swagger
 * /api/students/cohort/{cohortId}:
 *   get:
 *     summary: Retrieve students by cohort ID
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: cohortId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cohort
 *     responses:
 *       200:
 *         description: List of students in the cohort
 *       500:
 *         description: Failed to retrieve students
 */
router.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const cohortId = req.params.cohortId;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((student) => {
      console.log("Found students:", student);
      res.status(200).json(student);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to load students." });
      next(err);
    });
});

/**
 * @swagger
 * /api/students/{studentId}:
 *   get:
 *     summary: Retrieve a student by ID
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student
 *     responses:
 *       200:
 *         description: Student details
 *       500:
 *         description: Failed to retrieve the student
 */
router.get("/api/students/:studentId", (req, res, next) => {
  const studentId = req.params.studentId;
  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      console.log("Found student:", student);
      res.status(200).json(student);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to load the student." });
      next(err);
    });
});

/**
 * @swagger
 * /api/students/{studentId}:
 *   put:
 *     summary: Update a student's details
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       500:
 *         description: Failed to update the student
 */
router.put("/api/students/:studentId", (req, res, next) => {
  const studentId = req.params.studentId;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((student) => {
      console.log("Updated student:", student);
      res.status(200).json(student);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to update the student." });
      next(err);
    });
});

/**
 * @swagger
 * /api/students/{studentId}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       500:
 *         description: Failed to delete the student
 */
router.delete("/api/students/:studentId", (req, res, next) => {
  const studentId = req.params.studentId;
  Student.findByIdAndDelete(studentId)
    .then((student) => {
      console.log("Student deleted.");
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to delete the student." });
      next(err);
    });
});

module.exports = router;

const Cohort = require("../models/Cohort.model");

const router = require("express").Router();

/**
 * @swagger
 * /api/cohorts:
 *   post:
 *     summary: Create a new cohort
 *     tags:
 *       - Cohorts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Cohort created successfully
 *       500:
 *         description: Failed to create the cohort
 */
router.post("/api/cohorts", (req, res, next) => {
  Cohort.create(req.body)
    .then((createdCohort) => {
      console.log("Cohort created: ", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create the cohort" });
      next(err);
    });
});

/**
 * @swagger
 * /api/cohorts:
 *   get:
 *     summary: Retrieve all cohorts
 *     tags:
 *       - Cohorts
 *     responses:
 *       200:
 *         description: List of all cohorts
 *       500:
 *         description: Failed to retrieve cohorts
 */
router.get("/api/cohorts", (req, res, next) => {
  Cohort.find({})
    .then((cohort) => {
      console.log("Found cohorts:", cohort);
      res.status(200).json(cohort);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

/**
 * @swagger
 * /api/cohorts/{cohortId}:
 *   get:
 *     summary: Retrieve a cohort by ID
 *     tags:
 *       - Cohorts
 *     parameters:
 *       - in: path
 *         name: cohortId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cohort
 *     responses:
 *       200:
 *         description: Cohort details
 *       500:
 *         description: Failed to retrieve the cohort
 */
router.get("/api/cohorts/:cohortId", (req, res, next) => {
  const cohortId = req.params.cohortId;
  Cohort.findById(cohortId)
    .then((cohort) => {
      console.log("Found cohort:", cohort);
      res.status(200).json(cohort);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to load the cohort." });
      next(err);
    });
});

/**
 * @swagger
 * /api/cohorts/{cohortId}:
 *   put:
 *     summary: Update a cohort's details
 *     tags:
 *       - Cohorts
 *     parameters:
 *       - in: path
 *         name: cohortId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cohort
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cohort updated successfully
 *       500:
 *         description: Failed to update the cohort
 */
router.put("/api/cohorts/:cohortId", (req, res, next) => {
  const cohortId = req.params.cohortId;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((cohort) => {
      console.log("Updated cohort:", cohort);
      res.status(200).json(cohort);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to update the cohort." });
      next(err);
    });
});

/**
 * @swagger
 * /api/cohorts/{cohortId}:
 *   delete:
 *     summary: Delete a cohort by ID
 *     tags:
 *       - Cohorts
 *     parameters:
 *       - in: path
 *         name: cohortId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cohort
 *     responses:
 *       200:
 *         description: Cohort deleted successfully
 *       500:
 *         description: Failed to delete the cohort
 */
router.delete("/api/cohorts/:cohortId", (req, res, next) => {
  const cohortId = req.params.cohortId;
  Cohort.findByIdAndDelete(cohortId)
    .then((cohort) => {
      console.log("Cohort deleted.");
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to delete the cohort." });
      next(err);
    });
});

module.exports = router;

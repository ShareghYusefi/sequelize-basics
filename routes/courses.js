// router is used to create routes in express in a separate file
const router = require("express").Router();
const Course = require("../models/course");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });

// Get all courses
// localhost:3000/courses
router.get("/courses", (req, res) => {
  // Use the Course model to query database
  Course.findAll()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Get a single course
// localhost:3000/courses/1
router.get("/courses/:id", (req, res) => {
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  Course.findByPk(id)
    .then((course) => {
      // if course is not found
      if (!course) {
        res.status(404).send({
          message: "Course not found.",
        });
      }
      res.status(200).send(course);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Post to create a course
// localhost:3000/courses
router.post("/courses", upload.single("cover"), (req, res) => {
  let filePath = "";
  if (req.file) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    filePath =
      req.file.fieldname +
      "-" +
      uniqueSuffix +
      "." +
      req.file.mimetype.split("/")[1];
  }

  Course.create({
    name: req.body.name,
    cover: filePath,
    level: req.body.level,
  })
    .then((course) => {
      res.status(201).send(course);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Patch to update a course
// localhost:3000/courses/1
router.patch("/courses/:id", upload.single("cover"), (req, res) => {
  let filePath = "";
  if (req.file) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    filePath =
      req.file.fieldname +
      "-" +
      uniqueSuffix +
      "." +
      req.file.mimetype.split("/")[1];
  }
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  Course.findByPk(id)
    .then((course) => {
      // if course is not found
      if (!course) {
        res.status(404).send({
          message: "Course not found.",
        });
      }
      // update the course record
      course.name = req.body.name;
      course.cover = filePath;
      course.level = req.body.level;

      // persist update to database using save function - this returns a promise object
      course
        .save()
        .then((course) => {
          res.status(200).send(course);
        })
        .catch((err) => {
          res.status(500).send({
            message: "Database connection failed.",
            error: err.stack,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Delete a course
// localhost:3000/courses/1
router.delete("/courses/:id", (req, res) => {
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  Course.findByPk(id)
    .then((course) => {
      // if course is not found
      if (!course) {
        res.status(404).send({
          message: "Course not found.",
        });
      }

      // destroy the course record
      course
        .destroy()
        .then((course) => {
          res.status(200).send(course);
        })
        .catch((err) => {
          res.status(500).send({
            message: "Database connection failed.",
            error: err.stack,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// export the router
module.exports = router;

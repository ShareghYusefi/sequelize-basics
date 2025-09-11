// router is used to create routes in express in a separate file
const router = require("express").Router();
const Course = require("../models/course");
const multer = require("multer");
const { upload, filePath } = require("../utils/upload");
const File = require("../models/file");

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
// save each file to uploads folder via upload.array
router.post("/courses", upload.array("files"), (req, res) => {
  // For now, we'll just save the file path of the first uploaded file to the cover field
  let path = "";
  if (req.files[0]) {
    path = filePath(req.files[0]);
  }

  Course.create({
    name: req.body.name,
    cover: path, // TODO: remove this later
    level: req.body.level,
  })
    .then((course) => {
      // If there are files uploaded, create File records
      // handle multiple file uploads
      const files = req.files;
      // Save file information to the database
      const filePromises = files.map((file) => {
        const path = filePath(file);

        // save file to db, return the record created from this as a promise so we can use Promise.all to wait for all to complete
        return File.create({
          fileable_id: course.id, // id of the task, user etc
          fileable_type: "Course", // Task, User etc
          name: file.originalname,
          path: path,
          mime_type: file.mimetype,
          size: file.size,
        });
      });

      // promise.all will wait for all the promises in the array to resolve before sending a response
      Promise.all(filePromises)
        .then((fileRecords) => {
          // once all files have uploaded, send one success response
          res.status(201).send({ course, files: fileRecords });
        })
        .catch((err) => {
          res.status(500).send({
            message: "File upload database connection failed.",
            error: err.stack,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Course creation database connection failed.",
        error: err.stack,
      });
    });
});

// Patch to update a course
// localhost:3000/courses/1
router.patch("/courses/:id", upload.single("cover"), (req, res) => {
  let path = "";
  if (req.file) {
    path = filePath(req.file);
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
      course.cover = path;
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

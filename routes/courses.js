// router is used to create routes in express within a separate file
const router = require("express").Router();
// import course model
const Course = require("../models/course");
const File = require("../models/file");
const upload = require("../middlewares/fileUpload");

// localhost:3000/courses
router.get("/courses", (req, res) => {
  Course.findAll()
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// localhost:3000/courses/1
router.get("/courses/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  //   find the course with id, the result is going be a course object
  // inlcude associated file record as well
  Course.findByPk(id, {
    include: [
      {
        model: File,
        as: "cover",
      },
    ],
  })
    .then((course) => {
      // if course is undefined or null, we return 404
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
  var newCourse = {
    name: req.body.name,
    level: req.body.level,
  };

  // update the database with new course
  Course.create(newCourse)
    .then((course) => {
      // insert file record in the database
      if (req.file) {
        File.create({
          fileable_id: course.id,
          fileable_type: "course",
          filename: req.file.filename,
          fileUrl: `/uploads/${req.file.filename}`,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        });
      }
      // return the created course object as response
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
router.patch("/courses/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  // find the course with id, the result is going be a course object
  Course.findByPk(id)
    .then((course) => {
      // if course is undefined or null, we return 404
      if (!course) {
        res.status(404).send({
          message: "Course not found.",
        });
      }

      // update the course record
      course.name = req.body.name;
      course.level = req.body.level;

      // persist update to dtabase using save() - this returns a promise object as well.
      course
        .save()
        .then((course) => {
          res.status(200).send(course);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
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

// Put to override course object
// localhost:3000/courses/1
// router.put("/courses/:id", (req, res) => {
//   // We can grand id from the URL query parameters
//   var id = parseInt(req.params.id); // convert string id to integer
//   //   find the course with id, the result is going be a course object
//   var course = courses.find((u) => {
//     return u.id === id;
//   });

//   // if course is undefined, we return 404
//   if (!course) {
//     res.status(404).send({
//       message: "Course not found.",
//     });
//   }

//   // update the course that is found
//   course.id = req.body.id;
//   course.coursename = req.body.coursename;
//   course.email = req.body.email;

//   res.status(200).send(course);
// });

// Delete a course
// localhost:3000/courses/1
router.delete("/courses/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  // find the course with id, the result is going be a course object
  Course.findByPk(id)
    .then((course) => {
      // if course is undefined or null, we return 404
      if (!course) {
        res.status(404).send({
          message: "Course not found.",
        });
      }

      // destroy the course record - this does return a promise object
      course
        .destroy()
        .then((course) => {
          res.status(200).send(course);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
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

module.exports = router;

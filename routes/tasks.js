// router is used to create routes in express in a separate file
const router = require("express").Router();
const Task = require("../models/task");

// Get all tasks
// localhost:3000/tasks
router.get("/tasks", (req, res) => {
  // Use the Task model to query database
  Task.findAll()
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

// Get a single task
// localhost:3000/tasks/1
router.get("/tasks/:id", (req, res) => {
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  Task.findByPk(id)
    .then((task) => {
      // if task is not found
      if (!task) {
        res.status(404).send({
          message: "Task not found.",
        });
      }
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Post to create a task
// localhost:3000/tasks
router.post("/tasks", (req, res) => {
  Task.create({
    title: req.body.title,
    description: req.body.description,
    priority_level: req.body.priority_level,
    user_id: req.body.user_id ?? 1,
  })
    .then((task) => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Patch to update a task
// localhost:3000/tasks/1
router.patch("/tasks/:id", (req, res) => {
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  Task.findByPk(id)
    .then((task) => {
      // if task is not found
      if (!task) {
        res.status(404).send({
          message: "Task not found.",
        });
      }
      // update the task record
      task.title = req.body.title;
      task.description = req.body.description;
      task.priority_level = req.body.priority_level;
      task.user_id = req.body.user_id ?? 1;

      // persist update to database using save function - this returns a promise object
      task
        .save()
        .then((task) => {
          res.status(200).send(task);
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

// Delete a task
// localhost:3000/tasks/1
router.delete("/tasks/:id", (req, res) => {
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  Task.findByPk(id)
    .then((task) => {
      // if task is not found
      if (!task) {
        res.status(404).send({
          message: "Task not found.",
        });
      }

      // destroy the task record
      task
        .destroy()
        .then((task) => {
          res.status(200).send(task);
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

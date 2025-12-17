// router is used to create routes in express within a separate file
const router = require("express").Router();
// import task model
const Task = require("../models/task");

// localhost:3000/tasks
router.get("/tasks", (req, res) => {
  Task.findAll()
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

// localhost:3000/tasks/1
router.get("/tasks/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  //   find the task with id, the result is going be a task object
  Task.findByPk(id)
    .then((task) => {
      // if task is undefined or null, we return 404
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
  var newTask = {
    title: req.body.title,
    description: req.body.description,
    priority_level: req.body.priority_level,
    user_id: req.body.user_id ?? 1,
  };

  // update the database with new task
  Task.create(newTask)
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
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  // find the task with id, the result is going be a task object
  Task.findByPk(id)
    .then((task) => {
      // if task is undefined or null, we return 404
      if (!task) {
        res.status(404).send({
          message: "Task not found.",
        });
      }

      // update the task record
      task.title = req.body.title;
      task.description = req.body.description;
      task.priority_level = req.body.priority_level;
      task.user_id = req.body.user_id;

      // persist update to dtabase using save() - this returns a promise object as well.
      task
        .save()
        .then((task) => {
          res.status(200).send(task);
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

// Put to override task object
// localhost:3000/tasks/1
// router.put("/tasks/:id", (req, res) => {
//   // We can grand id from the URL query parameters
//   var id = parseInt(req.params.id); // convert string id to integer
//   //   find the task with id, the result is going be a task object
//   var task = tasks.find((u) => {
//     return u.id === id;
//   });

//   // if task is undefined, we return 404
//   if (!task) {
//     res.status(404).send({
//       message: "Task not found.",
//     });
//   }

//   // update the task that is found
//   task.id = req.body.id;
//   task.taskname = req.body.taskname;
//   task.email = req.body.email;

//   res.status(200).send(task);
// });

// Delete a task
// localhost:3000/tasks/1
router.delete("/tasks/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  // find the task with id, the result is going be a task object
  Task.findByPk(id)
    .then((task) => {
      // if task is undefined or null, we return 404
      if (!task) {
        res.status(404).send({
          message: "Task not found.",
        });
      }

      // destroy the task record - this does return a promise object
      task
        .destroy()
        .then((task) => {
          res.status(200).send(task);
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

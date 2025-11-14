// router is used to create routes in express within a separate file
const router = require("express").Router();
const Task = require("../models/task");
// import user model
const User = require("../models/user");

// localhost:3000/users
router.get("/users", (req, res) => {
  User.findAll()
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

// localhost:3000/users/1
router.get("/users/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  //   find the user with id, the result is going be a user object
  User.findByPk(id, {
    include: Task,
  })
    .then((user) => {
      // if user is undefined or null, we return 404
      if (!user) {
        res.status(404).send({
          message: "User not found.",
        });
      }

      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Post to create a user
// localhost:3000/users
router.post("/users", (req, res) => {
  var newUser = {
    email: req.body.email,
    password: req.body.password,
  };

  // update the database with new user
  User.create(newUser)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Database connection failed.",
        error: err.stack,
      });
    });
});

// Patch to update a user
// localhost:3000/users/1
router.patch("/users/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  // find the user with id, the result is going be a user object
  User.findByPk(id)
    .then((user) => {
      // if user is undefined or null, we return 404
      if (!user) {
        res.status(404).send({
          message: "User not found.",
        });
      }

      // update the user record
      user.email = req.body.email;
      user.password = req.body.password;

      // persist update to dtabase using save() - this returns a promise object as well.
      user
        .save()
        .then((user) => {
          res.status(200).send(user);
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

// Put to override user object
// localhost:3000/users/1
// router.put("/users/:id", (req, res) => {
//   // We can grand id from the URL query parameters
//   var id = parseInt(req.params.id); // convert string id to integer
//   //   find the user with id, the result is going be a user object
//   var user = users.find((u) => {
//     return u.id === id;
//   });

//   // if user is undefined, we return 404
//   if (!user) {
//     res.status(404).send({
//       message: "User not found.",
//     });
//   }

//   // update the user that is found
//   user.id = req.body.id;
//   user.username = req.body.username;
//   user.email = req.body.email;

//   res.status(200).send(user);
// });

// Delete a user
// localhost:3000/users/1
router.delete("/users/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  // find the user with id, the result is going be a user object
  User.findByPk(id)
    .then((user) => {
      // if user is undefined or null, we return 404
      if (!user) {
        res.status(404).send({
          message: "User not found.",
        });
      }

      // destroy the user record - this does return a promise object
      user
        .destroy()
        .then((user) => {
          res.status(200).send(user);
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

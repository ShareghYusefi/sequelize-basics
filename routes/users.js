// router is used to create routes in express in a separate file
const router = require("express").Router();
const User = require("../models/user");

// Get all users
// localhost:3000/users
router.get("/users", (req, res) => {
  // Use the User model to query database
  User.findAll()
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

// Get a single user
// localhost:3000/users/1
router.get("/users/:id", (req, res) => {
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  User.findByPk(id)
    .then((user) => {
      // if user is not found
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
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
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
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  User.findByPk(id)
    .then((user) => {
      // if user is not found
      if (!user) {
        res.status(404).send({
          message: "User not found.",
        });
      }
      // update the user record
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;

      // persist update to database using save function - this returns a promise object
      user
        .save()
        .then((user) => {
          res.status(200).send(user);
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

// Delete a user
// localhost:3000/users/1
router.delete("/users/:id", (req, res) => {
  // We can grab id from url query parameters
  var id = parseInt(req.params.id); //convert string to integer
  User.findByPk(id)
    .then((user) => {
      // if user is not found
      if (!user) {
        res.status(404).send({
          message: "User not found.",
        });
      }

      // destroy the user record
      user
        .destroy()
        .then((user) => {
          res.status(200).send(user);
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

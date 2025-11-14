// What is express?
// Express is used to create a web server in node. Express works on a middleware concept(callback function).
const express = require("express");
const cors = require("cors");
const app = express();

// Create the connection to database
const sequelize = require("./config");

// import user model
const User = require("./models/user");

// Allows Cross-Origin-Resource sharing
app.use(cors());

// A middleware is a function that has access to the request, response, and next function.
// You can think of it as a layer that sits between the request and response.
function customMiddleware(req, res, next) {
  console.log("Middleware function called!");
  // next function is called to move onto the next middleware function
  next();
}

// use the middlware function when a request comes in to the web server.
app.use(customMiddleware);
// parse JSON to Javascript Object for req.body
app.use(express.json());
// parse x-www-form-urlencoded to Javascript Object for req.body
app.use(express.urlencoded({ extended: true }));

// localhost:3000/users
app.get("/users", (req, res) => {
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
app.get("/users/:id", (req, res) => {
  // We can grand id from the URL query parameters
  var id = parseInt(req.params.id); // convert string id to integer
  //   find the user with id, the result is going be a user object
  User.findByPk(id)
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
app.post("/users", (req, res) => {
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
app.patch("/users/:id", (req, res) => {
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
// app.put("/users/:id", (req, res) => {
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
app.delete("/users/:id", (req, res) => {
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

sequelize
  .sync() // sync create the table in database should it not exist
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// starts a simple http server locally on port 3000
app.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});

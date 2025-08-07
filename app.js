// What is express?
// Express is used to create web server in node. Express works on a middlware concept (callback functions).
const express = require("express");

// import sequelize connection
const sequelize = require("./config");
//import user model
const User = require("./models/user");

// cors is a middleware that allows us to make requests to the backend server from different domains.
var cors = require("cors");
const app = express();

// use cors middleware
app.use(cors());

// A middleware is a function that has access to the request and response object
// you can think of a middleware as a layer that sits between the request and response.
function customMiddleware(req, res, next) {
  console.log("Middleware function called!");
  // next function is called to move onto the next middleware function
  next();
}

// use the middleware function when a request comes in from the web.
app.use(customMiddleware);

// What is a Restful API?
// Restful stands for Representational Stte Transfer.
// API stands for Application Programming Interface.
// A way to design your URL's to interact with the server.

// API's use HTTP methods to interact with ther server.
// GET - Get data
// POST - Send data
// PATCH - Update data
// PUT - Override data
// DELETE - Delete data

// Response contains an HTTP Status Code
// These are codes are used to represent the status of the response from server.
// 200 - Success/Ok
// 201 - Created
// 404 - Not Found
// 400 - Bad Request
// 500 - Internal Server Error

// URL stand for Uniform Resource Locator
// Resource is any type of data that we are storing on the server

// use a built in middleware to parse the body of the request into an object
app.use(
  express.urlencoded({
    extended: true, // parse nested objects within the request
  })
);

// Get all users
// localhost:3000/users
app.get("/users", (req, res) => {
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
app.get("/users/:id", (req, res) => {
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
app.post("/users", (req, res) => {
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
app.patch("/users/:id", (req, res) => {
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
app.delete("/users/:id", (req, res) => {
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

// test the database connection
sequelize
  .sync() // sync create the table in database should it not exist
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// localhost:3000 OR 127.0.0.1:3000 both reference the current server
app.listen(3000);

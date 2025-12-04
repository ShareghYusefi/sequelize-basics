// What is express?
// Express is used to create a web server in node. Express works on a middleware concept(callback function).
const express = require("express");
const cors = require("cors");
const app = express();

// Create the connection to database
const sequelize = require("./config");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const courseRoutes = require("./routes/courses");

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

// Routes
app.use(userRoutes);
app.use(taskRoutes);
app.use(courseRoutes);

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

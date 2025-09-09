// What is express?
// Express is used to create web server in node. Express works on a middlware concept (callback functions).
const express = require("express");

// import sequelize connection
const sequelize = require("./config");
//import user routes
const userRoutes = require("./routes/users");
// import task routes
const taskRoutes = require("./routes/tasks");
const courseRoutes = require("./routes/courses");

// cors is a middleware that allows us to make requests to the backend server from different domains.
var cors = require("cors");
const path = require("path");
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

// use a built in middleware to parse the body of the request into an object
app.use(
  express.urlencoded({
    extended: true, // parse nested objects within the request
  })
);
app.use(express.json());

// use the imported routes
app.use(userRoutes);
app.use(taskRoutes);
app.use(courseRoutes);
// make the uploads folder publicly available
// process.cwd() gives the current working directory of the node process
// express.static serves static files such as images, css files, and js files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

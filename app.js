const fs = require('fs');
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");

//Importing placesRoutes, usersRoutes middlewares
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();
const PORT = process.env.PORT || 5000;

//using bodyParser before the placesRoutes & usersRoutes,
//so that it parses any incoming req body that(req.body) would be used in any of the routes
//here bodyParser receives json and coverts it to corresponding js
//data structures like object, array, string, number, boolean then calls next() automatically
app.use(bodyParser.json());

//to server images statically & handle /uploads/images routes
app.use('/uploads/images', express.static(path.join('uploads','images')))

//Handling CORS Policy
app.use((req, res, next) => {
  //3 headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next(); // is used to let the request continue its journey to other middlewares
});

// Using the placesRoutes middleware in the application
// the use method only passess requests with starting URL of /api/places/.......
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

//Handling errors for unsupproted routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//middleware for Error Handler
app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path, (err) => { //delete received file if error
      console.log(err);
    });
  } //multer adds file property to the request if we do have a file
  if (res.headerSent) {
    return next(error); //we can use "throw error" in synchronus
    //and use next(error) in both sychronous and asynchronous both cases
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

//conection to DB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ktyhmsa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Database connection established");
    });
  })
  .catch((error) => {
    console.log(error);
  });

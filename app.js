const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");

//Importing placesRoutes, usersRoutes middleware
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();
const PORT = process.env.PORT || 5000;

//using bodyParser before the placesRoutes, so that it parses any incoming req body
//here bodyParser receives json and coverts it to corresponding js
//data structures like object, array, string, number, boolean then calls next() automatically
app.use(bodyParser.json());

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
  if (res.headerSent) {
    return next(error); //we can use "throw error" in synchronus
    //and use next(error) in both sychronous and asynchronous both cases
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

//conection to DB
mongoose
  .connect('mongodb+srv://mrinmoy21pal:EnT6JAOzK5NiKqKi@cluster0.ktyhmsa.mongodb.net/curioplaces?retryWrites=true&w=majority')
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Database connection established");
    });
  })
  .catch((error)=>{
    console.log(error);
  });

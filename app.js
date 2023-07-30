const express = require("express");
const bodyParser = require("body-parser");

//Importing placesRoutes middleware
const placesRoutes = require('./routes/places-routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Using the placesRoutes middleware in the application
// the use method only passess requests with starting URL of /api/places/.......
app.use('/api/places', placesRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

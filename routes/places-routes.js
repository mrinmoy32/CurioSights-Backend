const express = require("express");
const HttpError = require("../models/http-error");
const placesControllers = require('../controllers/places-controller');

const router = express.Router();

router.get("/:placeId", placesControllers.getPlaceById);

//In below route we are adding user befor :userId to make it different from the :placeId
router.get("/user/:userId", placesControllers.getPlaceByUserId);

module.exports = router;

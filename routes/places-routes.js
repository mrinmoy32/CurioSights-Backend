const express = require("express");
const HttpError = require("../models/http-error");
const placesController = require('../controllers/places-controller');

const router = express.Router();

router.get("/:placeId", placesController.getPlaceById);

//In below route we are adding user befor :userId to make it different from the :placeId
router.get("/user/:userId", placesController.getPlacesByUserId);

router.post('/', placesController.createPlace);
router.patch('/:placeId', placesController.updatePlace);
router.delete('/:placeId', placesController.deletePlace);

module.exports = router;

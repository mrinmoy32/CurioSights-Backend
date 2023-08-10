const express = require("express");
const { check } = require("express-validator");
const HttpError = require("../models/http-error");
const placesControllers = require("../controllers/places-controllers");
const router = express.Router();

router.get("/:placeId", placesControllers.getPlaceById);

//In below route we are adding /user befor :userId to make it different from the :placeId
router.get("/user/:userId", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);
router.patch(
  "/:placeId",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  placesControllers.updatePlace
);
router.delete("/:placeId", placesControllers.deletePlace);

module.exports = router;

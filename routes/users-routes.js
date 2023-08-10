const express = require("express");
const { check } = require("express-validator");
const HttpError = require("../models/http-error");
const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail() // Test@test.com -> test@test.com
    .isEmail(), // checks if valid email using express validator
    check("password").isLength({ min: 8 }),
    check("places").not().isEmpty(),
  ],
  usersControllers.signup
);
router.post("/login", usersControllers.login); //validation not need as in login method 
//inside users-controller there is already check if email matches and pwd matches with data in DB
//we can still add similar checks as used in signin if we want to

module.exports = router;

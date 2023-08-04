const express = require("express");
const HttpError = require("../models/http-error");
const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get("/", usersController.getUers);
router.post('/signup', usersController.signup);
router.post('/login', usersController.login);


module.exports = router;

// const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");

//dummy userslist data
// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Mrinmoy Pal",
//     image: "https://avatars.githubusercontent.com/u/109314855?v=4",
//     places: 17,
//     email: "test1@yo.com",
//     password: "Test@123",
//   },
//   {
//     id: "u2",
//     name: "Manoj Mahesh",
//     image: "https://avatars.githubusercontent.com/u/42727681?v=4",
//     places: 29,
//     email: "test2@yo.com",
//     password: "Tester321",
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //this is projection and will return
    //all details except password
  } catch (error) {
    return next(new HttpError("Could not fetch users, please try again", 500));
  }

  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs from user, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;
  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("User alreay exists", 422);
  // }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up Failed, please check DB connection",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  //Hasing pwd using bcryptjs
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //here I used 12 as salting round, hash return a promise
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  // const userId = uuidv4();//not needed as mongoDB would create the id for the user
  const createdUser = new User({
    // id: userId,
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });
  // DUMMY_USERS.push(createdUser);

  try {
    console.log(createdUser);
    await createdUser.save(); //save() will create a new doc in mongo collection, also its a promise
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed adding new user, please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1hr" } // "super*secret-key_dont_share" is the secret key it could be anything
    );
  } catch (err) {
    console.log(error);
    return next(new HttpError("Failed adding new user, please try again", 500));
  }

  res.status(201).json({
    message: "New user added",
    user: createdUser.toObject({ getters: true }),
    access_token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Login Failed, please check DB connection",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, Could not log you in",
      403
    );
    return next(error);
  }

  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError("No user found for the mail or password", 401);
  // }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check you credentials",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, Could not log you in",
      422
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1hr" } // "super*secret-key_dont_share" is the secret key it could be anything
    );
  } catch (err) {
    console.log(error);
    return next(new HttpError("Loging in failed, please try again", 500));
  }

  res.json({
    message: "User Logged In",
    user: existingUser.toObject({ getters: true }),
    access_token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

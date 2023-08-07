const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

//dummy userslist data
const DUMMY_USERS = [
  {
    id: "u1",
    name: "Mrinmoy Pal",
    image: "https://avatars.githubusercontent.com/u/109314855?v=4",
    places: 17,
    email: "test1@yo.com",
    password: "Test@123",
  },
  {
    id: "u2",
    name: "Manoj Mahesh",
    image: "https://avatars.githubusercontent.com/u/42727681?v=4",
    places: 29,
    email: "test2@yo.com",
    password: "Tester321",
  },
];

const getUsers = (req, res, next) => {
  if (DUMMY_USERS.length === 0) {
    throw new HttpError("No users found", 404);
  }
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs from user, please check your data", 422)
    );
  }

  const { name, email, password, places } = req.body;
  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("User alreay exists", 422);
  // }

  let existingUser;
  try {
    const existingUser = await User.findOne({ email: email });
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

  // const userId = uuidv4();//not needed as mongoDB would create the id for the user
  const createdUser = new User({
    // id: userId,
    name,
    email,
    password,
    image: "https://avatars.githubusercontent.com/u/109314855?v=4",
    places,
  });
  // DUMMY_USERS.push(createdUser);

  try {
    console.log(createdUser)
    await createdUser.save(); //save() will create a new doc in mongo collection, also its a promise
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed adding new user, please try again", 500));
  }
  res.status(201).json({
    message: "New user added",
    createdUser: createdUser.toObject({ getters: true }),
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("No user found for the mail or password", 401);
  }
  res.json({ message: "User Logged In", identifiedUser });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

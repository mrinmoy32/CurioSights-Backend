const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

//dummy userslist data
const DUMMY_USERS = [
    {
      id: 'u1',
      name: "Mrinmoy Pal",
      image: "https://avatars.githubusercontent.com/u/109314855?v=4",
      places: 17,
      email: "test1@yo.com",
      password: "Test@123"
    },
    {
      id: 'u2',
      name: "Manoj Mahesh",
      image: "https://avatars.githubusercontent.com/u/42727681?v=4",
      places: 29,
      email: "test2@yo.com",
      password: "Tester321"
    }
  ];

const getUsers = (req, res, next) =>{
    if(DUMMY_USERS.length === 0){
        throw new HttpError("No users found", 404);
    }
    res.status(200).json({users: DUMMY_USERS})
}

const signup = (req, res, next) =>{
    const {name, email, password} = req.body;
    const userId = uuidv4();
    const createdUser = {
        id: userId,
        name,
        email,
        password
    };
    DUMMY_USERS.push(createdUser);
    res.status(201).json({message:"New user added", createdUser})
}

const login = (req, res, next) =>{
    const {email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError("No user found for the mail or password", 401);
    }
    res.json({message:"User Logged In", identifiedUser})
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;



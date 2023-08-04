const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

//dummy userslist data
const DUMMY_USERS = [
    {
      id: 'u1',
      name: "Mrinmoy Pal",
      image: "https://avatars.githubusercontent.com/u/109314855?v=4",
      places: 17,
    },
    {
      id: 'u2',
      name: "Manoj Mahesh",
      image: "https://avatars.githubusercontent.com/u/42727681?v=4",
      places: 29,
    }
  ];

const getUsers = (req, res, next) =>{
    if(DUMMY_USERS.length === 0){
        throw new HttpError("No users found", 404);
    }
    res.status(200).json({users: DUMMY_USERS})
}

const signup = (req, res, next) =>{
    
}

const login = (req, res, next) =>{
    
   
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;



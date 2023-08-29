// const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("./util/location");
const mongoose = require("mongoose");

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Tirupati Balaji Temple",
//     description: "Most visited indian temple",
//     imageUrl:
//       "https://blog.thomascook.in/wp-content/uploads/2019/11/tirupati-balaji-temple.jpg.jpg",
//     address: "Tirumala, Tirupati, Andhra Pradesh 517501",
//     location: {
//       lat: 13.683272,
//       lng: 79.347245,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "The Great Wall of China",
//     description: "One of the wonders of the world",
//     imageUrl:
//       "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892506/EducationHub/photos/the-great-wall-of-china.jpg",
//     address: "Jiankou, Huairou District, China",
//     location: {
//       lat: 40.431908,
//       lng: 116.565291,
//     },
//     creator: "u2",
//   },
//   {
//     id: "p3",
//     title: "Machu Picchu",
//     description: "Ancient Inca city in the Andes",
//     imageUrl:
//       "https://cms.valenciatravelcusco.com/media/images/package/sacred-valley-and-machu-picchu-by-train_Z4e2XgX.jpg",
//     address: "Machu Picchu, Aguas Calientes, Peru",
//     location: {
//       lat: -13.163141,
//       lng: -72.545872,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p4",
//     title: "TajMahal",
//     description: "One of the 7 world wonders",
//     coordinates: {
//       lat: 27.1751,
//       lan: 78.0421,
//     },
//     imageUrl:
//       "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFqJTIwbWFoYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
//     address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
//     creator: "u2",
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId; //params provided by express gives us the placeId from req url
  let place;
  try {
    place = await Place.findById(placeId); //findById doesn't return a promise, we can use try-catch
  } catch (error) {
    return next(
      new HttpError("Somthing went wrong, could not find a place", 500)
    );
  }
  //empty object is not falsy value in JavaScript
  //The only falsy values in JS are 0, false, null, undefined, empty string, and NaN.
  if (!Object.keys(place).length) {
    //checks the length of place object
    // return res.status(404).json({message: "Could not find a place for the provided placeId"})
    return next(
      new HttpError("Could not find a place for the provided placeId", 404)
    );
  }
  //The json() method below takes any data that can converted to a json.
  //e.g. object, array, number, string, boolean
  res.json({ place: place.toObject({ getters: true }) }); //toObject converts the mongoose object to JS
  //object and getters: true remove the underscore (_) from id.
  //In js {place} == {place: place}
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId; //params provided by express gives us the placeId from req url
  let places;
  try {
    places = await Place.find({ creator: userId }); //findById doesn't return a promise, we can use try-catch
  } catch (error) {
    return next(
      new HttpError("Somthing went wrong, could not find a place", 500)
    );
  }

  if (!Object.keys(places).length) {
    //checks the length of Places object
    // return res.status(404).json({message: "Could not find a place for the provided userId"})
    // const error = new Error("Could not find a place for the provided userId");
    // error.code = 404;
    return next(
      new HttpError("Could not find places for the provided userId", 404)
    );
  }

  res.json({ places: places.map((p) => p.toObject({ getters: true })) }); //In js {userPlace} == {userPlace: userPlace}
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // res.status(422).json(errors)
    throw new HttpError(
      "Invalid inputs from user, please check your data",
      422
    );
  }

  const { title, description, address, creator } = req.body;
  // const placeId = uuidv4(); //not needed anyomore as DB will generate ID
  //creating a obj literal. below for every prop like title it means title:title as the names are same
  //for location name is differnet so we are using coordinates as value.

  //using getCoordsForAddress BUT IT IS NOT WORKINGMAY BE DUE TO API
  let coordinates = { lat: 27, lan: 30 }; //Using dummy-coordinates
  // try {
  //   // coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }
  //using data model Place
  const createdPlace = new Place({
    // id: placeId,
    title,
    description,
    location: coordinates,
    image: req.file.path,
    address,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(
      new HttpError("Creating place failed, user does not exist", 500)
    );
  }

  if (!user) {
    const error = new HttpError("could not find user for provided id", 404);
    return next(error);
  }

  // DUMMY_PLACES.push(createdPlace);

  //Session & Transaction in mongoose
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    // await createdPlace.save(); //save() will create a new doc in mongo collection, also its a promise
    user.places.push(createdPlace); //here push is not the simple js push, its behind the seen
    //establishes a connection between the 2 Models and only pushes the place id in user doc
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed creating place, please try again", 500));
  }

  res.status(201).json({ message: "New Place Created", place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs from user, please check your data", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;
  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Failed updating place, please try again", 500));
  }

  if(updatedPlace.creator.toString() !== req.useData.userId){
    return next(new HttpError("Failed updating place, user not authorized to update", 401));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (error) {
    return next(
      new HttpError("Failed storing the updated place, please try again", 500)
    );
  }

  res
    .status(200)
    .json({ updatedPlace: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator"); //populate help us to access doc in other collection, this works with use of ref property in mongoose data Model
    console.log(place);
  } catch (error) {
    return next(
      new HttpError(
        "Failed to find the place to be deleted, please try again",
        500
      )
    );
  }

  if (!place) {
    const error = ("could not find place for the id", 404);
    return next(error);
  }
  //creating seesion and transaction for deleting place and removing the placeId in user doc

  if(place.creator.id !== req.useData.userId){
    return next(new HttpError("Failed deleting place, user not authorized to delete", 401));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place); //just like push before pull is also mongoose method
    //pull usee to remove the place id from the places array present in user doc;
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log("Received Error:", error);
    return next(
      new HttpError(
        "Failed to delete the place, please check DB connection",
        500
      )
    );
  }

  fs.unlink(imagePath, (err) => console.log(err));

  // if (!place) {
  //   throw new HttpError("could not find a place for that id", 404);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({
    message: "successfully deleted place",
    place: place.toObject({ getters: true }),
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

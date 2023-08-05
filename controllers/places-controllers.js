const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Tirupati Balaji Temple",
    description: "Most visited indian temple",
    imageUrl:
      "https://blog.thomascook.in/wp-content/uploads/2019/11/tirupati-balaji-temple.jpg.jpg",
    address: "Tirumala, Tirupati, Andhra Pradesh 517501",
    location: {
      lat: 13.683272,
      lng: 79.347245,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "The Great Wall of China",
    description: "One of the wonders of the world",
    imageUrl:
      "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892506/EducationHub/photos/the-great-wall-of-china.jpg",
    address: "Jiankou, Huairou District, China",
    location: {
      lat: 40.431908,
      lng: 116.565291,
    },
    creator: "u2",
  },
  {
    id: "p3",
    title: "Machu Picchu",
    description: "Ancient Inca city in the Andes",
    imageUrl:
      "https://cms.valenciatravelcusco.com/media/images/package/sacred-valley-and-machu-picchu-by-train_Z4e2XgX.jpg",
    address: "Machu Picchu, Aguas Calientes, Peru",
    location: {
      lat: -13.163141,
      lng: -72.545872,
    },
    creator: "u1",
  },
  {
    id: "p4",
    title: "TajMahal",
    description: "One of the 7 world wonders",
    coordinates: {
      lat: 27.1751,
      lan: 78.0421,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFqJTIwbWFoYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    creator: "u2",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId; //params provided by express gives us the placeId from req url
  const place = DUMMY_PLACES.filter((p) => {
    return p.id === placeId;
  });

  //empty object is not falsy value in JavaScript
  //The only falsy values in JS are 0, false, null, undefined, empty string, and NaN.
  if (!Object.keys(place).length) {
    //checks the length of place object
    // return res.status(404).json({message: "Could not find a place for the provided placeId"})
    throw new HttpError("Could not find a place for the provided placeId", 404);
  }
  //The json() method below takes any data that can converted to a json.
  //e.g. object, array, number, string, boolean
  res.json({ place }); //In js {place} == {place: place}
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId; //params provided by express gives us the placeId from req url
  const userPlaces = DUMMY_PLACES.filter((u) => {
    return u.creator === userId;
  });

  if (!Object.keys(userPlaces).length) {
    //checks the length of userPlace object
    // return res.status(404).json({message: "Could not find a place for the provided userId"})
    // const error = new Error("Could not find a place for the provided userId");
    // error.code = 404;
    return next(
      new HttpError("Could not find places for the provided userId", 404)
    );
  }

  res.json({ userPlaces }); //In js {userPlace} == {userPlace: userPlace}
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const placeId = uuidv4();
  //creating a obj literal. below for every prop like title it means title:title as the names are same
  //for location name is differnet so we are using coordinates as value.
  const createdPlace = {
    id: placeId,
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ message: "New Place Created", place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.placeId;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; //creating a copy of updatedPlace
  //this creates a copy of all key value pairs of the old objects and as key value pairs in the new objecr
  //updating in immutable way
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;
  const deletedPlace = DUMMY_PLACES.find((p) => p.id === placeId);
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200);
  res.json({ message: "successfully deleted place", deletedPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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
  ];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId; //params provided by express gives us the placeId from req url
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    // return res.status(404).json({message: "Could not find a place for the provided placeId"})
    throw new HttpError("Could not find a place for the provided placeId", 404);
  }
  //The json() method below takes any data that can converted to a json.
  //e.g. object, array, number, string, boolean
  res.json({ place }); //In js {place} == {place: place}
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.userId; //params provided by express gives us the placeId from req url
    const userPlace = DUMMY_PLACES.find((u) => {
      return u.creator === userId;
    });
  
    if (!userPlace) {
      // return res.status(404).json({message: "Could not find a place for the provided userId"})
      const error = new Error("Could not find a place for the provided placeId");
      error.code = 404;
      return next(
        new HttpError("Could not find a place for the provided placeId", 404)
      );
    }
  
    res.json({ userPlace }); //In js {userPlace} == {userPlace: userPlace}
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
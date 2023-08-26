const multer = require("multer");
const uuid = require("uuid/v1");

//map MIME_TYPES of file extenstions
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

//This fileUpload is a bunch of preconfigured middlewares
const fileUpload = multer({
  limits: 500000, //5KB limit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images'); //destination path
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext); // this generates random filename with correct extension
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; //!! coverts it to false if MIME_TYPE is undefined else true
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  } //in FE everything can be hacked or changed by user with Dev Tools, 
  //so filter & validation is must at the BE also, just like we did for form using express-validator
});

module.exports = fileUpload;

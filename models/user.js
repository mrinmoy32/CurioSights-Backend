const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    image: {type: String, required: true},
    places: {type: String, required: true},
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema); //covention is to keep 1st letter capital for 'Place'
//and also it should be in singular number.

module.exports = User;
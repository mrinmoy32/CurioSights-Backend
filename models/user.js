const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    image: {type: String, required: true},
    places: [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}] //the array tells mongoose
    //that in doc space on this schema we have multiplaces place enties. 
    //Beacuse one use can have multiplace place ids in places
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema); //covention is to keep 1st letter capital for 'User'
//and also it should be in singular number.

module.exports = User;
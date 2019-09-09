let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    location: {type: String, required: false, default: "Barcelona, España" },
    language: {type: String, required: false, default: "Español" },
    gender: {type: String, required: false, default: ""},
    creationDate: Date,
    profileImage: {type: String, required: false, default: "https://randomuserprofile.github.io/logo.png"},
    eventsCreated: {type:Array, required: false, default: []},
    favourites: {type:Array, required: false, default: []}
})

module.exports = mongoose.model('User', userSchema)
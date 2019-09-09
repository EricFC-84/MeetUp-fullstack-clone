let mongoose = require('mongoose')


let eventSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    organizer: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: String,
        profileImage: String
    },
    eventDateStart: Date,
    eventDateEnd: Date,
    eventPlace: String,
    creationDate: Date,
    mainImage: {
        type: String,
        required: false,
        default: "https://weezevent.com/wp-content/uploads/2019/01/12145054/organiser-soiree.jpg"
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    attendants: {
        type: Array,
        required: false,
        default: []
    },

    /*  [{
         _id: {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'User',
             required: false
         },
         name: String,
         email: String
     }], */

    notAttending: {
        type: Array,
        required: false,
        default: []
    }
})

module.exports = mongoose.model('Event', eventSchema)
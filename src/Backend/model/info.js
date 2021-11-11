const mongoose = require('mongoose');

const infoSchema = mongoose.Schema({
    name: String,
    mobile: String,
    addOn: String,
    jobType: String,
    profilePic: String,
    location: String,
    email: String,
    dob:{
        type: Date,
        default: new Date()
    },
    hide:{
        type: Boolean,
        default: false
    },
    show:{
        type: Boolean,
        default: false
    }
})

const Info = mongoose.model('Info', infoSchema);

module.exports = Info;
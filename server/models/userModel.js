const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, index: {unique: true}},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    picture: {type: String},
    authenticated: {
        type: Boolean,
        default: 0
    },
    workouts: [mongoose.Schema.ObjectId],
    meals: [mongoose.Schema.ObjectId]
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
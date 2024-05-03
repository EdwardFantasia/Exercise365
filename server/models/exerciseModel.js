const mongoose = require('mongoose')

const excSchema = new mongoose.Schema({
    id: {type: String}, //api id / generated id if user gen
    name: {type: String},
    force: {type: String},
    equipment: {type: String},
    instructions: {type: String},
    primaryMuscleGroups: [{type: String}],
    primaryMuscles: [{type: String}],
    secondaryMuscleGroups: [{type: String}],
    secondaryMuscles: [{type: String}],
    tags: [{type: String}],
    type: {type: String}
})

const exerciseModel = mongoose.model("exercises", excSchema)

module.exports = exerciseModel
const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    workoutName: {type: String, required: true},
    workoutDesc: {type: String, required: true},
    exercises: [
        {
            exerciseItem: {type: mongoose.Schema.Types.Mixed, required: true}, //mixed due to either holding array of ObjectIds or just one ObjectId
            sets: {type: Number, required: true},
            reps: {type: Number, required: true}
        }
    ]
})

const workoutModel = mongoose.model("workouts", workoutSchema)

module.exports = workoutModel
const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    title: {type: String},
    summary: {type: String},
    instructions: {type: String},
    readyInMinutes: {type: Number},
    imageType: {type: String},
    servings: {type: Number},
    ingredients: [{
        name: {type: String},
        image: {type: String}
    }],
    equipment: [{
        name: {type: String},
        image: {type: String}
    }]
    //to show health info, just using health widget on spoonacular
})

const mealModel = mongoose.model("meal", mealSchema)

module.exports = mealModel
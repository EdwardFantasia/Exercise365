const express = require('express')
const mealModel = require('../models/mealModel')
const userModel = require('../models/userModel')

const router = express.Router()

router.get("/getMeal/:id", async (req, res) => {
    /**
         * Returns meal information to application
         * @param {String} id: MongoDB Object Id used to search for meal
         */
    try{
    const meal = await mealModel.findOne({_id: req.params.id})
    if(meal){
        res.json(meal)
    }
}catch(err){}
})

router.post("/deleteMeal", async (req, res) => {
    /**
         * Deletes meal at index of user's meal array
         * @param {String} username: Username of user to delete meal in recipe book from
         * @param {Integer} index: Index of meal to remove
         */
    try {
        console.log()
        const user = await userModel.findOne({ username: req.body.username })
        if (user){
            user.meals.splice(req.body.index, 1)
            await user.save()
            res.json({success: true})
        }
    }catch(err){
        console.log()
        res.json({success: false})
    }
})

router.post("/createMeal", async (req, res) => {
     /**
         * Creates meal if not in meals collection, gets id if it is in collection, then sends back array of meal MongoDB ObjectIds
         * @param {Array[Integer]} meals: Array of meal ids to add to user's recipe book
         * @param {String} username: username of user to affect
         */
    try {
        const user = await userModel.findOne({ username: req.body.username })
        if (user) {
            let temp = []
            let servResp = []
            for (let i = 0; i < req.body.meals.length; i++) {
                const meal = req.body.meals[i]
                let mealID = ""
                const mealI = await mealModel.findOne({ id: meal.id })
                if (mealI) {
                    mealID = mealI._id;
                } else {
                    const newMeal = await mealModel.create(meal)
                    mealID = newMeal._id
                }
                temp.push(mealID)
                servResp.push({_id: mealID, id: meal.id, title: meal.title, summary: meal.summary})
            }
            user.meals = user.meals.concat(temp)
            await user.save()
            res.json(servResp)
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router
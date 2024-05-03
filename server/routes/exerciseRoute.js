const express = require('express')
const excModel = require('../models/exerciseModel')

const router = express.Router()

router.get("/getExercise/:id", async (req, res) => {
    /**
         * Returns exercise information to application
         * @param {String} id: MongoDB Object Id used to search for exercise
         */
    try{
    const exc = await excModel.findOne({_id: req.params.id})
    if(exc){
        res.json(exc)
    }
} catch(err){}
})

module.exports = router
const express = require('express')
const workoutModel = require('../models/workoutModel')
const excModel = require('../models/exerciseModel')
const userModel = require('../models/userModel')

const router = express.Router()
//TODO: IF THERE IS TIME, CREATE A WAY TO CHECK IF CREATED WORKOUT MATCHES AN EXC IN DB ALREADY (CHECK IF ID INCLUDES EXC365 THEN IF TRUE, CHECK ALL PARAMS EXCEPT ID)

router.post("/deleteWorkout", async (req, res) => {
    /**
         * Adds meals and workouts to user's meals and workouts list
         * @param {String} username: Username of user to affect
         * @param {Number} index: index of workout to remove
         */
    try {
        const user = await userModel.findOne({ username: req.body.username })
        if (user){
            user.workouts.splice(req.body.index, 1)
            await user.save()
            res.json({success: true})
        }
    }catch(err){
        console.log()
        res.json({success: false})
    }
})

router.post("/editWorkout", async (req,res) => {
    /**
         * Adds meals and workouts to user's meals and workouts list
         * @param {Array[String]} exercises: array of exercises to edit
         * @param {String} username: username of user to affect
         */
    try {
        const user = await userModel.findOne({ username: req.body.username })
        if (user) {
            let temp = []
            let serverResp = []
            for(let i = 0; i < req.body.exercises.length; i++){
                let exerciseItem = req.body.exercises[i].exerciseItem
                if(exerciseItem._id){
                    temp.push({exerciseItem: exerciseItem._id, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps})
                    serverResp.push({exerciseItem: {_id: exerciseItem._id, name: exerciseItem.name, instructions: exerciseItem.instructions}, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps})
                }
                else{
                    let exerciseID = ""
                    let newExc
                    if(!Array.isArray(exerciseItem)){
                        let exerciseFind = await excModel.findOne({ id: exerciseItem.id })
                        if(exerciseFind){
                            exerciseID = exerciseFind._id
                        } else{
                            newExc = await excModel.create(exerciseItem)
                            exerciseID = newExc._id
                        }
                        temp.push({exerciseItem: exerciseID, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps})
                        serverResp.push({exerciseItem: {_id: exerciseID, name: exerciseItem.name, instructions: exerciseItem.instructions}, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps})
                    }else{
                        let tmpRand = []
                        let randServArr = []
                        for(let j = 0; j < exerciseItem.length; j++){
                            let exerciseFind = await excModel.findOne({id: exerciseItem[j].id})
                            if(exerciseFind){
                                exerciseID = exerciseFind._id
                            }else{
                                newExc = await excModel.create(exerciseItem[j])
                                exerciseID = newExc._id
                            }
                            tmpRand.push(exerciseID)
                            randServArr.push({_id: exerciseID, name: exerciseItem[j].name, instructions: exerciseItem[j].instructions})
                        }
                        temp.push({exerciseItem: tmpRand, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps })
                        serverResp.push({exerciseItem: randServArr, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps })
                    } 
                }
            }
            console.log(JSON.stringify(temp))
            const workout = await workoutModel.create({ workoutName: req.body.workoutName, workoutDesc: req.body.workoutDesc, exercises: temp })
            console.log(JSON.stringify(workout))
            user.workouts.splice(req.body.index, 1, workout)
            await user.save()
            res.json({resp: serverResp})
        }
    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post("/createWorkout", async (req, res) => {
    /**
         * Creates workout if not already in workout collection then adds objectId to user's workouts list
         * @param {String} username: Username of user to affect
         * @param {Array[String]} exercises: IDs of workouts to add to go through
         */
    //TRY TO REWRITE
    try {
        const user = await userModel.findOne({ username: req.body.username })
        if (user) {
            let temp = []
            let serverResp = [] //response array (name, instructions, objectID)
            for (let i = 0; i < req.body.exercises.length; i++) {
                let exerciseItem = req.body.exercises[i].exerciseItem
                let exerciseID = ""
                if(!Array.isArray(exerciseItem)){
                    let exerciseI = await excModel.findOne({ id: exerciseItem.id })
                    if (exerciseI) {
                        exerciseID = exerciseI._id;
                    } else {
                        let newExercise = await excModel.create(exerciseItem)
                        exerciseID = newExercise._id
                    }
                    temp.push({ exerciseItem: exerciseID, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps })
                    serverResp.push({exerciseItem: {_id: exerciseID, name: exerciseItem.name, instructions: exerciseItem.instructions}, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps})
                }else{
                    let tmpRand = []
                    let randServArr = []
                    for(let j = 0; j < exerciseItem.length; j++){
                        let exerciseI = await excModel.findOne({ id: exerciseItem[j].id })
                        if (exerciseI) {
                            exerciseID = exerciseI._id;
                        } else {
                            let newExercise = await excModel.create(exerciseItem[j])
                            exerciseID = newExercise._id
                        }
                        tmpRand.push(exerciseID)
                        randServArr.push({_id: exerciseID, name: exerciseItem[j].name, instructions: exerciseItem[j].instructions})
                    }
                    temp.push({exerciseItem: tmpRand, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps })
                    serverResp.push({exerciseItem: randServArr, sets: req.body.exercises[i].sets, reps: req.body.exercises[i].reps })
                }
            }
            const workout = await workoutModel.create({ workoutName: req.body.workoutName, workoutDesc: req.body.workoutDesc, exercises: temp })
            user.workouts.push(workout._id)
            await user.save()
            res.json({resp: serverResp})
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router
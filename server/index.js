const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const userRoute = require('./routes/userRoute')
const mealRoute = require('./routes/mealRoute')
const workoutRoute = require('./routes/workoutRoute')
const exerciseRoute = require('./routes/exerciseRoute')

const app = express()
app.use(cors())
app.use(express.json({limit: '500mb'}))
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/users", userRoute)
app.use("/workouts", workoutRoute)
app.use("/exercises", exerciseRoute)
app.use("/meals", mealRoute)

mongoose.connect("mongodb://127.0.0.1:27017/Exercise365")

app.listen(3443, () => {
    console.log('Server is running')
})
import { React, Component} from 'react';
import ExerciseInfo from './ExerciseInfo';
import {View, Text, Button} from 'react-native'
import CollapsibleView from "@eliav2/react-native-collapsible-view";

export default function Workout(props){
    const exercises = props.workout.exercises
    const modalDisplay = props.modalDisplay
    const addWorkout = props.addWorkout
    const editWorkout = props.editWorkout
    const deleteWorkout = props.deleteWorkout
    const searched = props.searched
    const included = props.included
    const getInt = (length) => {
        return Math.floor(Math.random() * length)
    }
    let rand
    return(
        <CollapsibleView title = {<Text style = {{fontWeight: 'bold', fontSize: 20, textAlign: 'center', width: '70%'}}>{props.workout.workoutName}</Text>}>
            <Text style = {{textAlign: 'center'}}>{props.workout.workoutDesc}</Text>
            {exercises.map(exercise => {
                if(!Array.isArray(exercise.exerciseItem)){
                    return(
                        <ExerciseInfo displayViewMore = {true} modalDisplay = {() => modalDisplay(exercise.exerciseItem._id)} hideCheck = {true} hideSAR = {true} prof = {true} exerciseData = {{_id: exercise.exerciseItem._id, name: exercise.exerciseItem.name, instructions: exercise.exerciseItem.instructions, sets: exercise.sets, reps: exercise.reps}} />
                    )
                }
                rand = getInt(exercise.exerciseItem.length)
                return(
                    <ExerciseInfo isArray = {true} displayViewMore = {true} modalDisplay = {() => modalDisplay(exercise.exerciseItem[rand]._id)} hideCheck = {true} hideSAR = {true} prof = {true} exerciseData = {{_id: exercise.exerciseItem[rand]._id, name: exercise.exerciseItem[rand].name, instructions: exercise.exerciseItem[rand].instructions, sets: exercise.sets, reps: exercise.reps}} />
                )
            })}
            {searched == null &&
                <View>
                    <Button onPress={() => editWorkout()} title = 'Edit Workout' />
                    <Text />
                    <Button onPress={() => deleteWorkout()} color = 'red' title = 'Delete Workout'/>
                </View>
            }
            {searched &&
                <Button color = {included ? "green" : '#2196F3'} onPress = {() => addWorkout()} title = 'Add to My Workouts' />
            }
        </CollapsibleView>
    )
}
import { React, Component, useEffect} from 'react';
import Workout from './Workout';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Button, StyleSheet, SafeAreaView} from 'react-native';
import {SelectList, MultipleSelectList} from 'react-native-dropdown-select-list'

export default function WorkoutHome({navigation, route}){
    const [workouts, setWorkouts] = useState(route.params.workouts)
    const [selected, setSelected] = useState("")
    useFocusEffect(() => {
        if (navigation.isFocused()){
            setWorkouts(route.params.workouts)
        }
    })

    return(
        <SafeAreaView>
            {workouts.map((currentWorkout) => {
                    return(<Workout workout = {currentWorkout}></Workout>)
                })}
            <Button title = "Create Workout" onPress={() => navigation.navigate('WorkoutGen', {workoutData: workouts})} />
        </SafeAreaView>
    )

    const style = StyleSheet.create({
        
    })
}
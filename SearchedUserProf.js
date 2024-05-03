import { React, Component, useEffect, useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Workout from './Workout';
import { Modal, SafeAreaView, View, Image, Text, Switch, StyleSheet, TouchableOpacity, FlatList, Button, Dimensions, Alert} from 'react-native';
import MealInfo from './MealInfo.js'
import AppNav from "./AppNav.js"
import ExerciseTabInfo from './ExerciseTabInfo.js';
import MealTabInfo from './MealTabInfo.js'

export default function SearchedUserProf({navigation, route}){
    const [dataBool, setDataBool] = useState(false)
    const [data, setData] = useState(route.params.data) //holds username, meals, pfp, and workouts
    const [modalShow, setModalShow] = useState(false)
    const [modalData, setModalData] = useState({})
    const searchedData = route.params.searchedData
    const [addingWOs, setAWOs] = useState([])
    const [addingMeals, setAMs] = useState([])

    useFocusEffect(() => {
        if(navigation.isFocused()){
            console.log(data['workouts'])
        }
    })

    const modalDisplayExc = async function(exerciseID){
        /**
         * Retrieve exercise information and display modal
         * @param {String} exerciseID: exercise to retrieve information for
         */
        const exercise = await fetch('http://10.0.2.2:3443/exercises/getExercise/' + exerciseID, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'}
        }).then(function(resp){
            return resp.json()
        })
        console.log('exercise: ' + JSON.stringify(exercise))

        setModalData(exercise)
        setModalShow(true)
    }

    const modalDisplayMeal = async function(mealID){
        /**
         * Retrieve meal information and display modal
         * @param {String} mealID: meal to retrieve information for
         */
        const meal = await fetch('http://10.0.2.2:3443/meals/getMeal/' + mealID, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'}
        }).then(function(resp){
            return resp.json()
        })

        console.log('meal ' + JSON.stringify(meal))

        setModalData(meal)
        setModalShow(true)
    }

    const addWorkout = function(workout){
        /**
         * Add selected workout to own workouts
         * @param {Object} workout: workout to add
         */
        if(!data['workouts'].includes(workout)){
            setAWOs(prev => {
                let temp = [...prev]
                if(!prev.includes(workout)){
                    temp.push(workout)
                }
                else(
                    temp.splice(addingWOs.indexOf(workout), 1)
                )
                return temp
            }
            )
        }else{
        }
    }

    const addMeal = function(meal){
        /**
         * Add selected meal to own recipe book
         * @param {Object} meal: meal to add
         */
        if(!data['meals'].includes(meal)){
            setAMs(prev => {
                let temp = [...prev]
                if(!prev.includes(meal)){
                    temp.push(meal)
                }
                else{
                    temp.splice(addingMeals.indexOf(meal), 1)
                }
                return temp
            }
            )
        }else{
        }
    }

    const saveAdditions = async () => {
        /**
         * Updates database to add added objects to own workout list and recipe book
         */
        let mealIDs = []
        let woIDs = []

        addingWOs.forEach(wo => {
            woIDs.push(wo._id)
        })

        addingMeals.forEach(meal => {
            mealIDs.push(meal._id)
        })

        console.log(data.username)
        
        let response = await fetch('http://10.0.2.2:3443/users/addMealsAndWorkouts', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'},
            body: JSON.stringify({
                username: data.username,
                workoutIDs: woIDs,
                mealIDs: mealIDs
            })
        }).then(function(resp){
            return resp.json()
        }).catch(err => {})
        console.log(response)

        console.log(JSON.stringify(response))

        let temp = data

        temp.workouts = temp.workouts.concat(addingWOs)
        temp.meals = temp.meals.concat(addingMeals)

        navigation.navigate('Home', {userData: temp})

    }

    return(
        <SafeAreaView style = {{paddingTop: "15%", height: Dimensions.get('screen').height}}>
            <View style = {{alignItems: "center"}}>
                <Image style = {{width: 165, height: 165, borderRadius: 165 / 2, overflow: "hidden", borderColor: "black", borderWidth: .6}} source = {{ uri: searchedData.picture }} />
                <Text style = {{fontWeight: 'bold', fontSize: 18}}>{searchedData.username}</Text>
                <View style = {{marginLeft: Dimensions.get('screen').width * .05, flexDirection: 'row'}}>
                    <Text style = {{marginTop: Dimensions.get('screen').height * .015}}>Workouts </Text>
                        <Switch trackColor={'#f4f3f4'} thumbColor={'#2196F3'} value = {dataBool} onValueChange={() => {setDataBool(!dataBool)}}/>
                    <Text style = {{marginTop: Dimensions.get('screen').height * .015}}> Recipe Book</Text>
                </View>
                <View style = {{marginVertical: 1, height: Dimensions.get('screen').height * .53}}>
                        {!dataBool &&
                            <FlatList data = {searchedData["workouts"]} keyExtractor={item => item._id} renderItem={({item})=>(
                                <Workout included = {addingWOs.includes(item)} searched = {true} addWorkout = {() => addWorkout(item)} modalDisplay = {modalDisplayExc} workout={item}/>
                            )} />
                        }
                        {dataBool &&
                            <FlatList data = {searchedData["meals"]} keyExtractor={item => item._id} renderItem={({item})=>(
                                <MealInfo included = {addingMeals.includes(item)} searched = {true} addMeal = {() => addMeal(item)} modalDisplay = {modalDisplayMeal} hideViewMore = {false} hideCheck = {true} mealData = {item}/>
                            )} />
                        }
                    </View>
                <View style = {{
                //source: https://reactnative.dev/docs/modal
                flex: 1,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center'}}>
                    <Modal transparent = {true} visible = {modalShow}>
                        {!dataBool &&
                            <ExerciseTabInfo setModalShow = {setModalShow} exercise = {modalData}/>
                        }
                        {dataBool &&
                            <MealTabInfo setModalShow = {setModalShow} meal = {modalData}/>
                        }
                    </Modal>
                </View>
            </View>
            <View style = {{bottom: 0}}>
                <Button title = "Save Additions" onPress = {() => saveAdditions()} />
            </View>
        </SafeAreaView>
    )

    const style = StyleSheet.create({
        
    })
}
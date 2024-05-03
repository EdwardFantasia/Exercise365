import { React, useState, useEffect, useRef} from 'react';
import { Modal, Dimensions, FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, TextInput, Text, TouchableOpacity, TouchableWithoutFeedback, View, Alert, Button } from 'react-native';
import MealSearchModalComp from './MealSearchModalComp';
import MealInfo from './MealInfo';

export default function WorkoutGenerat({navigation, route}){
    const [newMealData, setNewMealData] = useState([]) //holds all data for new meal data
    const [show, setShow] = useState(false) //variable that decides whether modal is shown
    let mealData = route.params.userData.meals //all meal data of user (needed separate in case user cancels additions, can just leave and send this back)
    let deleteMeals = useRef([]) //useRef needs to be used or rerender would be messed up after first rerender

    useEffect(() => {
        setNewMealData(newMealData)
        console.log("NMD: " + JSON.stringify(newMealData))
    })

    const addGroup = (mutArray, arrayAdd) => {
        /**
         * USED BY MODAL AS WELL
         * Add or remove arrayAdd item from mutArray
         * @param {Array} mutArray: array to have arrayAdd item removed from or added to
         * @param {any} arrayAdd: item to be removed from or added to mutArray
         */
        
        let tmp = mutArray

        if(tmp.includes(arrayAdd)){
            tmp.splice(tmp.indexOf(arrayAdd), 1)
        }
        else{
            tmp.splice(tmp.length, 0, arrayAdd)
        }

        return tmp
    }

    const removeMeals = () => {
        /**
         * Remove emeals from newMealData that match meals in deleteMeals array (removes them from potentially added meals array and de-renders them)
         */
        setNewMealData(prevMealData => {
            // Filter out the exercises that need to be removed
            const tmp = prevMealData.filter(
                (meal) => {
                    console.log(meal)
                    return !deleteMeals.current.includes(meal.id);
                }
            );

            // Clear the deleteExcs array
            deleteMeals.current = [];

            return tmp;
        })
        
    }
    
    const addToMealData = (mealArray) => { 
        /**
         * Adds meals to newMealData
         * @param {Array} mealArray: array to have added to newMealData state array
         */
        setNewMealData(prevMealData => {
            //console.log("PREVWORKDATA: ", prevWorkData);
            let temp = [...prevMealData]


            //TODO: check why doubles of meals are occurring and why \n still appears
            let allTemp = temp.concat(mealData) //get prev data and all data from old userdata (to check if any meal is already in user's meals)
            console.log(JSON.stringify(temp))
            
            //MAPPING BETTER FOR TRANSFORMING, FOR EACH BETTER FOR MUTATING
            mealArray.forEach(mealData => { //for each item of meal data
                console.log('mealData: ' + JSON.stringify(mealData))
                if(!allTemp.some(data => data.id === mealData.id)){ //if data is not already in meal list
                    console.log('passed')
                    let tempMeal = {
                        id: mealData.id,
                        title: mealData.title,
                        summary: mealData.summary.replace(/<[^>]*>/g, ""), //https://stackoverflow.com/questions/33588514/how-to-remove-string-between-two-characters-every-time-they-occur
                        instructions: mealData.instructions.replace(/<[^>]*>/g, "").replaceAll("\n", " "),
                        readyInMinutes: mealData.readyInMinutes,
                        imageType: mealData.imageType,
                        servings: mealData.servings,
                        ingredients: [],
                        equipment: []
                    }
                    
                    let tempIngred = {}

                    for (let i = 0; i < mealData.extendedIngredients.length; i++){ //get name and image (different names sometimes from name) for each ingredient, put that data in tempMeal array
                        tempIngred = {
                            name: mealData.extendedIngredients[i].name,
                            image: mealData.extendedIngredients[i].image
                        }

                        tempMeal.ingredients.push(tempIngred)
                    }

                    let tempEquip = {}
                    let instructions = []
                    let steps = []

                    for(let i = 0; i < mealData.analyzedInstructions.length; i++){
                        instructions = mealData.analyzedInstructions[i]
                        for(let j = 0; j < instructions.steps.length; j++){
                            steps = instructions.steps[j]
                            for(let k = 0; k < steps.equipment.length; k++){
                                if(!tempMeal.equipment.some(tempEquip => tempEquip.name === steps.equipment[k].name)){
                                    tempEquip = {
                                        name: steps.equipment[k].name,
                                        image: steps.equipment[k].image
                                    }
                                    tempMeal.equipment.push(tempEquip)
                                }
                            }
                        }
                    }

                    temp.push(tempMeal) //add to list
                }
            });

            console.log('temp: ' + JSON.stringify(temp))
            return temp; //return temp to set NMD to temp list
        })
    }

    const saveMeals = async () => {
        /**
         * Saves meal list to recipe book and updates database
         */
        const sendData = {
            username: route.params.userData.username,
            meals: newMealData
        }

        console.log(JSON.stringify(sendData))

        let response = await fetch('http://10.0.2.2:3443/meals/createMeal', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'},
            body: JSON.stringify(sendData)
        }).then(function(resp){
            return resp.json()
        }).catch(error => {})
        console.log(response)

        mealData = mealData.concat(response)

        console.log('mealData: ' + JSON.stringify(mealData))

        navigation.navigate("Home", {userData: {username: route.params.userData.username, picture: route.params.userData.picture, workouts: route.params.userData.workouts, meals: mealData}})
    }

    return(
        <SafeAreaView style = {{paddingTop: '15%', justifyContent: 'center'}}>
            <View style = {{alignItems: 'center', flexDirection: 'column', justifyContent: "center"}}>
                <Button title = "Add Meals" onPress = {() => setShow(true)} />
                <View style = {{height: 30}}></View>
                <Button title = "Delete Selected" onPress = {() => removeMeals()} />
            </View>
            <View style = {{marginVertical: 20, height: 'auto'}}>
                <FlatList data = {newMealData} keyExtractor={item => item.id} renderItem={({item})=>(
                   <MealInfo hideCheck = {false} hideViewMore = {true} addToSelected = {() => {console.log('setting deleteMeals to: '); deleteMeals.current = addGroup(deleteMeals.current, item.id); console.log('deleteMeals now set to', deleteMeals.current);}} mealData = {item}/>)}>
                </FlatList>
            </View>
            <View style = {{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <Button title = "Save Meals" onPress = {() => saveMeals()} />
                <View style = {{width: 30}}></View>
                <Button title = "Cancel Additions" onPress = {() => navigation.navigate("Home", {userData: {username: route.params.userData.username, picture: route.params.userData.picture, workouts: route.params.userData.workouts, meals: mealData}})}></Button>
            </View>
            <View style = {{
                //source: https://reactnative.dev/docs/modal
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'}}>
            <Modal transparent = {true} visible = {show}>
                <MealSearchModalComp addToMealData = {addToMealData} addFunc = {addGroup} setShow = {setShow} />
            </Modal>
            </View>
        </SafeAreaView>
    )
}
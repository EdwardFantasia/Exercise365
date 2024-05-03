import { React, Component, useState, useRef} from 'react';
import MealInfo from './MealInfo';
import { Button, FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Alert, TextInput, Pressable } from 'react-native';
import { RadioButton } from 'react-native-paper'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import {SelectList, MultipleSelectList} from 'react-native-dropdown-select-list'

export default function MealSearchModalComp(props){
    const addFunc = props.addFunc
    const addToMealData = props.addToMealData
    const setShow = props.setShow
    const [screenState, setScreen] = useState(0)
    const [selectedMeals, setSelectedMeals] = useState([])
    const [cuisine, setCuisine] = useState([])
    const [diet, setDiet] = useState([])
    const [intols, setIntols] = useState([])
    let type = useRef("")
    let apiResults = useRef([])

    function formatArray(callArray){
        /**
         * Formats array for api request
         * @param {Array} callArray: array to have formatted
         */
        let formatString = ''
        
        callArray.forEach(arrItem => {
            formatString += arrItem.toLowerCase().replace(" ", "%20") + ','
        })
        
        return formatString
    }

    const getMeals = async() => {
        /**
         * get meals from spoonacular api
         */
        const cuisineString = formatArray(cuisine)
        const dietString = formatArray(diet)
        const intolsString = formatArray(intols)

        let rAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?include-tags=' + cuisineString + dietString + intolsString + type.current + '&number=10';
        const options = {
	        method: 'GET',
	        headers: {
		        'X-RapidAPI-Key': '883b2eb2cfmsh653f0ac8e3065dap1ed5f8jsn2d6a69191c55',
		        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	        }
        };

        try {
	        const response = await fetch(rAPI, options);
            apiResults.current = JSON.parse(await response.text())['recipes']
        } catch (error) {
	        console.error(error);
        }

        setScreen(2)
    }

    if(screenState == 0){
        return(
            <SafeAreaView style = {{
                //source: https://reactnative.dev/docs/modal
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 35,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
            }}>
                <Pressable onPress = {() => setShow(0)} style = {{flexDirection: 'row-reverse', paddingBottom: 5}}>
                    <Text style = {{color: '#c3c2c3', paddingBottom: .75, paddingRight: 2, padding: 1, borderStyle: "solid", borderWidth: 1, borderRadius: 10, borderColor: '#c3c2c3'}}> X</Text>
                </Pressable>

                <View style = {{alignItems: 'center'}}>
                    <Text style = {{textAlign: 'center'}}>Please choose the types of cuisines you wish your search to support</Text>
                    <MultipleSelectList data = {["African", "Asian", "American", "British", "Cajun", "Caribbean", "Eastern European", "European", "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamiese"]}
                                        setSelected={val => setCuisine(val)}
                    ></MultipleSelectList>
                    <Text style = {{textAlign: 'center'}}>Please choose the diets you wish your search to support</Text>
                    <MultipleSelectList data = {["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Low FODMAP", "Whole30"]}
                                        setSelected={val => setDiet(val)}
                    ></MultipleSelectList>
                    <Text style = {{textAlign: 'center'}}>Please choose the types of intolerances you wish your search to support</Text>
                    <MultipleSelectList data = {["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"]}
                                        setSelected={val => setIntols(val)}
                    ></MultipleSelectList>
                    <Text style = {{textAlign: 'center'}}>Please choose the type of meals you wish to search for</Text>
                    <SelectList data = {["Main Course", "Side Dish", "Dessert", "Appetizer", "Salad", "Bread", "Breakfast", "Soup", "Beverage", "Sauce", "Marinade", "Fingerfood", "Snack", "Drink"]}
                                setSelected={val => type.current = val}
                    ></SelectList>
                    <Text></Text>
                    <Button title = {"Search for Recipes"} onPress = {() => getMeals()}></Button>
                </View>
            </SafeAreaView>
        )
    }
    else{
        return(
            <SafeAreaView style = {{
                //source: https://reactnative.dev/docs/modal
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 35,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
            }}>
                <Pressable onPress = {() => setShow(0)} style = {{flexDirection: 'row-reverse', paddingBottom: 5}}>
                    <Text style = {{color: '#c3c2c3', paddingBottom: .75, paddingRight: 2, padding: 1, borderStyle: "solid", borderWidth: 1, borderRadius: 10, borderColor: '#c3c2c3'}}> X</Text>
                </Pressable>
                <FlatList data = {apiResults.current} renderItem={({item: query}) => <MealInfo hideCheck = {false} hideViewMore = {true} addToSelected = {() => setSelectedMeals(addFunc(selectedMeals, query))} mealData = {query}/>}>
                </FlatList>
                <Button title = 'Add Selected Meals to Recipebook' onPress = {() => {addToMealData(selectedMeals); setShow(false)}} />
            </SafeAreaView>
        )
    }
}
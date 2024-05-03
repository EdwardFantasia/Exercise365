import { React, Component, useState, useRef} from 'react';
//import './css/WorkoutGen.css'
import ExerciseInfo from './ExerciseInfo';
import { Button, FlatList, SafeAreaView, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Alert, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper'
import {SelectList, MultipleSelectList} from 'react-native-dropdown-select-list'
import uuid from 'react-native-uuid'

/*API: https://rapidapi.com/brianliong1999-aAas5mGoYZv/api/advanced-exercise-finder */

export default function WorkoutModalComponent(props){
    const addFunc = props.addFunc
    const addToWorkData = props.addToWorkData
    const setShow = props.setShow
    const [screenState, setScreen] = useState(0)
    const [selectedExcs, setSelectedExcs] = useState([])
    const [selectedPMG, setSPMG] = useState([])
    const [selectedSMG, setSSMG] = useState([])
    const [selectedPM, setSPM] = useState([])
    const [selectedSM, setSSM] = useState([])
    const [tags, setST] = useState([])
    const [rand, setRand] = useState(false)
    const [create, setCreate] = useState(false)
    let query = useRef({
        equipment: "",
        force: "",
        movement: "",
        search: "",
        type: ""
    })

    const excsByGroup = {
        back: ["Trapezius", "Erector Spinae", "Latissimus Dorsi"],
        chest: ["Upper Chest", "Lower Chest", "Pectoralis Minor"],
        shoulders: ["Anterior Deltoid", "Lateral Deltoid", "Posterior Deltoid"],
        arms: ["Triceps", "Biceps", "Pronators", "Supinators", "Forearm Flexors", "Forearm Extensors", "Brachioradialis"],
        legs: ["Quadriceps", "Hamstrings", "Calves", "Adductors", "Abductors", "Gluteal Muscles"],
        core: ["Obliques", "Transverse Abdominis", "Rectus Absominis"]
    }

    let pmChecks = useRef([])
    let smChecks = useRef([])
    let queryResults = useRef([])

    let createName = useRef("")
    let createInstr = useRef("")

    const queryCreation = queryParam => {
        if((typeof query.current[queryParam] == "string" && query.current[queryParam] != "") || (query.current[queryParam].length != 0)){ //if this field of query is either a non-empty string or a non-empty array...
            if(typeof query.current[queryParam] == "string"){ //if a string...
                return queryParam + ": \"" + query.current[queryParam].toLowerCase() + "\", " //add the query param formatted to be accepted by API
            }
            else{
                let temp = ""
                for(let i = 0; i < query.current[queryParam].length; i++){ //for each item in query param array...
                    temp += '"' + query.current[queryParam][i].toLowerCase() + '", ' //
                }
                return queryParam + ": [" + temp + "]"
            }
        }
        else{
            return ""
        }   
    }

    const getExercises = async() => {
        let queryString = ""
        console.log(selectedPMG)
        query.current.primaryMuscleGroups = selectedPMG
        query.current.secondaryMuscleGroups = selectedSMG
        query.current.primaryMuscles = selectedPM
        query.current.secondaryMuscles = selectedSM
        query.current.tags = tags
        console.log(query.current)
        for(let i = 0; i < Object.keys(query.current).length; i++){
            queryString += queryCreation(Object.keys(query.current)[i])
        }

        const queryReq = `
            query {
                exercises(
                    exerciseQuery: {` + queryString + `}
                    ) {
                    id
                    name
                    force
                    equipment
                    instructions
                    primaryMuscleGroups
                    primaryMuscles
                    secondaryMuscleGroups
                    secondaryMuscles
                    tags
                    type
                }
            }
        `

        console.log(JSON.stringify({query:queryReq}))

        const url = 'https://advanced-exercise-finder.p.rapidapi.com/'
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '883b2eb2cfmsh653f0ac8e3065dap1ed5f8jsn2d6a69191c55',
		        'x-rapidapi-host': 'advanced-exercise-finder.p.rapidapi.com',
		        'Content-Type': 'application/json'
            },
            body: JSON.stringify({query:queryReq})
        }

        try {
	        let response = await fetch(url, options);
	        queryResults.current = JSON.parse(await response.text())['data']['exercises']

            console.log(queryResults)
            setScreen(3)
        } catch (error) {
	        console.error(error);
        }
    }

    const screenEst = async(screenNum) => {
        /**
         * Establishes modal screen information for screenNum screen
         * @param {Number} screenNum: number to set modal screen to
         */
        switch(screenNum){
            case 2:
                {/*Map this and get every exc related to muscGroup*/}
                selectedPMG.map((muscGroup) => {
                    pmChecks.current = pmChecks.current.concat(excsByGroup[muscGroup.toLowerCase()])
                })
                selectedSMG.map((sMuscGroup) => {
                    smChecks.current = smChecks.current.concat(excsByGroup[sMuscGroup.toLowerCase()])
                })
        }
        setScreen(screenNum)
    }

        {/*API QUERY PARAMS (* = required from APP):
        Name: string
        Equipment: string,
        Force: string,
        Movement: string,
        *PMG: array (should be array filled with muscle groups from ),
        SMG: array/string (should be any muscle group avail, also probably only one),
        PM: array (should dynamically change based on muscle groups selected),
        SM: array (should be array of all muscle groups),
        Tags: array,
        Type: string
        */}

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
                    <Button title = "Create Exercise" onPress={() => {setCreate(true); setScreen(1)}} />
                    <Text style = {{paddingVertical: '20%'}}></Text>
                    <Button title = "Import Exercises" onPress={() => setScreen(1)} />
                </View>
            </SafeAreaView>
        )
        }
        else if (screenState == 1){
            {/*First page of import workout sequence*/}
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
                        {create && 
                            <View>
                                <Text>Name of Exercise</Text>
                                <TextInput onChangeText={text => {createName.current = text}}></TextInput>

                                <Text>Exericse Instructions</Text>
                                <TextInput onChangeText={text => createInstr.current = text}></TextInput>
                            </View>
                        }
                        <Text>{create ? "What equipment do you want this exercise to use?" : "What equipment do you want to use?"}</Text>
                        <SelectList
                            data = {["Doesn't Matter", "None", "Barbell", "Dumbells", "Machine", "Cable", "Kettlebell", "Resistance Band", "Resistance Band Assisted", "EZ Curl Barbell", "Trap Bar", "Smith Machine", "Body Weight", "Weighted", "Misc"]}
                            setSelected = {val => query.current.equipment = (val == "Doesn't Matter" ? "" : val)}
                            id = "equip"
                        ></SelectList>

                        <Text>{create ? "What primary muscle groups does this exercise work?" : "What primary muscle groups do you wish to exercise?"}</Text>
                        <MultipleSelectList data = {["Back","Chest","Shoulders","Arms","Legs","Core"]}
                                            setSelected={val => setSPMG(val)}
                                            id = "pmg"
                        ></MultipleSelectList>

                        <Text>{create ? "What secondary muscle groups does this exercise work?" : "What secondary muscle groups do you wish to exercise?"}</Text>
                        <View>
                            <MultipleSelectList data = {["Back","Chest","Shoulders","Arms","Legs","Core"]}
                                                setSelected = {val => setSSMG(val)}
                                                id = "smg"
                            ></MultipleSelectList>
                        </View>

                        <Text>{create ? "What force does this exericse use?" : "What force do you wish to use for this exercise?"}</Text>
                        <SelectList
                            data = {["Doesn't Matter", "Push", "Pull", "Push and Pull"]}
                            setSelected = {val => query.current.force = (val == "Doesn't Matter" ? "" : val)}
                            id = "force"
                        ></SelectList>
                        <Text> {'\n'}</Text>
                        <Button title = "Next Page" onPress = {() => screenEst(2)} />
                    </View>
                </SafeAreaView>
            )
        }
        else if (screenState == 2){
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
                        <Text>{create ? "What primary muscles does this exercise work?" : "Please pick the primary muscles you wish these exercises to work"}</Text>
                        <MultipleSelectList data = {[{value: "Trapezius", disabled: !pmChecks.current.includes("Trapezius")}, {value: "Erector Spinae", disabled: !pmChecks.current.includes("Erector Spinae")}, {value: "Latissimus Dorsi", disabled: !pmChecks.current.includes("Latissimus Dorsi")},
                                                    {value: "Upper Chest", disabled: !pmChecks.current.includes("Upper Chest")}, {value: "Lower Chest", disabled: !pmChecks.current.includes("Lower Chest")}, {value: "Pectoralis Minor", disabled: !pmChecks.current.includes("Pectoralis Minor")},
                                                    {value: "Anterior Deltoid", disabled: !pmChecks.current.includes("Anterior Deltoid")}, {value: "Lateral Deltoid", disabled: !pmChecks.current.includes("Lateral Deltoid")}, {value: "Posterior Deltoid", disabled: !pmChecks.current.includes("Posterior Deltoid")},
                                                    {value: "Triceps", disabled: !pmChecks.current.includes("Triceps")}, {value: "Biceps", disabled: !pmChecks.current.includes("Biceps")}, {value: "Pronators", disabled: !pmChecks.current.includes("Pronators")}, {value: "Supinators", disabled: !pmChecks.current.includes("Supinators")}, {value: "Forearm Flexors", disabled: !pmChecks.current.includes("Forearm Flexors")}, {value: "Forearm Extensors", disabled: !pmChecks.current.includes("Forearm Extensors")}, {value: "Brachioradialis", disabled: !pmChecks.current.includes("Brachioradialis")},
                                                    {value: "Quadriceps", disabled: !pmChecks.current.includes("Quadriceps")}, {value: "Hamstrings", disabled: !pmChecks.current.includes("Hamstrings")}, {value: "Calves", disabled: !pmChecks.current.includes("Calves")}, {value: "Adductors", disabled: !pmChecks.current.includes("Adductors")}, {value: "Abductors", disabled: !pmChecks.current.includes("Abductors")}, {value: "Gluteal Muscles", disabled: !pmChecks.current.includes("Gluteal Muscles")},
                                                    {value: "Obliques", disabled: !pmChecks.current.includes("Obliques")}, {value: "Transverse Abdominis", disabled: !pmChecks.current.includes("Transverse Abdominis")}, {value: "Transverse Abdominis", disabled: !pmChecks.current.includes("Transverse Abdominis")}
                                                    ]}
                                            setSelected = {val => setSPM(val)}
                                            save = "value"
                                            id = "pm"
                        ></MultipleSelectList>
                        
                        <Text>{create ? "What secondary muscles does this exercise work?" : "Please pick the secondary muscles you wish these exercises to work"}</Text>
                        <MultipleSelectList data = {[{value: "Trapezius", disabled: !smChecks.current.includes("Trapezius")}, {value: "Erector Spinae", disabled: !smChecks.current.includes("Erector Spinae")}, {value: "Latissimus Dorsi", disabled: !smChecks.current.includes("Latissimus Dorsi")},
                                                    {value: "Upper Chest", disabled: !smChecks.current.includes("Upper Chest")}, {value: "Lower Chest", disabled: !smChecks.current.includes("Lower Chest")}, {value: "Pectoralis Minor", disabled: !smChecks.current.includes("Pectoralis Minor")},
                                                    {value: "Anterior Deltoid", disabled: !smChecks.current.includes("Anterior Deltoid")}, {value: "Lateral Deltoid", disabled: !smChecks.current.includes("Lateral Deltoid")}, {value: "Posterior Deltoid", disabled: !smChecks.current.includes("Posterior Deltoid")},
                                                    {value: "Triceps", disabled: !smChecks.current.includes("Triceps")}, {value: "Biceps", disabled: !smChecks.current.includes("Biceps")}, {value: "Pronators", disabled: !smChecks.current.includes("Pronators")}, {value: "Supinators", disabled: !smChecks.current.includes("Supinators")}, {value: "Forearm Flexors", disabled: !smChecks.current.includes("Forearm Flexors")}, {value: "Forearm Extensors", disabled: !smChecks.current.includes("Forearm Extensors")}, {value: "Brachioradialis", disabled: !smChecks.current.includes("Brachioradialis")},
                                                    {value: "Quadriceps", disabled: !smChecks.current.includes("Quadriceps")}, {value: "Hamstrings", disabled: !smChecks.current.includes("Hamstrings")}, {value: "Calves", disabled: !smChecks.current.includes("Calves")}, {value: "Adductors", disabled: !smChecks.current.includes("Adductors")}, {value: "Abductors", disabled: !smChecks.current.includes("Abductors")}, {value: "Gluteal Muscles", disabled: !smChecks.current.includes("Gluteal Muscles")},
                                                    {value: "Obliques", disabled: !smChecks.current.includes("Obliques")}, {value: "Transverse Abdominis", disabled: !smChecks.current.includes("Transverse Abdominis")}, {value: "Transverse Abdominis", disabled: !smChecks.current.includes("Transverse Abdominis")}
                                                    ]}
                                            setSelected = {val => setSSM(val)}
                                            save = "value"
                                            id = "sm"
                        ></MultipleSelectList>
                        
                        <Text>{create ? "What tags apply to this exercise?" : "Please select any tags you wish the exercises to follow"}</Text>
                        <MultipleSelectList data = {["Powerlifting", "Olympic", "Strongman", "Calisthenics", "Plyometric"]}
                                            setSelected={val => {setST(val)}}
                                            id = "tag"
                        ></MultipleSelectList>

                        <Text>{create ? "What type of exercise is this?" : "Please select the type of exercise you want to search for"}</Text>

                        <SelectList data = {["Doesn't Matter", "Compound", "Isolation"]}
                                    setSelected = {val => query.current.type = (val == "Doesn't Matter" ? "" : val)}
                                    id = 'type'
                        ></SelectList>

                        {!create && 
                        <View style = {{alignContent: 'center', justifyContent: 'center'}}>
                            <Text>{'\n'}</Text>

                            <Text>Randomize Exercise</Text>
                            <RadioButton color = '#2196F3' value = {!rand} status = {rand ? 'checked' : 'unchecked'} onPress = {() => setRand(!rand)}></RadioButton>
                        </View>
                        }
                        <Button title = {create ? "Create Exercise" : "Search for Exercises"} onPress={create ? () => {addToWorkData({id: "exc365" + uuid.v4(), name: createName.current, force: query.current.force, equipment: query.current.equipment, instructions: createInstr.current, primaryMuscleGroups: selectedPMG, primaryMuscles: selectedPM, secondaryMuscleGroups: selectedSMG, secondaryMuscles: selectedSM, tags: tags, type: query.current.type}, rand, create); setShow(0)} : () => getExercises()} />
                    </View>
                </SafeAreaView>
            )
        }
        else if (screenState == 3){ {/*Results Page*/}
            return(
                <SafeAreaView style = {{
                    //source: https://reactnative.dev/docs/modal
                    height: 500,
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
                    <FlatList data = {queryResults.current} renderItem={({item: query}) => <ExerciseInfo hideCheck = {false} hideSAR = {true} addToSelected = {() => setSelectedExcs(addFunc(selectedExcs, query))} exerciseData = {query}/>}>
                    </FlatList>
                    <Button title = {rand ? 'Add Selected Exercises to Random Exercise' : "Add Selected Exercise(s) to Workout"} onPress = {() => {addToWorkData(selectedExcs, rand, create); setShow(false)}} />
                </SafeAreaView>
            )
        }
    }
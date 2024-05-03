import CollapsibleView from "@eliav2/react-native-collapsible-view";
import {View, Text, TextInput, Pressable} from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

export default function ExerciseInfo(props){
    const exerciseItem = (Array.isArray(props.exerciseData) ? props.exerciseData[Math.floor(Math.random() * props.exerciseData.length)] : props.exerciseData)
    const color = ((Array.isArray(props.exerciseData) || props.isArray) ? "#2196F3" : 'black')
    const addToSelected = props.addToSelected
    const hideCheck = props.hideCheck
    const hideSAR = props.hideSAR
    const modalDisplay = props.modalDisplay
    const prof = props.prof
    const setSetsOrReps = props.setSetsOrReps

    return(
        <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
                {!hideCheck && 
                    <BouncyCheckbox fillColor="#2196F3" onPress = {() => addToSelected()}></BouncyCheckbox>
                }
                <CollapsibleView style = {{width: '60%'}} title = {<Text style = {{color: color}}>{exerciseItem.name}</Text>}>
                    <View>
                        <Text style = {{textAlign: "center"}}>{exerciseItem.instructions}</Text>
                        {props.displayViewMore &&
                            <Text style = {{fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center'}} onPress={() => modalDisplay()} >View More</Text>
                        }
                    </View>
                </CollapsibleView>
                {!hideSAR && 
                    <View style = {{flexDirection: 'row', marginBottom: 5}}>
                        <View style = {{flexDirection: 'column', marginRight: 7.5}}>
                            <Text>Sets</Text>
                            <TextInput placeholder = {props.sets} onChangeText = {text => setSetsOrReps(true, props.index, text)} maxLength = {3} style = {{borderStyle: "solid", borderWidth: 1, borderRadius: 5, textAlign: 'center'}} keyboardType="numeric"></TextInput>
                        </View>
                        <View style = {{flexDirection: 'column'}}>
                            <Text>Reps</Text>
                            <TextInput placeholder={props.reps} onChangeText = {text => setSetsOrReps(false, props.index, text)} maxLength = {3} style = {{borderStyle: "solid", borderWidth: 1, borderRadius: 5, textAlign: 'center'}} keyboardType="numeric"></TextInput>
                        </View>
                    </View>
                }
                {prof &&
                    <View style = {{flexDirection: 'row', marginBottom: 5}}>
                        <View style = {{flexDirection: 'column', marginRight: 7.5}}>
                            <Text>Sets</Text>
                            <Text style = {{textAlign: 'center'}}>{exerciseItem.sets}</Text>
                        </View>
                        <View style = {{flexDirection: 'column'}}>
                            <Text>Reps</Text>
                            <Text style = {{textAlign: 'center'}}>{exerciseItem.reps}</Text>
                        </View>
                    </View>
                }
            </View>
    )
}
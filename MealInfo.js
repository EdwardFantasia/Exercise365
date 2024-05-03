import { View, Text, Button } from 'react-native';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import BouncyCheckbox from 'react-native-bouncy-checkbox'

export default function MealInfo(props){
    const mealDataName = props.mealData.title
    const mealDataSumm = props.mealData.summary.replace(/<[^>]*>/g, "")
    const hideViewMore = props.hideViewMore
    const hideCheck = props.hideCheck
    const modalDisplay = props.modalDisplay
    const searched = props.searched
    const addMeal = props.addMeal
    const included = props.included
    const prof = props.prof
    const deleteMeal = props.deleteMeal
    return(
        <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
            {!hideCheck && 
                <BouncyCheckbox fillColor="#2196F3" onPress = {() => props.addToSelected()}></BouncyCheckbox>
            }
                <CollapsibleView style = {{width: '70%'}} title = {<Text style = {{textAlign: 'center', fontWeight: 'bold', flexDirection: 'row', flexWrap: 'wrap', paddingRight: '2%'}}>{mealDataName}</Text>}>
                    <View>
                        <Text style = {{textAlign: "center"}}>{mealDataSumm}</Text>
                        {!hideViewMore &&
                            <Text style = {{fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center'}} onPress={() => modalDisplay(props.mealData._id)}>View More</Text>
                        }
                        {prof &&
                        <View>
                            <Text />
                            <Button color = "red" title = "Delete Meal" onPress = {() => deleteMeal()} />
                            </View>
                        }
                        {searched && 
                            <Button title = "Add to My Recipebook" color = {included ? 'green':'#2196F3'} onPress = {() => addMeal()}></Button>
                        }
                    </View>
                </CollapsibleView>
        </View>
    )
}
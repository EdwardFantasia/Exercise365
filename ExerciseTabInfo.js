import { React, Component, useState, useRef} from 'react';
import { TabView, SceneMap } from 'react-native-tab-view'
import { View, Text, Linking, Button, Pressable } from 'react-native';

export default function TabViewExample(props) {
    const exercise = props.exercise
    const FirstRoute = () => (
        <View style = {{alignItems: 'center'}}>
            <Pressable onPress = {() => props.setModalShow(0)} style = {{paddingBottom: 5}}>
                <Text style = {{color: '#c3c2c3', paddingBottom: .75, paddingRight: 2, padding: 1, borderStyle: "solid", borderWidth: 1, borderRadius: 10, borderColor: '#c3c2c3'}}> X</Text>
            </Pressable>
            <View style = {{marginHorizontal: 25,flexDirection: 'row'}}>
                <View style = {{flex: 1.5, flexDirection: 'column'}}>
                    <Text style = {{textDecorationLine: 'underline'}}>Name</Text>
                    <Text>{exercise.name}</Text>
                    <Text style = {{textDecorationLine: 'underline'}}>Instructions</Text>
                    <Text>{exercise.instructions}</Text>
                    <Text style = {{textDecorationLine: 'underline'}}>Equipment</Text>
                    <Text>{exercise.equipment}</Text>
                    <Text style = {{textDecorationLine: 'underline'}}>Type</Text>
                    <Text>{exercise.type}</Text>
                </View>
                <View style = {{marginLeft: 15,flex: 1, flexDirection: 'column'}}>
                    <Text style = {{textDecorationLine: 'underline'}}>Primary Muscle Groups</Text>
                    {exercise.primaryMuscleGroups.map(pmg => {
                        return(
                            <Text><Text style = {{fontSize: 5}}>{'\u2B24'}  </Text>{pmg}</Text>
                        )
                    })}
                    <Text style = {{textDecorationLine: 'underline'}}>Primary Muscles</Text>
                    {exercise.primaryMuscles.map(pm => {
                        return(
                            <Text><Text style = {{fontSize: 5}}>{'\u2B24'}  </Text>{pm}</Text>
                        )
                    })}
                    <Text style = {{textDecorationLine: 'underline'}}>Secondary Muscle Groups</Text>
                    {exercise.secondaryMuscleGroups.map(smg => {
                        return(
                            <Text><Text style = {{fontSize: 5}}>{'\u2B24'}  </Text>{smg}</Text>
                        )
                    })}
                    <Text style = {{textDecorationLine: 'underline'}}>Secondary Muscles</Text>
                    {exercise.secondaryMuscles.map(sm => {
                        return(
                            <Text><Text style = {{fontSize: 5}}>{'\u2B24'}  </Text>{sm}</Text>
                        )
                    })}
                    <Text style = {{textDecorationLine: 'underline'}}>Tags</Text>
                    {exercise.tags.map(tag => {
                        return(
                            <Text><Text style = {{fontSize: 5}}>{'\u2B24'}  </Text>{tag}</Text>
                        )
                    })}
                </View>
            </View>
            <View style = {{absolute: '3%'}}>
                <Button color = {"red"} onPress = {() => {Linking.openURL('https://www.youtube.com/results?search_query=' + exercise.equipment.replace(" ", "+") + "+" + exercise.name.replace(" ", "+"))}} title = "View Demonstrations on YouTube" />
            </View>
        </View>
    );
      
      const renderScene = SceneMap({
        first: FirstRoute
      });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Exercise Information' }
  ]);

  return (
    <TabView
        style = {{margin: 20, marginBottom: '23%',
            backgroundColor: 'white',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,}}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />
  );
}
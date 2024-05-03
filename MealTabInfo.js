import { React, Component, useState, useRef} from 'react';
import { TabView, SceneMap } from 'react-native-tab-view'
import { View, Text, Linking, Button, Pressable, ScrollView, Image } from 'react-native';

export default function TabViewExample(props) {
    const meal = props.meal
    const equipmentArray = meal.equipment
    const ingredArray = meal.ingredients

    const GenInfRoute = () => (
        <View style={{alignItems: 'center'}}>
            <Pressable onPress = {() => props.setModalShow(0)} style = {{paddingBottom: 5}}>
                <Text style = {{color: '#c3c2c3', paddingBottom: .75, paddingRight: 2, padding: 1, borderStyle: "solid", borderWidth: 1, borderRadius: 10, borderColor: '#c3c2c3'}}> X</Text>
            </Pressable>
            <ScrollView style = {{height: 'auto', marginBottom: "10%"}}>
                <View style = {{alignItems: 'center'}}>
                    <Image style = {{width: 312, height: 231}} source = {{uri: 'https://img.spoonacular.com/recipes/' + String(meal.id) + '-312x231.' + String(meal.imageType)}}></Image>
                    <Text style = {{textDecorationLine: 'underline'}}>Name</Text>
                    <Text>{meal.title}</Text>
                    <Text style = {{textDecorationLine: 'underline'}}>Summary</Text>
                    <Text>{meal.summary}</Text>
                    <Text style = {{textDecorationLine: 'underline'}}>Instructions</Text>
                    <Text>{meal.instructions}</Text>
                    <Text style = {{textDecorationLine: 'underline'}}>Ready Time</Text>
                    <Text>{meal.readyInMinutes} minutes</Text>
                    <Text style = {{textDecorationLine: 'underline'}}>Servings</Text>
                    <Text>{meal.servings}</Text>
                </View>
            </ScrollView>
        </View>
    )

    const EquipAndIngredRoute = () => (
        <View style={{alignItems: 'center'}}>
            <Pressable onPress = {() => props.setModalShow(0)} style = {{paddingBottom: 5}}>
                <Text style = {{color: '#c3c2c3', paddingBottom: .75, paddingRight: 2, padding: 1, borderStyle: "solid", borderWidth: 1, borderRadius: 10, borderColor: '#c3c2c3'}}> X</Text>
            </Pressable>
            <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                <View style = {{alignContent: 'center', flexDirection: 'column'}}>
                    <Text style = {{fontSize: 20,textDecorationLine: 'underline'}}>Equipment</Text>
                    <ScrollView>                   
                    {equipmentArray.map(equip => {
                        let imgWidth, imgHeight
                        const image = Image.getSize(equip.image, (width, height) => {
                            imgWidth = width
                            imgHeight = height
                        })
                        return(
                            <View style = {{width: 200}}>
                                <Text style = {{fontSize: 15}}><Text style = {{fontSize: 5}}>{'\u2B24'}  </Text>{equip.name}</Text>
                                <Image resizeMode = 'contain' style = {{overflow: 'visible', width: 100, height: 100}} source = {{uri: equip.image}}/>
                            </View>
                        )
                    })}
                    </ScrollView>
                </View>
                <View style = {{paddingHorizontal: '3%'}}/>
                <View style = {{flexDirection: 'column'}}>
                    <Text style = {{fontSize: 20, textDecorationLine: 'underline'}}>Ingredients</Text>
                    <ScrollView style = {{marginBottom: '20%'}}>
                    {ingredArray.map(ingred => {
                        return(
                            <View>
                                <Text style = {{fontSize: 15, width: 80, flexWrap: 'wrap'}}><Text style = {{fontSize: 5}}>{'\u2B24'}  </Text>{ingred.name}</Text>
                                <Image resizeMode = 'contain' style = {{overflow: 'visible', width: 100, height: 100}} source = {{uri: 'https://img.spoonacular.com/ingredients_100x100/' + ingred.image}}/>
                            </View>
                        )
                    })}
                    </ScrollView>
                </View>
            </View>
        </View>
    )
      
      const renderScene = SceneMap({
        first: GenInfRoute,
        second: EquipAndIngredRoute
      });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'General Information' },
    { key: 'second', title: 'Ingredients & Equipment' }
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
            elevation: 5}}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />
  );
}
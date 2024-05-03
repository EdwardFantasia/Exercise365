import { Image, Pressable, Text, View } from 'react-native';


//Source: https://www.youtube.com/watch?v=LJkOGLhyRCg

export default function AppNav(props){
    const navigation = props.navigation
    const userData = props.userData
    return(
        <View style = {{position: 'absolute', flexDirection: "row", borderTopWidth: 1, paddingTop: 10}}>
            <Pressable onPress={() => navigation.navigate("Home", {userData: userData})} style = {{flex: 1}}>
                <View style = {{alignItems: "center"}}>
                    <Image source = {require('./assets/navIcons/homeNav.png')} />
                    <Text>Home</Text>
                </View>
            </Pressable>
            <Pressable onPress = {() => navigation.navigate("WorkoutGen", {userData: userData})} style = {{flex: 1}}>
                <View style = {{alignItems: "center"}}>
                    <Image source = {require("./assets/navIcons/dbIcon.png")}/>
                    <Text style = {{textAlign: "center"}}>Add to Workouts</Text>
                </View>
            </Pressable>
            <Pressable onPress = {() => navigation.navigate("MealGen", {userData: userData})} style = {{flex: 1}}>
                <View style = {{alignItems: "center"}}>
                    <Image source = {require("./assets/navIcons/mealIcon.png")}/>
                    <Text style = {{textAlign: 'center'}}>Add to Recipebook</Text>
                </View>
            </Pressable>
            <Pressable onPress = {() => navigation.navigate("Search", {userData: userData})} style = {{flex: 1}}>
                <View style = {{alignItems: "center"}}>
                    <Image source = {require("./assets/navIcons/searchIcon.png")}/>
                    <Text style = {{textAlign: 'center'}}>Search{"\n"}Users</Text>
                </View>
            </Pressable>
        </View>
    )
}
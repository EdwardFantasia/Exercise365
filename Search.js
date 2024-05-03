import { useState } from "react";
import { TextInput, View, Text, SafeAreaView, Button } from "react-native";
import SearchedUser from "./SearchedUser";
import { Searchbar } from "react-native-paper";

export default function Search({navigation, route}){
    const [userString, setUserString] = useState("")
    const [userProfiles, setUserProfiles] = useState([])
    const userData = route.params.userData
    const getUsers = async () => {
        /**
         * Gets all users that contain userString
         */
        const users = await fetch('http://10.0.2.2:3443/users/getBaseUserI/' + userString, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'}
        }).then(function(resp){
            return resp.json()
        })
        console.log(users)
        setUserProfiles(users)
    }

    const goToAccount = async (username) => {
        /**
         * Navigate to account matching username with respective user data
         * @param {String} username: username to retrieve information for
         */
        if(username != userData.username){
            let searchedData = await fetch('http://10.0.2.2:3443/users/getMoreUserI/' + username, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Content-Type':'application/json'}
            }).then(function(resp){
                return resp.json()
            })
            navigation.navigate("SearchedUserProf", {data: userData, searchedData: searchedData})
        }
        else(
            navigation.navigate("Home", {userData: userData})
        )
    }

    return(
        <SafeAreaView style = {{paddingTop: '15%'}}>
            <View style = {{alignItems: 'center'}}>
                <Searchbar value = {userString} onChangeText = {setUserString} placeholder="Search for users..." style = {{marginHorizontal: '5%', borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0)', marginBottom: 10}} theme={{ colors: { primary: 'blue' } }} />
                <View style = {{paddingBottom: '5%', paddingTop: '3%'}}>
                    <Button title = "Search for Users" onPress = {() => getUsers()}/>
                </View>
                {userProfiles.map(user => {
                    return(
                        <SearchedUser goToAccount = {() => goToAccount(user.username)} smallProfData = {user} />
                    )
                })}
            </View>
        </SafeAreaView>
    )
}
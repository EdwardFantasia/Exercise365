import { React, useRef, useState} from 'react';
import { Image, Button, Text, TextInput, SafeAreaView, View, Alert } from 'react-native';
import { firebaseStorage } from './firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

export default function Settings({navigation, route}){
    let userData = route.params.userData
    const [username, setUsername] = useState(userData.username)

    const saveChanges = async () => {
        const editBody = {
            username: userData.username,
            newUsername: username
        }
        userData.username = await fetch('http://10.0.2.2:3443/users/editUsername', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'},
            body: JSON.stringify(editBody)
        }).then(function(resp){
            return resp.json()
        }).catch(error => {
            console.log(error)
        })
    }

    return(
        <SafeAreaView style = {{paddingTop: '15%', alignItems: "center"}}>
            <Image style = {{width: 165, height: 165, borderRadius: 165 / 2, overflow: "hidden", borderColor: "black", borderWidth: .6}} source = {{ uri: userData.picture }} />
            <Text style = {{fontWeight: 'bold', fontSize: 18}}>{username}</Text>
            <Text />
            <View style = {{paddingBottom: 10}}>
                <Text style = {{textAlign: 'center'}} id = 'unameL'>Change Username</Text>
                <TextInput maxLength = {25} style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => setUsername(text)} id = 'uName'></TextInput>
            </View>
            <Button title = 'Save Changes' onPress = {() => saveChanges()}/>
            <Button title = "Cancel Changes" onPress = {() => navigation.navigate('Home', {userData: userData})}/>
        </SafeAreaView>
    )
}
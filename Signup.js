//use of route source: https://www.youtube.com/watch?v=GkH_VeAeur8

import { React, useRef, useState} from 'react';
import { Image, Button, Text, TextInput, SafeAreaView, View, Alert } from 'react-native';
import { firebaseStorage } from './firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import {firebaseAuth} from './firebaseConfig'
import {firebaseApp} from './firebaseConfig'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

export default function Signup({navigation, route}){
    //TODO: CHANGE NAV TO GO TO LOGIN TO THEN LOGIN TO CHECK FOR AUTHENTICATION

    const creationBody = useRef({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        picture: "https://firebasestorage.googleapis.com/v0/b/exercise365-5b879.appspot.com/o/blankpfp.png?alt=media&token=7f4c7abd-adae-4363-ba3d-cbbf76c81de3"
    })

    const [pfp, setPfp] = useState('https://firebasestorage.googleapis.com/v0/b/exercise365-5b879.appspot.com/o/blankpfp.png?alt=media&token=7f4c7abd-adae-4363-ba3d-cbbf76c81de3') //initial pfp uploaded to firebase based on picture from: https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png

    const pfpSelect = async() => { //https://youtu.be/1F8wquqFIaQ?si=a7M67oOrqbfCk4Cn
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true
        })

        if(!result.canceled){
            let resultType = result.uri.split(".").pop()
            const setImageSize = await ImageManipulator.manipulateAsync(
                result.uri,
                [{resize: {width: 165, height: 165}}],
                {compress: 1, format: resultType == "jpeg" ? ImageManipulator.SaveFormat.JPEG : ImageManipulator.SaveFormat.PNG}
            )

            setPfp(setImageSize.uri)
        }
    }

    const signUpUser = async() => {  
        //TODO: create firebase auth code that, if activated, then executes code below
        let response = await fetch('http://10.0.2.2:3443/users/createUser', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'},
            body: JSON.stringify(creationBody.current)
        }).then(async function(resp){
            let tempResp = resp.json()
            let url = pfp
            if(url != 'https://firebasestorage.googleapis.com/v0/b/exercise365-5b879.appspot.com/o/blankpfp.png?alt=media&token=7f4c7abd-adae-4363-ba3d-cbbf76c81de3'){
                console.log('activated')
                const pfpFetch = await fetch(url);
                const blob = await pfpFetch.blob();

                // Create image reference
                const imageRef = ref(firebaseStorage, `images/${creationBody.current.username.toLowerCase()}`);

                // Upload blob to Firebase Storage
                const pic = await uploadBytes(imageRef, blob)

                url = await getDownloadURL(imageRef)
            }

            tempResp = tempResp["_j"]

            tempResp.picture = await fetch('http://10.0.2.2:3443/users/setPic', {
                method: 'PATCH',
                mode: 'cors',
                headers: { 'Content-Type':'application/json'},
                body: JSON.stringify({username: creationBody.current.username, picUrl: url})
            }).then(urlResp => {
                if(urlResp.status === 200){
                    return url
                }
                return "https://firebasestorage.googleapis.com/v0/b/exercise365-5b879.appspot.com/o/blankpfp.png?alt=media&token=7f4c7abd-adae-4363-ba3d-cbbf76c81de3"
            })
            return tempResp
        })

        navigation.navigate('Home', {userData: response})
    }

    return(
        <SafeAreaView style = {{paddingTop: '15%', alignItems: "center"}}>
            <Image style = {{width: 165, height: 165, borderRadius: 165 / 2, overflow: "hidden", borderColor: "black", borderWidth: .6}} source = {{ uri: pfp }}></Image>
            <Text />
            <Button title = "Choose Profile Picture" onPress = {() => pfpSelect()}></Button>
            <Text />

            <View style = {{paddingBottom: 10}}>
                <Text style = {{textAlign: 'center'}} id = 'fnameL'>First Name</Text>
                <TextInput style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => creationBody.current.firstname = text} id = 'fName'></TextInput>
            </View>
            
            <View style = {{paddingBottom: 10}}>
                <Text style = {{textAlign: 'center'}} id = 'lnameL'>Last Name</Text>
                <TextInput style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => creationBody.current.lastname = text} id = 'lName'></TextInput>
            </View>

            <View style = {{paddingBottom: 10}}>
                <Text style = {{textAlign: 'center'}} id = 'emailL'>Email</Text>
                <TextInput style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => creationBody.current.email = text} id = 'emailI'></TextInput>
            </View>

            <View style = {{paddingBottom: 10}}>
                <Text style = {{textAlign: 'center'}} id = 'unameL'>Username</Text>
                <TextInput maxLength = {25} style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => creationBody.current.username = text} id = 'uName'></TextInput>
            </View>

            <View style = {{paddingBottom: 10}}>
                <Text style = {{textAlign: 'center'}} id = 'pwL'>Password</Text>
                <TextInput style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => creationBody.current.password = text} id = 'pw'></TextInput>
            </View>
            <Text />

            <Button title = "Sign Up" onPress = {() => signUpUser()} />
        </SafeAreaView>
    )
}
import { React, Component} from 'react';
//import './css/Landing.css'
import { Text, SafeAreaView, View, Image, TextInput, Button } from 'react-native';

class LandingComp extends Component{
    constructor(props){
        super(props)
        this.navigation = props.navigation
        this.state = {
            error: "hidden",
            modalVis: false
        };
        this.inputBody = {
            login1: "", 
            password: ""
        }
    }

    signUpOnClick(){
        this.navigation.navigate("Signup") //source: https://www.youtube.com/watch?v=-40TBdSRk6E
    }

    async login(){
        console.log("inputBody" + this.inputBody)
    
        let response = await fetch('http://10.0.2.2:3443/users/signIn', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type':'application/json'},
            body: JSON.stringify({login1: this.inputBody.login1, password: this.inputBody.password})
        }).then(function(resp){
            return resp.json()
        })
        console.log(response)

        this.navigation.navigate('Home', {userData: response})
    }

    render(){
        return(
            <SafeAreaView style = {{paddingTop: '15%'}}>
                <View style = {{alignItems: "center"}}>
                    <Image style = {{width: 200, height: 200}} id = 'logo' source = {require('./assets/exc365Logo.png')}></Image>
                        <Text />
                    <Text>Email/Username</Text>
                    <TextInput style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => this.inputBody.login1 = text}></TextInput>
                        <Text />
                    <Text>Password</Text>
                    <TextInput style = {{width: 300, borderStyle: "solid", borderWidth: 1, borderRadius: 10, textAlign: 'center'}} onChangeText={text => this.inputBody.password = text} id = "pass"></TextInput>
                    </View>
                    <Text />
                <View style = {{flexDirection: "row", justifyContent: "center"}}>
                    <Button title = "Sign Up" onPress={() => this.signUpOnClick()} />
                    <View style = {{width: 30}}></View>
                    <Button title = "Login" onPress={() => this.login()} />
                </View>
            </SafeAreaView>
        )
    }
}

export default function Landing({navigation}){
    return(
        <LandingComp navigation = {navigation}></LandingComp>
    )
}
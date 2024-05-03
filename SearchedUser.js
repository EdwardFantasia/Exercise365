import { TextInput, View, Text, Image, Pressable } from "react-native";

export default function SearchedUser(props){
    const user = props.smallProfData
    const goToAccount = props.goToAccount
    return(
        <Pressable onPress = {() => goToAccount()} style = {{marginBottom: '.5%', width: '70%', alignItems: 'center', borderStyle: "solid", borderWidth: 1, borderRadius: 10}}>
            <Image style = {{marginTop: 3, width: 115.5, height: 115.5, borderRadius: 165 / 2, overflow: "hidden", borderColor: "black", borderWidth: .6}} source = {{ uri: `${user.picture}`}}></Image>
            <Text style = {{fontWeight: 'bold', fontSize: 18}}>{user.username}</Text>
        </Pressable>
    )
}
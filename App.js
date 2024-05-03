import Landing from './Landing'
import Signup from './Signup';
import Home from './Home'
import MealGenerat from './MealGenerat'
import Search from './Search'
import SearchedUserProf from './SearchedUserProf';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutGenerat from './WorkoutGenerat';
import Settings from './Settings'

import { StyleSheet } from 'react-native';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = 'Landing' screenOptions={{headerShown: false}}> 
        <Stack.Screen name='Landing' component={Landing}/>
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='MealGen' component={MealGenerat} />
        <Stack.Screen name='WorkoutGen' component = {WorkoutGenerat} />
        <Stack.Screen name='Search' component = {Search} />
        <Stack.Screen name='SearchedUserProf' component={SearchedUserProf} />
        <Stack.Screen name='Settings' component = {Settings}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const style = StyleSheet.create({

})
// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import CreateGameScreen from './screens/CreateGameScreen';
import JoinGameScreen from './screens/JoinGameScreen';
import GameScreen from './screens/GameScreen';
import { PrivyProvider } from '@privy-io/expo';
const Stack = createStackNavigator();

export default function App() {
  return (
    <PrivyProvider appId="cm8kncwzt00bx6llqorf33j6d" clientId="client-WY5i2gNP81TmhGt9Tu3ByKRePhG45QHoaX4Ytm2js1UEB">

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateGame" component={CreateGameScreen} />
          <Stack.Screen name="JoinGame" component={JoinGameScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PrivyProvider>

  );
}

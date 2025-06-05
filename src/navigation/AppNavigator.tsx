import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { CreateGameScreen } from '../screens/create-game/CreateGameScreen';
import { JoinGameScreen } from '../screens/join-game/JoinGameScreen';
import { LobbyScreen } from '../screens/lobby/LobbyScreen';
import { ChooseGameScreen } from '../screens/ChooseGameScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateGame: undefined;
  JoinGame: undefined;
  Lobby: { code: string; pseudo: string };
  ChooseGame: { code: string; pseudo: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateGame" component={CreateGameScreen} />
      <Stack.Screen name="JoinGame" component={JoinGameScreen} />
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="ChooseGame" component={ChooseGameScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
); 
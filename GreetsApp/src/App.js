import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import RecordScreen from './src/screens/RecordScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import LanguageSelector from './src/components/LanguageSelector';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'GreetsApp' }}
        />
        <Stack.Screen 
          name="Record" 
          component={RecordScreen}
          options={{ title: 'Create Greeting' }}
        />
        <Stack.Screen 
          name="Preview" 
          component={PreviewScreen}
          options={{ title: 'Preview & Share' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
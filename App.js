import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import ConfessionScreen from './src/screens/ConfessionScreen';
import VentBoardScreen from './src/screens/VentBoardScreen';
import AnonymousChatScreen from './src/screens/AnonymousChatScreen';

// Services
import { auth, signInAnonymously } from './src/services/firebase';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#1e1e1e',
        borderTopColor: '#333',
      },
      tabBarActiveTintColor: '#1e88e5',
      tabBarInactiveTintColor: '#888',
      headerStyle: {
        backgroundColor: '#1e1e1e',
        borderBottomColor: '#333',
        borderBottomWidth: 1,
      },
      headerTintColor: '#fff',
    }}
  >
    <Tab.Screen
      name="Confess"
      component={ConfessionScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="comment-plus" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="VentBoard"
      component={VentBoardScreen}
      options={{
        title: 'Public Vents',
        tabBarIcon: ({ color, size }) => (
          <Icon name="bulletin-board" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Chat"
      component={AnonymousChatScreen}
      options={{
        title: 'Anonymous Chat',
        tabBarIcon: ({ color, size }) => (
          <Icon name="message-lock" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Handle anonymous authentication
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          await signInAnonymously();
        } catch (error) {
          console.error('Anonymous auth error:', error);
        }
      } else {
        setUser(user);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#121212' },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 
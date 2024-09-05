import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import FrontPage from '../components/FrontPage';
import Login from '../components/Login';
import Register from '../components/Register';
import DashboardNavigation from '../components/DashboardNavigation';
import WorkHistory from '../components/WorkHistory';
import AdminNavigation from '../components/AdminNavigation';

const Stack = createNativeStackNavigator();

function Screen() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content"
        backgroundColor="#fff"
        translucent={true}
        hidden={false}
      />
      <Stack.Navigator>
        <Stack.Screen name="FrontPage" component={FrontPage} options={{ headerShown: false, presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right'}} />
        <Stack.Screen name="Login" component={Login} options={{presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right'}} />
        <Stack.Screen name="Register" component={Register} options={{presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right'}} />
        <Stack.Screen name="DashboardHome" component={DashboardNavigation} options={{ headerShown: false, presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />
        <Stack.Screen name="AdminHome" component={AdminNavigation} options={{ headerShown: false, presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />
        <Stack.Screen name="WorkHistory" component={WorkHistory} options={{ headerShown: true, presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Screen;
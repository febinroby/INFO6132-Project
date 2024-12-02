import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { AuthContext } from './context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user } = React.useContext(AuthContext);

    return (
        <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen}  options={{headerShown: false}}/>
                    <Stack.Screen name="Signup" component={SignupScreen}  options={{headerShown: false}}/>
                </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

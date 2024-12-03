import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { AuthContext } from './context/AuthContext';
import { Ionicons } from 'react-native-vector-icons';
import ProfileScreen from './screens/ProfileScreen';
import EditExpenseScreen from './screens/EditExpenseScreen'; 
import { COLORS } from '../constants';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// AppTabs for bottom tab navigation
const AppTabs = () => (
  <Tab.Navigator 
      screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                  iconName = 'home';
              } else if (route.name === 'Add Expense') {
                  iconName = 'add-circle';
              } else if(route.name === "Profile"){
                iconName = "person-circle-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary
      })}
  >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Add Expense" component={AddExpenseScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen}/>
  </Tab.Navigator>
);

// Main App Navigator with tabs and authentication check
const AppNavigator = () => {
    const { user } = React.useContext(AuthContext);

    return (
        <NavigationContainer>
            {user ? (
                // Single Stack Navigator with both Tab Screens and EditExpense screen
                <Stack.Navigator>
                    <Stack.Screen name="HomeStack" component={AppTabs} options={{headerShown: false}}/>
                    <Stack.Screen name="Edit Expense" component={EditExpenseScreen} options={{headerShown: true}} />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen}  options={{headerShown: false}}/>
                    <Stack.Screen name="Signup" component={SignupScreen}  options={{headerShown: false}}/>
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;

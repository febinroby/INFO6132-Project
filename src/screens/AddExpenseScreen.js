import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import ExpenseForm from '../components/ExpenseForm';
import { addExpense } from '../services/expenseService';

const AddExpenseScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAddExpense = async (newExpense) => {
        setIsLoading(true);
        try {
            await addExpense(newExpense); // Call your addExpense function
            Alert.alert('Success', 'Expense added successfully!');
            navigation.goBack(); // Go back to the HomeScreen
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ExpenseForm
                onSubmit={handleAddExpense}
                isLoading={isLoading}
            />
        </View>
    );
};

export default AddExpenseScreen;

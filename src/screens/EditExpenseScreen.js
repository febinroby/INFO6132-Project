import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { updateExpense } from '../services/expenseService'; // Import the updateExpense function
import ExpenseForm from '../components/ExpenseForm'; // Import the ExpenseForm component
import { COLORS } from '../../constants';

const EditExpenseScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { expense } = route.params; // Get the expense passed from HomeScreen

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateExpense = async (updatedExpense) => {
        setIsLoading(true);
        try {
            await updateExpense(updatedExpense); // Call the updateExpense function
            Alert.alert('Success', 'Expense updated successfully!');
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
                onSubmit={(formData) => {
                    const updatedExpense = { ...expense, ...formData };
                    handleUpdateExpense(updatedExpense); // Pass the updated expense to the function
                }}
                isLoading={isLoading}
                initialValues={{
                    title: expense.title,
                    amount: expense.amount.toString(),
                    category: expense.category,
                }}
            />
        </View>
    );
};

export default EditExpenseScreen;

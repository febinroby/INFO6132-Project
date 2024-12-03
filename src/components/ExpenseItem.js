import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ExpenseItem = ({ expense, onDelete }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{expense.title}</Text>
            <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
            <Button title="Delete" onPress={onDelete} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    amount: {
        fontSize: 16,
        color: 'green',
    },
});

export default ExpenseItem;

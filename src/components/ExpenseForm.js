import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants';

const ExpenseForm = ({ onSubmit, isLoading, initialValues = {} }) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [amount, setAmount] = useState(initialValues.amount || '');
  const [category, setCategory] = useState(initialValues.category || 'Food'); // Default category

  const handleSubmit = () => {
      if (!title || !amount) {
          Alert.alert('Error', 'Please fill out all fields.');
          return;
      }
      onSubmit({ title, amount: parseFloat(amount), category });
  };

  return (
      <View style={styles.container}>
          <Text style={styles.heading}>{initialValues.title ? 'Edit Expense' : 'Add New Expense'}</Text>
          <TextInput
              placeholder="Expense Title"
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
          />
          <TextInput
              placeholder="Amount"
              placeholderTextColor={COLORS.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
          />
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
              <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
              >
                  <Picker.Item label="Food" value="Food" />
                  <Picker.Item label="Transportation" value="Transportation" />
                  <Picker.Item label="Utilities" value="Utilities" />
                  <Picker.Item label="Entertainment" value="Entertainment" />
                  <Picker.Item label="Others" value="Others" />
              </Picker>
          </View>
          {isLoading ? (
              <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Adding your expense...</Text>
              </View>
          ) : (
              <Button title={initialValues.title ? 'Save Expense' : 'Add Expense'} color={COLORS.primary} onPress={handleSubmit} />
          )}
      </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: COLORS.textPrimary,
        marginBottom: 8,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});

export default ExpenseForm;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../../constants';
import { supabase } from '../services/supabaseClient';
import { deleteExpense } from '../services/expenseService'; 
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native'; 

const HomeScreen = () => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); 

    const loadExpenses = async () => {
        try {
            setLoading(true); 
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;

            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);  
        }
    };

    useEffect(() => {
        loadExpenses();
        
        const subscribeToRealTimeUpdates = () => {
            const subscription = supabase
                .channel('table_changes')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            setExpenses((prev) => [...prev, payload.new]);
                        } else if (payload.eventType === 'UPDATE') {
                            setExpenses((prev) =>
                                prev.map((expense) =>
                                    expense.id === payload.new.id ? payload.new : expense
                                )
                            );
                        } else if (payload.eventType === 'DELETE') {
                            setExpenses((prev) =>
                                prev.filter((expense) => expense.id !== payload.old.id)
                            );
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        };

        const unsubscribe = subscribeToRealTimeUpdates();
        return () => {
            unsubscribe();
        };
    }, [user]);

    const groupedExpenses = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) acc[expense.category] = [];
        acc[expense.category].push(expense);
        return acc;
    }, {});

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const handleDeleteExpense = async (id) => {
        await deleteExpense(id);
        loadExpenses(); 
    };

    const handleEditExpense = (expense) => {
        navigation.navigate('Edit Expense', { expense }); 
    };

    const getFilteredExpenses = () => {
      const now = new Date();
  
      return expenses.filter((expense) => {
          const expenseDate = new Date(expense.created_at);
  
          if (filter === 'Weekly') {
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              startOfWeek.setHours(0, 0, 0, 0);
  
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              endOfWeek.setHours(23, 59, 59, 999);
  
              return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
          }
  
          if (filter === 'Monthly') {
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              startOfMonth.setHours(0, 0, 0, 0);
  
              const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              endOfMonth.setHours(23, 59, 59, 999);
  
              return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
          }
  
          return true; 
      });
  };
  

    const renderExpense = ({ item }) => (
        <View style={styles.expenseItem}>
            <Text style={styles.expenseTitle}>{item.title}</Text>
            <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => handleEditExpense(item)}>
                <Icon name="edit" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                <Icon name="delete" size={24} color={COLORS.danger} />
            </TouchableOpacity>
        </View>
    );

    const renderCategory = ({ item: category }) => (
        <View style={styles.categoryContainer}>
            <View style={styles.categoryBackground}>
                <Text style={styles.categoryHeader}>{category}</Text>
                <FlatList
                    data={groupedExpenses[category]}
                    renderItem={renderExpense}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />
            </View>
        </View>
    );

    const filteredExpenses = getFilteredExpenses(); // Apply filter
    const filteredGroupedExpenses = filteredExpenses.reduce((acc, expense) => {
        if (!acc[expense.category]) acc[expense.category] = [];
        acc[expense.category].push(expense);
        return acc;
    }, {});
    const filteredTotalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Expenses</Text>
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setFilter('All')} style={styles.filterButton}>
                    <Text style={filter === 'All' ? styles.filterActive : styles.filterText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('Weekly')} style={styles.filterButton}>
                    <Text style={filter === 'Weekly' ? styles.filterActive : styles.filterText}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('Monthly')} style={styles.filterButton}>
                    <Text style={filter === 'Monthly' ? styles.filterActive : styles.filterText}>Monthly</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <FlatList
                    data={Object.keys(filteredGroupedExpenses)}
                    renderItem={renderCategory}
                    keyExtractor={(category) => category}
                    ListFooterComponent={
                        <View style={styles.expenseItem}>
                            <Text style={styles.expenseTitle}>Total</Text>
                            <Text style={styles.expenseAmount}>${filteredTotalExpenses.toFixed(2)}</Text>
                        </View>
                    }
                />
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
      fontSize: 28,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
  },
  categoryContainer: {
      marginBottom: 20,
  },
  categoryBackground: {
      backgroundColor: COLORS.lightBackground,
      borderRadius: 8,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  categoryHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.textSecondary,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.divider,
      paddingBottom: 5,
  },
  expenseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: COLORS.cardBackground,
      borderRadius: 8,
      marginBottom: 8,
  },
  expenseTitle: {
      fontSize: 16,
      color: COLORS.textPrimary,
  },
  expenseAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.success,
  },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    filterButton: {
        marginHorizontal: 10,
    },
    filterText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    filterActive: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default HomeScreen;

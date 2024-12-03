import { supabase } from './supabaseClient';

export const fetchExpenses = async (userId) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
};

export const addExpense = async (expense) => {
    const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense}]);

    if (error) throw error;
    return data;
};

export const deleteExpense = async (id) => {
  try {
      const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', id);

      if (error) throw error;
  } catch (error) {
      console.error('Error deleting expense:', error);
  }
};

export const updateExpense = async (expense) => {
  const { data, error } = await supabase
      .from('expenses')
      .update({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
      })
      .eq('id', expense.id);

  if (error) throw error;
  return data;
};


export const fetchUserExpenses = async (userId) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data;
};

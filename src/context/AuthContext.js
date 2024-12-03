import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const initializeSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error fetching session:', error);
            } else {
                setSession(data.session);
                setUser(data.session?.user || null);
            }
        };

        initializeSession();

        const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
        });

        // Correct cleanup for the listener
        return () => {
            authSubscription.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            setUser(null);
            setSession(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

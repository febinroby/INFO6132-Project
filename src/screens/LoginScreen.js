import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../../constants';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Login error:', error.message);
                return { success: false, error: error.message };
            }

            console.log('Login successful:', data);
            return { success: true, data };
        } catch (err) {
            console.error('Unexpected error:', err);
            return { success: false, error: 'Unexpected error occurred.' };
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require("../../assets/money.png")} />
            </View>
            <View style={{ height: 30 }} />
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subHeading}>Please login to continue</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize='none'
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize='none'
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate('Signup')}
                >
                    Sign Up
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: COLORS.background,
    },
    heading: {
        fontSize: FONT_SIZES.large,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    subHeading: {
        fontSize: FONT_SIZES.medium,
        fontWeight: FONT_WEIGHTS.medium,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        marginBottom: 16,
        padding: 14,
        borderRadius: 10,
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.input,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: FONT_SIZES.button,
        fontWeight: FONT_WEIGHTS.medium,
    },
    footerText: {
        textAlign: 'center',
        fontSize: FONT_SIZES.small,
        color: COLORS.textMuted,
        marginTop: 12,
    },
    link: {
        color: COLORS.secondary,
        textDecorationLine: 'underline',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 180,
        height: 200,
    },
});

export default LoginScreen;

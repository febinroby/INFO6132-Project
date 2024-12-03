import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../constants';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

const ProfileScreen = ({ navigation }) => {
    const { user, signOut } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(user?.user_metadata?.displayName || '');
    const [profilePhoto, setProfilePhoto] = useState(user?.user_metadata?.profilePhoto || null);
    const [uploading, setUploading] = useState(false);

    const handleUpdateProfile = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { displayName, profilePhoto },
            });
            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error) {
            alert(`Error updating profile: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        await signOut();
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

const uploadImage = async (uri) => {
    try {
        setUploading(true);
        console.log("URI: ", uri);

        const response = await fetch(uri);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result.split(',')[1]; 
            const arrayBuffer = decode(base64data); 

            const fileName = `photos/${user.id}.jpg`;
            console.log("file name: ", fileName);

            const { error } = await supabase.storage
                .from('profilephoto')
                .upload(fileName, arrayBuffer, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: blob.type || 'image/jpeg', 
                });

            if (error) throw error;

            const { data } = supabase.storage.from('profilephoto').getPublicUrl(fileName);
            if (data) {
                setProfilePhoto(data.publicUrl);  
                await handleUpdateProfile(); 
            }
        };

        reader.readAsDataURL(blob);  

    } catch (error) {
        alert(`Error uploading image: ${error.message}`);
    } finally {
        setUploading(false);
    }
};


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={
                            profilePhoto
                                ? { uri: profilePhoto }
                                : require('../../assets/user.png') 
                        }
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={styles.heading}>{displayName || 'Your Name'}</Text>
                <Text style={styles.subHeading}>{user?.user_metadata?.email || 'Your Email'}</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Display Name</Text>
                <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    style={styles.input}
                    placeholder="Enter your display name"
                    placeholderTextColor={COLORS.placeholder}
                />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile} disabled={uploading}>
                <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Update Profile'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: COLORS.lightBackground,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    subHeading: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 8,
        padding: 12,
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
        fontSize: 16,
        marginBottom: 16,
    },
    updateButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        alignItems: 'center',
    },
    logoutText: {
        color: COLORS.danger,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ProfileScreen;

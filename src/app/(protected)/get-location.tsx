
import React from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    KeyboardAvoidingView,

} from 'react-native';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function GetLocationScreen() {

    const { getToken } = useAuth();
    const router = useRouter();

    const onGrantLocationPermissions = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});

            try {
                const token = await getToken();

                if (!token) { // should NOT happen but return to prevent funny business
                    return;
                }

                const coords = {
                    lat: location.coords.latitude,
                    long: location.coords.longitude
                };

                const response = await fetch(API_BASE_URL + '/user/set-location', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(coords)
                });

                if (!response.ok) {
                    console.error('Error storing location: ', response.statusText);
                }
                else {
                    router.push('/(protected)/set-display-name');
                }
            } catch (error) {
                console.error('Error storing location: ', error);
            }
        } catch (error) {
            console.error('Error getting location:', error);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={styles.container}>
            <Text style={styles.title}>Location permissions required for accurate recommendations!</Text>
            <CustomButton
                text="Grant Location Permissions" onPress={onGrantLocationPermissions}></CustomButton>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1d1e2c',
        padding: 20,
        gap: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#F7EBEC',
    },
    inputsContainer: {
        gap: 6,
    },
    link: {
        fontWeight: '600',
        textAlign: 'center',
    },
    linkText: {
        color: '#F7EBEC',
    },
    linkHighlight: {
        color: '#Ac9fbb',
    }
});
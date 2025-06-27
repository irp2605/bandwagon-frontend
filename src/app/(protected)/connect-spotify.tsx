
import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,

} from 'react-native';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
WebBrowser.maybeCompleteAuthSession();

export default function SetDisplayNameScreen() {

    const { getToken } = useAuth();
    const router = useRouter();

    const onAuthorizeSpotify = async () => {
        try {
            const token = await getToken();
            if (!token) {
                console.error('Authentication required');
                return;
            }

            const response = await fetch('http://192.168.4.45:3000/api/spotify/get-auth-url', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                console.error('Failed to get auth URL');
                console.error('Response status:', response.status);
                console.error('Response text:', await response.text());
                return;
            }

            const { authUrl } = await response.json();

            // Open Spotify authorization in WebBrowser
            const result = await WebBrowser.openAuthSessionAsync(
                authUrl,
                `irp2605-bandwagon://spotify-auth`
            );

            console.log('WebBrowser result:', result); // Add this line

            if (result.type === 'success') {
                console.log('Result URL:', result.url); // Add this line
                // ... rest of your code
            }

            if (result.type === 'success') {
                // The backend already handled token exchange in the callback
                // Just check if the URL indicates success or failure
                const url = new URL(result.url);
                const success = url.searchParams.get('success');
                const error = url.searchParams.get('error');

                if (error) {
                    console.error('Spotify authorization error:', error);
                } else if (success) {
                    console.log('Spotify authorization successful!');
                    router.push('/(protected)/set-display-name');
                } else {
                    console.log('Authorization completed but something weird happened');
                }
            } else if (result.type === 'cancel') {
                console.log('User cancelled authorization');
            }
        } catch (error) {
            console.error('Error authorizing Spotify:', error);
        }

    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={styles.container}>
            <Text style={styles.title}>Connect your Spotify!</Text>
            <CustomButton
                text="Authorize Spotify Connection" onPress={onAuthorizeSpotify}></CustomButton>
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
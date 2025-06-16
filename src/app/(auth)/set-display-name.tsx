
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
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { FieldValues, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SignInWith from '@/components/SignInWith';
import { useAuth } from '@clerk/clerk-expo';


const displayNameSchema = z.object({
    displayName: z.string({ message: 'Display Name Required.' }).min(1, 'Display Name must be at least 1 character long.')
});

type DisplayNameFields = z.infer<typeof displayNameSchema>;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function SetDisplayNameScreen() {

    const { getToken } = useAuth(); 

    const { control, handleSubmit, setError, formState: { errors } } = useForm<DisplayNameFields>({
        resolver: zodResolver(displayNameSchema),
    });

    

    const onSubmit = async (data: DisplayNameFields) => {
        const token = await getToken(); 

        fetch(API_BASE_URL + '/user/set-display-name', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // TODO: HANDLE RESPONSE AND NAVIGATE AWAY OR SOMETHING

    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={styles.container}>
            <Text style={styles.title}>Choose a Display Name</Text>

            <View style={styles.inputsContainer}>
                <CustomInput<DisplayNameFields> control={control} name='displayName' placeholder='What your friends will see you as' placeholderTextColor={'#59656F'} autoCapitalize='none' keyboardType='default' autoComplete='off' autoCorrect={false} />

                {errors.root && <Text style={styles.linkHighlight}>{errors.root.message}</Text>}
            </View>

            <CustomButton text="Submit" onPress={handleSubmit(onSubmit)} />

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
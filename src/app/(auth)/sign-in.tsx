
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
import { Link } from 'expo-router';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Alert } from 'react-native';
import SignInWith from '@/components/SignInWith';

const signInSchema = z.object({
    email: z.string({ message: 'Email required.' }).email('Invalid email address.'),
    password: z.string({ message: 'Password required.' }).min(6, 'Password must be at least 6 characters long.'),
});

type SignInFields = z.infer<typeof signInSchema>;

const mapClerkErrorToFormField = (error: any) => {
    switch (error.meta?.paramName) {
        case 'identifier':
            return 'email';
        case 'password':
            return 'password';
        default:
            return 'root';
    }
}

export default function SignInScreen() {

    const { control, handleSubmit, setError, formState:{errors} } = useForm<SignInFields>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });
    
    const { signIn, isLoaded, setActive } = useSignIn();

    const onSignIn = async (data: SignInFields) => {
        console.log('Sign In Data:', data);
        if( !isLoaded) { return; }
        
        try {
            const signInAttempt = await signIn.create({identifier: data.email, password: data.password});

            if (signInAttempt.status === 'complete') {
                setActive({ session: signInAttempt.createdSessionId });
            } else {
                // Handle other statuses (e.g., requires two-factor authentication)
                console.log('Sign In Status:', signInAttempt.status);
                setError('root', { message: 'An unexpected error occurred. Please try again later.' });
            }

        } catch (error) {
            console.error('Sign In Error:', error);
            
            if (isClerkAPIResponseError(error)) {
                error.errors.forEach(error => {
                    const fieldName = mapClerkErrorToFormField(error);
                    setError(fieldName, { message: error.longMessage });
                });
            }
            else {
                setError('root', { message: 'An unexpected error occurred. Please try again later.' });
            }
        }

    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.inputsContainer}>
                <CustomInput<SignInFields> control={control} name='email' placeholder='Email' placeholderTextColor={'#59656F'} autoCapitalize='none' keyboardType='email-address' autoComplete='email' autoCorrect={false} />
                <CustomInput<SignInFields> control={control} name='password' placeholder='Password' placeholderTextColor={'#59656F'} autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />

                {errors.root && <Text style={styles.linkHighlight}>{errors.root.message}</Text>}
            </View>

            <CustomButton text="Sign In" onPress={handleSubmit(onSignIn)} />

            <Link href="/sign-up" style={styles.link}>
                <Text style={styles.linkText}>
                    Don't have an account?
                    <Text style={styles.linkHighlight}> Sign Up</Text>
                </Text>
            </Link>

            <SignInWith />

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
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React from 'react'
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
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const signUpSchema = z.object({
    email: z.string({ message: 'Email required.' }).email('Invalid email address.'),
    password: z.string({ message: 'Password required.' }).min(6, 'Password must be at least 6 characters long.'),
});

type SignUpFields = z.infer<typeof signUpSchema>;

const mapClerkErrorToFormField = (error: any) => {
    switch (error.meta?.paramName) {
        case 'email_address':
            return 'email';
        case 'password':
            return 'password';
        default:
            return 'root';
    }
}

export default function SignUpScreen() {

    const { control, handleSubmit, setError, formState: { errors } } = useForm<SignUpFields>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const { signUp, isLoaded } = useSignUp();
    const router = useRouter();

    const onSignUp = async (data: SignUpFields) => {
        console.log('Sign Up Data:', data);
        if (!isLoaded) { return; }

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            })

            await signUp.prepareVerification({ strategy: 'email_code' });

            router.push('/verify');
        } catch (error) {
            console.error('Sign Up Error:', error);

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
            <Text style={styles.title}>Create an Account</Text>

            <View style={styles.inputsContainer}>
                <CustomInput<SignUpFields> control={control} name='email' placeholder='Email' placeholderTextColor={'#59656F'} autoCapitalize='none' keyboardType='email-address' autoComplete='email' autoCorrect={false} />
                <CustomInput<SignUpFields> control={control} name='password' placeholder='Password' placeholderTextColor={'#59656F'} autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />

                {errors.root && <Text style={styles.linkHighlight}>{errors.root.message}</Text>}
            </View>

            <CustomButton text="Sign Up" onPress={handleSubmit(onSignUp)} />
            <Link href="/sign-in" style={styles.link}>
                <Text style={styles.linkText}>
                    Don't have an account?
                    <Text style={styles.linkHighlight}> Sign In</Text>
                </Text>
            </Link>
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
    },
});
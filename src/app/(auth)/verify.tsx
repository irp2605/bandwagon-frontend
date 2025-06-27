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
import { useRouter } from 'expo-router';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';

const verifySchema = z.object({
    code: z.string({ message: 'Code required.' }).length(6, 'Invalid code.'),
});

type VerifyFields = z.infer<typeof verifySchema>;

const mapClerkErrorToFormField = (error: any) => {
    switch (error.meta?.paramName) {
        case 'code':
            return 'code';
        default:
            return 'root';
    }
}

export default function VerifyScreen() {

    const { control, handleSubmit, setError, formState: { errors } } = useForm<VerifyFields>({
        resolver: zodResolver(verifySchema)
    });

    const { signUp, isLoaded, setActive } = useSignUp();
    const router = useRouter();


    const onVerify = async ({ code }: VerifyFields) => {

        if (!isLoaded) { return; }

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: code,
            });

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/(protected)/connect-spotify');
            } else {
                // Handle other statuses (e.g., requires two-factor authentication)
                console.log('Verification Status:', signUpAttempt.status);
                setError('root', { message: 'An unexpected error occurred. Please try again later.' });

            }

        } catch (error) {
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
            <Text style={styles.title}>Verify Your Email</Text>


            <CustomInput<VerifyFields> control={control} name='code' placeholder='123456' placeholderTextColor={'#59656F'} autoCapitalize='none' keyboardType='number-pad' autoComplete='one-time-code' autoCorrect={false} />

            {errors.root && <Text style={styles.linkHighlight}>{errors.root.message}</Text>}

            <CustomButton text="Submit" onPress={handleSubmit(onVerify)} />
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
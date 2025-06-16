import { Redirect, Slot, Stack, useLocalSearchParams } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
    const { isSignedIn } = useAuth();
    const { newUser } = useLocalSearchParams();

    // if (isSignedIn && !newUser) {
    //     return <Redirect href="/" />;
    // }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#1d1e2c',
                },
                headerTintColor: '#F7EBEC',
            }}>
            <Stack.Screen name='sign-in' options={{ headerShown: false, title:'Sign In' }} />
            <Stack.Screen name='sign-up' options={{ title: 'Sign Up' }} />
        </Stack>
    )
}
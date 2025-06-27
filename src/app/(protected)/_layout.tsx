import { Redirect, Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator } from "react-native";

export default function ProtectedLayout() {
    const {isSignedIn, isLoaded} = useAuth();

     if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if(!isSignedIn) {
        console.log("HIT");
        return <Redirect href="/sign-in" />;
    }
    return <Slot />;
}
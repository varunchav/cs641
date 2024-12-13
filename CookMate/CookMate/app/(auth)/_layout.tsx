import { useAuth } from '@clerk/clerk-expo'

import { Redirect,Stack } from "expo-router";
import {ActivityIndicator} from "react-native";


export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <ActivityIndicator size="large" color={"#25AE87"} />
  }
  console.log({ isSignedIn})
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />
  }
  return (
    <Stack>
        <Stack.Screen
            name="index"
            options={{ title: "Get Started", headerShown: false }}
        />
        <Stack.Screen
            name="login"
            options={{ title: "Login",  headerShown: false }}
        />
        <Stack.Screen
            name="signup"
            options={{ title: "Sign Up", headerShown: false }}
        />
    </Stack>
  );
}

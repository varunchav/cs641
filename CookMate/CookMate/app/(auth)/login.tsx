import * as React from 'react'
import { Link,useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
 } from "react-native";
import { useSignIn } from '@clerk/clerk-expo'
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useWarmUpBrowser } from './signup';

export default function Login() {
  useWarmUpBrowser()
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      const error = err.errors?.[0]?.message || "An error occurred. Please try again.";
      setErrorMessage(error);
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])
  const onGoogleLoginPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'cookmate' }),
      })

      if (createdSessionId) {
        await setActive!({ session: createdSessionId })
        router.replace('/(tabs)')
      } else {
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])
  return (
    <ImageBackground
      source={require("../../assets/Background_Frame.png")}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.5 }}
    >
       <KeyboardAvoidingView
        style={styles.wrapperContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>CookMate</Text>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              placeholderTextColor="#aaa"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              value={emailAddress}  
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              placeholderTextColor="#aaa"
              secureTextEntry
              onChangeText={(password) => setPassword(password)}
              value={password}
            />
            <Pressable style={styles.loginButtonContainer} onPress={onSignInPress}>
              <Text style={styles.loginButton}>Login</Text>
            </Pressable>
            <Link href="/signup" asChild>
              <Pressable>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
              </Pressable>
            </Link>
            <Pressable onPress={onGoogleLoginPress} style={styles.googleButtonContainer}>
              <ImageBackground
                source={require('../../assets/google-logo.png')} 
                style={styles.googleLogo} />
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "black",
  },
  wrapperContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    paddingVertical: 15,
    color: "white",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
    color: "black",
  },
  loginButtonContainer: {
    backgroundColor: "#25AE87",
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  loginButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  googleButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 40,
    justifyContent: "center",
    marginTop: 15,
    gap: 15
  },
  googleLogo: {
    width: 25,
    height: 25,
  },
  googleButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});
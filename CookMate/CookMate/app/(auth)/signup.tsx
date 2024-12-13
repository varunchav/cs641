import * as React from 'react'
import { useRouter, Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useSignUp, useOAuth } from '@clerk/clerk-expo'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'




export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()


export default function Signup() {
  useWarmUpBrowser()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onGoogleSignUpPress = React.useCallback(async () => {
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
            {!pendingVerification && (
              <>
                <TextInput 
                  placeholder="Email" 
                  style={styles.input} 
                  placeholderTextColor="#aaa"
                  value={emailAddress}
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  />
                  <TextInput
                    placeholder="Password"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                  />
                  <Pressable style={styles.signupButtonContainer} onPress={onSignUpPress}>
                    <Text style={styles.signupButton}>Sign Up</Text>
                  </Pressable>
              </> 
            )}
            {pendingVerification && (
                <>
                  <TextInput 
                    value={code} 
                    style={styles.input} 
                    placeholder="Enter the verification code" 
                    onChangeText={(code) => setCode(code)} 
                  />
                  <Pressable style={styles.signupButtonContainer} onPress={onPressVerify}>
                    <Text style={styles.signupButton}>Verify Email</Text>
                  </Pressable>
                </>       
            )}
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.link}>Already have an account? Login</Text>
              </Pressable>
            </Link>
            <Pressable onPress={onGoogleSignUpPress} style={styles.googleButtonContainer}>
              <ImageBackground
               source={require('../../assets/google-logo.png')} 
               style={styles.googleLogo} />
              <Text style={styles.googleButtonText} >Sign in with Google</Text>
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
  signupButtonContainer: {
    backgroundColor: "#25AE87",
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  signupButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "white",
    fontSize: 16,
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

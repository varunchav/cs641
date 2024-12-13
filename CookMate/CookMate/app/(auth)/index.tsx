import { Link } from "expo-router";
import { View, Text, StyleSheet, Button, ImageBackground, Pressable } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function GetStarted() {
  return (
    <ImageBackground
      source={require("../../assets/Background_Frame.png")}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.5 }} 
    >
      <View style={styles.wraperContainer}>
        <View style={styles.container}>
            <Text style={styles.title}>CookMate</Text>
            <Text style={styles.subtitle}>
                CookMate is your personal kitchen assistant, simplifying cooking with endless recipes and smart meal planning.
            </Text>
            <Link href="/login" asChild>
                <Pressable style={styles.getStartedButtonContainer}>
                    <Text style={styles.getStartedButton}>Get Started</Text>
                </Pressable>
            </Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", 
    backgroundColor: "black",
  },
  wraperContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  container:{
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    width: "100%",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 15,
    paddingHorizontal: 5,
    color: "white",
    paddingVertical: 15, 
    textAlign: "center",
  },
  getStartedButtonContainer:{
    backgroundColor: "#25AE87",
    paddingVertical: 15, 
    paddingHorizontal: 10,
    borderRadius: 8,
    width: "80%", 
    alignItems: "center", 
  },
  getStartedButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  }
});

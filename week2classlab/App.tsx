import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView , ActivityIndicator, Image} from 'react-native';

export default function App() {
  return (
    <ScrollView>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>Text 1</Text>
      <Text>Text 2</Text>
      <ActivityIndicator />
      <Image 
        source={{uri:'https://reactnative.dev/img/tiny_logo.png'}} 
        style={styles.tinyLogo} >
        </Image>
      <StatusBar style="auto" />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 500,
    height: 500,
  },
});

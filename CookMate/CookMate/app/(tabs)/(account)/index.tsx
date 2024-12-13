import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from 'react-native';
import { useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useAuth,useUser } from '@clerk/clerk-expo'

export default function Account() {
    const { signOut } = useAuth()
    const { user } = useUser()
    const router = useRouter()
    const email = user?.emailAddresses[0].emailAddress
    const name = email?.split('@')[0]
    const logout = async () => {
        await signOut()
        router.replace('/(auth)')
    }
    
  return (
    <ImageBackground
            source={require('../../../assets/Background_Frame.png')} 
            style={styles.backgroundImage}
            imageStyle={{ opacity: 0.5 }} 
        >
        <View style={styles.container}>
            {/* Welcome Message */}
            <Text style={styles.welcomeText}>Welcome {name} !</Text>

            {/* Favourite Recipes Button */}
            <TouchableOpacity style={styles.card} onPress={() => router.push('/(recipe)/myfavourties')}>
                <MaterialIcons name="favorite" size={36} color="#E53E3E" />
                <Text style={styles.cardText}>Recipe Favourite</Text>
            </TouchableOpacity>

            {/* My Uploads Button */}
            <TouchableOpacity style={styles.card} onPress={() => router.push('/(recipe)/myrecipes')}>
                <MaterialIcons name="cloud-upload" size={36} color="#38A169" />
                <Text style={styles.cardText}>Recipe Uploads</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 80, // To avoid overlap with navigation bar
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38A169',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginVertical: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
    textAlign: 'center',
  },
  logoutButton: {
    width: '80%',
    backgroundColor: '#38A169',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
});

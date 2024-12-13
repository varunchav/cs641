import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../FirebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import RecipeCard from '../../components/RecipeCard'; // Assuming you have this component
import { useUser } from '@clerk/clerk-expo';  // Import Clerk hook
import { useRouter } from 'expo-router';
export default function MyUploads() {
  const { user } = useUser();  // Get current user
  const [myRecipes, setMyRecipes] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      if (!user?.emailAddresses[0]?.emailAddress) {
        console.log('No user email found');
        setLoading(false);
        return;
      }

      try {
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        console.log({userEmail});
        const querySnapshot = await getDocs(collection(db, 'allRecipes'));
        const userRecipesData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((recipe: any) => recipe.email === userEmail); // Filter by user's email
        setMyRecipes(userRecipesData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, [user]);

  const handleDelete = async (recipeId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this recipe?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'allRecipes', recipeId));
            setMyRecipes((prevRecipes: any[]) =>
              prevRecipes.filter((recipe) => recipe.id !== recipeId)
            );
            Alert.alert('Success', 'Recipe deleted successfully!');
          } catch (error) {
            console.error('Error deleting recipe:', error);
            Alert.alert('Error', 'Could not delete the recipe.');
          }
        },
      },
    ]);
  };

  const renderRecipeItem = ({ item }: { item: any }) => (
    <View style={styles.recipeCard}>
      <RecipeCard recipe={item} hideFavoritesIcon />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(account)")} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Uploads</Text>
        </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38A169" />
          <Text style={styles.loadingText}>Loading My Uploads...</Text>
        </View>
      ) : (
        <FlatList
          data={myRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>No uploads found.</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    backgroundColor: '#EFEFEF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  recipeCard: {
    marginBottom: 15,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  }
});

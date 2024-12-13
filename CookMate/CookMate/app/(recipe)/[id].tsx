import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../FirebaseConfig'; // Adjust the import path if needed
import { doc, getDoc, updateDoc, setDoc  } from 'firebase/firestore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

const RecipeDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'allRecipes', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          console.error('No such recipe found!');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!user?.emailAddresses[0]?.emailAddress) return;

        const userEmail = user.emailAddresses[0].emailAddress;
        const userDocRef = doc(db, 'users', userEmail);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const favoriteRecipes = userDoc.data()?.favouriteRecipes || [];
          setIsFavorite(favoriteRecipes.includes(id));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    if (id && user) fetchFavorites();
  }, [id, user]);

  // Add to Favorites
  const addToFavorites = async () => {
    try {
      if (!user?.emailAddresses[0]?.emailAddress) {
        console.error('User email not found');
        return;
      }

      const userEmail = user.emailAddresses[0].emailAddress;
      const userDocRef = doc(db, 'users', userEmail);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Update existing document
        const currentFavorites = userDoc.data()?.favouriteRecipes || [];
        if (!currentFavorites.includes(id)) {
          await updateDoc(userDocRef, {
            favouriteRecipes: [...currentFavorites, id],
          });
          setIsFavorite(true);
        }
      } else {
        // Create new document
        await setDoc(userDocRef, {
          email: userEmail,
          favouriteRecipes: [id],
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38A169" />
        <Text style={styles.loadingText}>Loading Recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
     <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{recipe.item}</Text>
        <TouchableOpacity onPress={addToFavorites}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={isFavorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>

      {/* Recipe Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Recipe Image */}
        <Image source={{ uri: recipe.image }} style={styles.image} />

        {/* Recipe Details */}
        <View style={styles.details}>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.label}>
            Category: <Text style={styles.value}>{recipe.category}</Text>
          </Text>
          <Text style={styles.label}>
            Cuisine: <Text style={styles.value}>{recipe.cuisine}</Text>
          </Text>
          <Text style={styles.label}>
            Prep Time: <Text style={styles.value}>{recipe.prepTime}</Text>
          </Text>
          <Text style={styles.label}>
            Cook Time: <Text style={styles.value}>{recipe.cookTime}</Text>
          </Text>
          <Text style={styles.label}>Ingredients:</Text>
          <Text style={styles.value}>{recipe.ingredients}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
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
  content: {
    padding: 15,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3, // 4:3 ratio
    borderRadius: 10,
    marginBottom: 20,
  },
  details: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  favouriteButton: {
    backgroundColor: '#38A169',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  favouriteButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity,
    FlatList
 } from 'react-native';
import { db } from '../../FirebaseConfig'; // Adjust the import path if needed
import { getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import RecipeCard from '../../components/RecipeCard'; // Adjust the path as per your project structure
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
const MyFavourites = () => {
  const router = useRouter();
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchFavourites = async () => {
        setLoading(true);
        const userEmail = user?.emailAddresses[0]?.emailAddress;
            
        if (!userEmail) {
            setError('User email not found.');
            setFavourites([]);
            return;
        }

    try {
            const userDocRef = doc(db, 'users', userEmail);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                setError('No favourites found for this user.');
                setFavourites([]);
                return;
            }

            const userData = userDoc.data();
            const favouriteRecipeIds = userData?.favouriteRecipes || []; // Ensure 'favourites' is an array in your Firestore schema
            if (favouriteRecipeIds.length === 0) {
                setError('No favourites found for this user.');
                setFavourites([]);
                return;
            }

            const favouriteRecipes = await Promise.all(
                favouriteRecipeIds.map(async (recipeId: string) => {
                const recipeDoc = await getDoc(doc(db, 'allRecipes', recipeId));
                if (recipeDoc.exists()) {
                    return { id: recipeDoc.id, ...recipeDoc.data() };
                }
                return null;
                })
            );
            setFavourites(favouriteRecipes); // Remove any null values
    } 
    catch (err) {
            console.error('Error fetching favourites:', err);
            setError('Failed to load favourites. Please try again later.');
        }
    finally {
            setLoading(false);
        }
    };

    fetchFavourites();
  }, []);

  const renderRecipeItem = ({ item }: { item: any }) => (
    <View style={styles.recipeCard}>
      <RecipeCard recipe={item} hideFavoritesIcon />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38A169" />
        <Text style={styles.loadingText}>Loading Favourites...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/(account)")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no favourite recipes yet.</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/(account)")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(account)")} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Favourites</Text>
        </View>

        <FlatList
          data={favourites}
          renderItem={renderRecipeItem}
          keyExtractor={(item :any) => item.id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>No uploads found.</Text>
          )}
        />
    </View>

  );
};

export default MyFavourites;

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
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#38A169',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  }
});

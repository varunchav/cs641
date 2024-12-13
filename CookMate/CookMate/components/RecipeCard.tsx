import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { db } from '../FirebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
// Recipe Card Component
const RecipeCard = ({ recipe, hideFavoritesIcon }: { recipe: any, hideFavoritesIcon?: boolean }) => {
  const { ingredients } = recipe;
  const tags = ingredients ? ingredients.split(",") : [];
  const router = useRouter();
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the recipe is already in favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!user?.emailAddresses[0]?.emailAddress) return;

        const userEmail = user.emailAddresses[0].emailAddress;
        const userDocRef = doc(db, 'users', userEmail);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const favoriteRecipes = userDoc.data()?.favouriteRecipes || [];
          setIsFavorite(favoriteRecipes.includes(recipe.id));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [recipe.id, user]);

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
        if (!currentFavorites.includes(recipe.id)) {
          await updateDoc(userDocRef, {
            favouriteRecipes: [...currentFavorites, recipe.id],
          });
          setIsFavorite(true);
        }
      } else {
        // Create new document
        await setDoc(userDocRef, {
          email: userEmail,
          favouriteRecipes: [recipe.id],
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/(recipe)/[id]',
          params: {
            id: recipe.id
          },
        })
      }>
    <Image source={{ uri: recipe.image }} style={styles.cardImage} />
    {
      !hideFavoritesIcon &&     <TouchableOpacity style={styles.heartIcon} onPress={addToFavorites}>
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorite ? 'red' : 'white'}
        />
      </TouchableOpacity>
    }

    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{recipe.item}</Text>
      <Text style={styles.cardDescription}>{recipe.description}</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </View>
  </TouchableOpacity>
};


const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 175,
    resizeMode: 'cover',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    fontSize: 12,
    color: '#38A169',
    backgroundColor: '#eafaf1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  }
});

export default RecipeCard;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
  Button,
  Pressable,
  Modal,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useCameraPermissions, CameraType, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../../FirebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

export default function Create() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<{ uri: string} | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const cameraRef = useRef<any>(null);
  const { user } = useUser();
  //  console.log({user: user?.emailAddresses[0].emailAddress})
  const [formData, setFormData] = useState({
    item: '',
    description: '',
    category: '',
    cuisine: '',
    prepTime: '',
    cookTime: '',
    ingredients: '',
    image: null, // Stores image URI
  });


  const toggleCameraType = () => {
    setCameraType((current: string) => (current === 'back' ? 'front' : 'back'));
  };



   const pickImage = async () => {    
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setPhoto(result.assets?.[0]);
    }
  };
  


const handleSave = async () => {
  if (!photo?.uri) {
    console.error('No image selected');
    return;
  }

  const recipeData: any = {
    ...formData,
    email: user?.emailAddresses[0]?.emailAddress || 'Anonymous',
  };

  try {
    const storage = getStorage();
    const imageName = `${Date.now()}-${user?.id || 'anonymous'}.jpg`; // Unique file name
    const storageRef = ref(storage, `recipe-images/${imageName}`);

    const response = await fetch(photo.uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    console.log('Image uploaded successfully:', downloadURL);

    recipeData.image = downloadURL;

    await addDoc(collection(db, 'allRecipes'), recipeData);
    console.log('Recipe saved successfully:', recipeData);

    setFormData({
      item: '',
      description: '',
      category: '',
      cuisine: '',
      prepTime: '',
      cookTime: '',
      ingredients: '',
      image: null,
    });
    setPhoto(null);
    Alert.alert('Recipe saved successfully');
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

  const toggleCameraModal = () => {
    setShowCameraModal(!showCameraModal);
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      setPhoto(photo);
      toggleCameraModal();
    }
    else{
        requestCameraPermission();
    }
  };

  if (!cameraPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
        We need your permission to show the camera
        </Text>
        <Button onPress={requestCameraPermission} title="Grant Camera Access" />
      </View>
    );
  }
  return (
    <ImageBackground
      source={require('../../../assets/Background_Frame.png')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.5 }}
    >
      <View style={styles.container}>
        {/* Page Header */}
        <Text style={styles.header}>Share Your Recipe</Text>

        {/* Wrap everything inside TouchableWithoutFeedback to hide keyboard */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView contentContainerStyle={styles.content}>
                {photo ? (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: photo.uri }} style={styles.preview} />
                        <TouchableOpacity
                            style={styles.takeAnotherButton}
                            onPress={() => setPhoto(null)}>
                        <MaterialIcons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    ) : (
                    <View style={styles.imageContainer}>
                        <Pressable style={styles.imageButton} onPress={toggleCameraModal}>
                            <MaterialIcons name="photo-camera" size={24} color="#38A169" />
                            <Text style={styles.imageText}>Capture a Photo</Text>
                        </Pressable>
                        
                        <Pressable style={styles.imageButton} onPress={pickImage}>
                            <MaterialIcons name="image" size={24} color="#38A169" />
                            <Text style={styles.imageText}>Upload an Image</Text>
                        </Pressable>
                    </View>
                )}
               <TextInput
                style={styles.input}
                placeholder="Item"
                value={formData.item}
                onChangeText={(text) => setFormData({ ...formData, item: text })}
              />
              <TextInput
                style={[styles.input, styles.description]}
                placeholder="Description..."
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
              <View style={styles.row}>
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Category"
                  value={formData.category}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                />
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Cuisine"
                  value={formData.cuisine}
                  onChangeText={(text) => setFormData({ ...formData, cuisine: text })}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Prep Time"
                  value={formData.prepTime}
                  onChangeText={(text) => setFormData({ ...formData, prepTime: text })}
                />
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Cook Time"
                  value={formData.cookTime}
                  onChangeText={(text) => setFormData({ ...formData, cookTime: text })}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ingredients Separated By Comma(,)"
                value={formData.ingredients}
                onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
              />

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        <Modal visible={showCameraModal} onRequestClose={toggleCameraModal}>
            <CameraView style={styles.camera} facing={cameraType} ref={cameraRef} 
            ratio='1:1' >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <Text style={styles.text}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </Modal>
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
    backgroundColor: 'black',
    
  },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38A169',
    textAlign: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',    
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    height: 100,
    width: 150,
  },
  imageText: {
    fontSize: 16,
    color: '#38A169',    
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100, // To avoid overlap with navigation bar
  },
  uploadImage: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  description: {
    height: 100,
    textAlignVertical: 'top', // Ensures placeholder text starts at the top
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputHalf: {
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#38A169',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },

  button: {
    backgroundColor: '#38A169',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  albumContainer: {
    margin: 10,
  },
  album: {
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetImage: {
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: 5,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  preview: {
    width: '100%',  
    height: 250,
    resizeMode: 'cover',
    borderRadius: 7,
    marginBottom: 10,
  },
  takeAnotherButton: {
    backgroundColor: 'red',
    height: 35, 
    width: 35,
    borderRadius: 17.5, 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 5, 
    right: 5,
    zIndex: 99, 
    elevation: 5, 
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textSecondary:{
    marginTop: 10,
  },

});

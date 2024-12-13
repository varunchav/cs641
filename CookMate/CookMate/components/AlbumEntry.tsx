import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
function AlbumEntry({ album }: any) {
  const [assets, setAssets] = useState<MediaLibrary.Asset[] | []>([]);

  useEffect(() => {
    async function fetchAssets() {
      const result = await MediaLibrary.getAssetsAsync({ album });
      setAssets(result.assets);
    }
    fetchAssets();
  }, [album]);

  return (
    <View style={styles.album}>
      <Text style={styles.albumTitle}>
        {album.title} ({album.assetCount} assets)
      </Text>
      <ScrollView horizontal>
        {assets.map((asset) => (
          <Image
            key={asset.id}
            source={{ uri: asset.uri }}
            style={styles.assetImage}
          />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
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
});

export default AlbumEntry;
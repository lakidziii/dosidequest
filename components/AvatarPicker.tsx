import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../stores/userStore';

interface AvatarPickerProps {
  currentAvatarUrl?: string | null;
  onAvatarChange: (url: string | null) => void;
  size?: number;
  disabled?: boolean;
}

export function AvatarPicker({ currentAvatarUrl, onAvatarChange, size = 80, disabled = false }: AvatarPickerProps) {
  const [uploading, setUploading] = useState(false);
  const { user } = useUserStore();

  const pickImage = async () => {
    try {
      // Požádat o oprávnění
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Oprávnění', 'Potřebujeme oprávnění k přístupu k vašim fotkám!');
        return;
      }

      // Vybrat obrázek
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Chyba', 'Nepodařilo se vybrat obrázek');
    }
  };

  const uploadAvatar = async (uri: string) => {
    if (!user?.id) return;

    try {
      setUploading(true);

      // Zmenšit obrázek pro optimalizaci
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Převést na ArrayBuffer pro React Native
      const response = await fetch(manipulatedImage.uri);
      const arrayBuffer = await response.arrayBuffer();

      // Vytvořit jedinečný název souboru
      const fileExt = 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload do Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Získat veřejnou URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Aktualizovat profil v databázi
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Aktualizovat lokální stav
      onAvatarChange(publicUrl);
      
      Alert.alert('Úspěch', 'Profilový obrázek byl aktualizován!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Chyba', 'Nepodařilo se nahrát obrázek');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {currentAvatarUrl ? (
        <Image 
          source={{ uri: currentAvatarUrl }} 
          style={[styles.avatar, { width: size, height: size }]} 
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Ionicons name="person" size={size * 0.5} color="#64748b" />
        </View>
      )}
      
      {/* Upload overlay - only show when not disabled */}
      {!disabled && (
        <TouchableOpacity 
          style={styles.overlay}
          onPress={pickImage}
          disabled={uploading}
        >
          <Ionicons 
            name={uploading ? "hourglass" : "camera"} 
            size={size * 0.25} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    borderRadius: 50,
  },
  placeholder: {
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from './supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Požádá o povolení k přístupu ke galerii
export const requestImagePermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

// Požádá o povolení k přístupu ke kameře
export const requestCameraPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

// Vybere obrázek z galerie
export const pickImageFromGallery = async (): Promise<ImagePicker.ImagePickerResult | null> => {
  const hasPermission = await requestImagePermissions();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Čtvercový poměr stran
    quality: 0.8,
  });

  return result;
};

// Vyfotí obrázek kamerou
export const takePhotoWithCamera = async (): Promise<ImagePicker.ImagePickerResult | null> => {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1], // Čtvercový poměr stran
    quality: 0.8,
  });

  return result;
};

// Změní velikost obrázku pro optimalizaci
export const resizeImage = async (uri: string, size: number = 300): Promise<string> => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: size, height: size } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  
  return manipulatedImage.uri;
};

// Nahraje obrázek do Supabase Storage
export const uploadImageToSupabase = async (
  uri: string, 
  userId: string, 
  fileName?: string
): Promise<ImageUploadResult> => {
  try {
    // Změníme velikost obrázku
    const resizedUri = await resizeImage(uri);
    
    // Převedeme na blob
    const response = await fetch(resizedUri);
    const blob = await response.blob();
    
    // Vytvoříme jedinečný název souboru
    const fileExt = 'jpg';
    const finalFileName = fileName || `avatar-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${finalFileName}`;
    
    // Nahrajeme do Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true, // Přepíše existující soubor
      });
    
    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
    
    // Získáme veřejnou URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    return { success: true, url: publicUrl };
    
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: 'Chyba při nahrávání obrázku' };
  }
};

// Aktualizuje avatar URL v profilu uživatele
export const updateUserAvatar = async (userId: string, avatarUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Profile update error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    return false;
  }
};

// Kompletní proces nahrání avataru
export const uploadAndSetAvatar = async (
  uri: string, 
  userId: string
): Promise<ImageUploadResult> => {
  // 1. Nahrajeme obrázek
  const uploadResult = await uploadImageToSupabase(uri, userId);
  
  if (!uploadResult.success || !uploadResult.url) {
    return uploadResult;
  }
  
  // 2. Aktualizujeme profil
  const updateSuccess = await updateUserAvatar(userId, uploadResult.url);
  
  if (!updateSuccess) {
    return { success: false, error: 'Chyba při aktualizaci profilu' };
  }
  
  return { success: true, url: uploadResult.url };
};
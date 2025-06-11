
// src/utils/sharing.js
import { storage } from '../services/firebase';
import { Linking, Alert } from 'react-native';
import Share from 'react-native-share';

export const uploadToFirebase = async (filePath, fileType) => {
  try {
    const filename = `greetings/${Date.now()}_${fileType}`;
    const reference = storage().ref(filename);
    await reference.putFile(filePath);
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw error;
  }
};

export const shareToWhatsApp = async (content, type) => {
  try {
    const shareOptions = {
      title: 'My Greeting',
      message: type === 'text' ? content : 'Check out my greeting!',
      url: type === 'video' ? content : undefined,
      social: Share.Social.WHATSAPP,
    };
    
    await Share.shareSingle(shareOptions);
  } catch (error) {
    // Fallback to opening WhatsApp directly
    const whatsappURL = `whatsapp://send?text=${encodeURIComponent(
      type === 'text' ? content : `Check out my greeting! ${content}`
    )}`;
    
    const canOpen = await Linking.canOpenURL(whatsappURL);
    if (canOpen) {
      await Linking.openURL(whatsappURL);
    } else {
      Alert.alert('Error', 'WhatsApp is not installed on this device');
    }
  }
};

export const shareToInstagram = async (content, type) => {
  try {
    if (type === 'video') {
      const shareOptions = {
        title: 'My Greeting',
        url: content,
        social: Share.Social.INSTAGRAM,
      };
      await Share.shareSingle(shareOptions);
    } else {
      // For text, we'll use the general share
      Alert.alert(
        'Instagram Sharing',
        'Text greetings work best when shared as images. Consider creating a video greeting for Instagram.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
    }
  } catch (error) {
    Alert.alert('Error', 'Could not share to Instagram');
  }
};

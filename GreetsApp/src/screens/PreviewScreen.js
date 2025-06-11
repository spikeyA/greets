// src/screens/PreviewScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  Share 
} from 'react-native';
import Video from 'react-native-video';
import { uploadToFirebase, shareToWhatsApp, shareToInstagram } from '../utils/sharing';

const PreviewScreen = ({ route, navigation }) => {
  const { videoPath, textContent, type, language } = route.params;

  const handleShare = async (platform) => {
    try {
      if (type === 'video') {
        // Upload video to Firebase first
        const downloadURL = await uploadToFirebase(videoPath, 'video');
        
        if (platform === 'whatsapp') {
          await shareToWhatsApp(downloadURL, 'video');
        } else if (platform === 'instagram') {
          await shareToInstagram(downloadURL, 'video');
        }
      } else if (type === 'text') {
        if (platform === 'whatsapp') {
          await shareToWhatsApp(textContent, 'text');
        } else if (platform === 'instagram') {
          // For Instagram, we might want to create an image with the text
          Alert.alert('Note', 'Text greetings work best on WhatsApp. Consider creating a video for Instagram.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share greeting');
    }
  };

  const handleGeneralShare = () => {
    const shareContent = type === 'text' ? textContent : `Check out my greeting! ${videoPath}`;
    Share.share({
      message: shareContent,
      title: 'My Greeting',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.previewContainer}>
        {type === 'video' ? (
          <Video
            source={{ uri: videoPath }}
            style={styles.video}
            controls={true}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.textPreview}>
            <Text style={styles.previewText}>{textContent}</Text>
          </View>
        )}
      </View>

      <View style={styles.shareContainer}>
        <Text style={styles.shareTitle}>Share your greeting:</Text>
        
        <TouchableOpacity
          style={[styles.shareButton, styles.whatsappButton]}
          onPress={() => handleShare('whatsapp')}
        >
          <Text style={styles.shareButtonText}>Share to WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, styles.instagramButton]}
          onPress={() => handleShare('instagram')}
        >
          <Text style={styles.shareButtonText}>Share to Instagram</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, styles.generalButton]}
          onPress={handleGeneralShare}
        >
          <Text style={styles.shareButtonText}>Share via Other Apps</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>Create Another</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  previewContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  textPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  previewText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    lineHeight: 32,
  },
  shareContainer: {
    padding: 20,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  shareButton: {
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  instagramButton: {
    backgroundColor: '#E4405F',
  },
  generalButton: {
    backgroundColor: '#007AFF',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#6C757D',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreviewScreen;

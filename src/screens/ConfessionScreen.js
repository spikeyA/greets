import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getAIResponse } from '../services/openai';
import { storeConfession } from '../services/firebase';
import Geolocation from 'react-native-geolocation-service';

const ConfessionScreen = ({ navigation }) => {
  const [confession, setConfession] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [wantAdvice, setWantAdvice] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (isPublic) {
      requestLocationPermission();
    }
  }, [isPublic]);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          getLocation();
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!confession.trim()) return;

    setIsLoading(true);
    try {
      // Get AI response
      const response = await getAIResponse(confession, wantAdvice);
      setAiResponse(response);

      // Store confession
      await storeConfession({
        content: confession,
        isPublic,
        location: isPublic ? location : null,
        aiResponse: response,
        wantedAdvice: wantAdvice,
      });

      // Clear form if successful
      if (!isPublic) {
        setTimeout(() => {
          setConfession('');
          setAiResponse('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Share Your Thoughts</Text>
          
          <TextInput
            style={styles.input}
            value={confession}
            onChangeText={setConfession}
            placeholder="What's on your mind?"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <View style={styles.toggleContainer}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Make Public</Text>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isPublic ? '#1e88e5' : '#f4f3f4'}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Want Advice?</Text>
              <Switch
                value={wantAdvice}
                onValueChange={setWantAdvice}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={wantAdvice ? '#1e88e5' : '#f4f3f4'}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, !confession.trim() && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!confession.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Share</Text>
            )}
          </TouchableOpacity>

          {aiResponse && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>AI Response:</Text>
              <Text style={styles.responseText}>{aiResponse}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleContainer: {
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  responseTitle: {
    color: '#81b0ff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  responseText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ConfessionScreen; 
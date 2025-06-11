
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  TextInput 
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import i18n from '../utils/locales';

const RecordScreen = ({ navigation, route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState('video'); // 'video' or 'text'
  const [textGreeting, setTextGreeting] = useState('');
  const cameraRef = useRef(null);
  const { language } = route.params;

  const startRecording = async () => {
    if (cameraRef.current && recordingType === 'video') {
      setIsRecording(true);
      try {
        const options = {
          quality: RNCamera.Constants.VideoQuality['720p'],
          maxDuration: 30,
        };
        const data = await cameraRef.current.recordAsync(options);
        setIsRecording(false);
        navigation.navigate('Preview', { 
          videoPath: data.uri, 
          type: 'video',
          language 
        });
      } catch (error) {
        setIsRecording(false);
        Alert.alert('Error', 'Failed to record video');
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const createTextGreeting = () => {
    if (textGreeting.trim()) {
      navigation.navigate('Preview', { 
        textContent: textGreeting, 
        type: 'text',
        language 
      });
    } else {
      Alert.alert('Error', 'Please enter a greeting message');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, recordingType === 'video' && styles.activeToggle]}
          onPress={() => setRecordingType('video')}
        >
          <Text style={styles.toggleText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, recordingType === 'text' && styles.activeToggle]}
          onPress={() => setRecordingType('text')}
        >
          <Text style={styles.toggleText}>Text</Text>
        </TouchableOpacity>
      </View>

      {recordingType === 'video' ? (
        <View style={styles.cameraContainer}>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.off}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
          <View style={styles.recordingControls}>
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.recordButtonText}>
                {isRecording ? 'Stop' : 'Record'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>Create your greeting message:</Text>
          <TextInput
            style={styles.textInput}
            value={textGreeting}
            onChangeText={setTextGreeting}
            placeholder={`Enter your greeting in ${language === 'hi' ? 'Hindi' : language === 'es' ? 'Spanish' : 'English'}`}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={createTextGreeting}
          >
            <Text style={styles.createButtonText}>Create Greeting</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  recordingControls: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    backgroundColor: '#FF9500',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  textLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RecordScreen;
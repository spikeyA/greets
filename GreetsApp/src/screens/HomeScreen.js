// src/screens/HomeScreen.js (Updated)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import i18n from '../utils/locales';
import LanguageSelector from '../components/LanguageSelector';

const HomeScreen = ({ navigation }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    i18n.locale = language;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{i18n.t('welcome')}</Text>
        
        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        <TouchableOpacity 
          style={styles.recordButton}
          onPress={() => navigation.navigate('Record', { language: currentLanguage })}
        >
          <Text style={styles.buttonText}>{i18n.t('record')}</Text>
        </TouchableOpacity>
        
        <Text style={styles.subtitle}>{i18n.t('share')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
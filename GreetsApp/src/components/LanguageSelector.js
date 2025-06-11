// src/components/LanguageSelector.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.languageRow}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              currentLanguage === lang.code && styles.selectedLanguage
            ]}
            onPress={() => onLanguageChange(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={[
              styles.languageName,
              currentLanguage === lang.code && styles.selectedText
            ]}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 80,
  },
  selectedLanguage: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  flag: {
    fontSize: 24,
    marginBottom: 5,
  },
  languageName: {
    fontSize: 12,
    color: '#666',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LanguageSelector;
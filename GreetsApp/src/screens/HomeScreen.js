import React from 'react';
import { View, Text, Button } from 'react-native';
import i18n from '../utils/locales';

const HomeScreen = ({ navigation }) => (
  <View>
    <Text>{i18n.t('welcome')}</Text>
    <Button
      title={i18n.t('record')}
      onPress={() => navigation.navigate('Record')}
    />
  </View>
);

export default HomeScreen;
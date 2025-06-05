import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ShotTimeButton } from '../components/ShotTimeButton';
import { ShotTimeContainer } from '../components/ShotTimeContainer';
import { COLORS, FONTS } from '../theme';

export const HomeScreen: React.FC = () => {
  return (
    <ShotTimeContainer>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>ShotTime</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ShotTimeButton title="Créer une partie" onPress={() => {}} />
        <ShotTimeButton title="Rejoindre une partie" onPress={() => {}} style={{ backgroundColor: COLORS.pink }} />
      </View>
    </ShotTimeContainer>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 150,
    height: 150,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.title,
    fontSize: 36,
    letterSpacing: 2,
    textShadowColor: COLORS.pink,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
}); 
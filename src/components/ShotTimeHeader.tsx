import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ShotTimeBackButton } from './ShotTimeBackButton';
import { COLORS, FONTS } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ShotTimeHeaderProps {
  title: string;
  showBack?: boolean;
}

export const ShotTimeHeader: React.FC<ShotTimeHeaderProps> = ({ title, showBack = true }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerRow}>
        {showBack ? <ShotTimeBackButton style={styles.backBtn} /> : <View style={styles.backBtn} />}
        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.violet,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 8,
  },
  backBtn: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.title,
    fontSize: 24,
    letterSpacing: 1,
    textShadowColor: COLORS.pink,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
}); 
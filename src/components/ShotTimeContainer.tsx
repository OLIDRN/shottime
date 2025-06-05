import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme';

interface ShotTimeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ShotTimeContainer: React.FC<ShotTimeContainerProps> = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.violet,
    paddingHorizontal: 24,
  },
}); 
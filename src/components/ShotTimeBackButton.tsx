import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme';

export const ShotTimeBackButton: React.FC<{ style?: any }> = ({ style }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      hitSlop={16}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="chevron-back" size={28} color={COLORS.white} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    elevation: 6,
    alignSelf: 'flex-start',
    margin: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
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
    backgroundColor: COLORS.violet,
    borderRadius: 24,
    padding: 8,
    shadowColor: COLORS.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
    alignSelf: 'flex-start',
    margin: 8,
  },
  pressed: {
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 12,
    backgroundColor: COLORS.pink,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { COLORS, FONTS } from '../theme';

interface ShotTimeButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const ShotTimeButton: React.FC<ShotTimeButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [
        { opacity: disabled ? 0.6 : 1 },
      ]}
    >
      <Animated.View
        style={[ 
          styles.button, 
          style, 
          { transform: [{ scale }] },
          pressedGlowStyle,
        ]}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const pressedGlowStyle = {
  shadowColor: COLORS.pink,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.7,
  shadowRadius: 24,
  elevation: 12,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.orange,
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: COLORS.pink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 8,
  },
  text: {
    color: COLORS.white,
    fontFamily: FONTS.title,
    fontSize: 20,
    letterSpacing: 1,
  },
}); 
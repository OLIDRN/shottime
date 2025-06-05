import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';
import type { Card } from '../utils/deckUtils';

export type PlayingCardProps = {
  card: Card;
  size?: 'small' | 'medium' | 'large';
  style?: any;
};

const SIZE_MAP = {
  small: { w: 38, h: 54, font: 16, symbol: 14 },
  medium: { w: 56, h: 80, font: 22, symbol: 20 },
  large: { w: 80, h: 120, font: 32, symbol: 28 },
};

export const PlayingCard: React.FC<PlayingCardProps> = ({ card, size = 'medium', style }) => {
  const { w, h, font, symbol } = SIZE_MAP[size];
  const isRed = card.suit === '♥️' || card.suit === '♦️';
  const borderColor = isRed ? COLORS.red : COLORS.black;
  const valueColor = isRed ? COLORS.red : COLORS.black;

  return (
    <View style={[styles.card, {
      width: w, height: h, borderColor,
      shadowColor: borderColor,
    }, style]}
    >
      <Text style={[styles.value, { color: valueColor, fontSize: font, left: 6, top: 2 }]}>{card.value}</Text>
      <View style={styles.centerSymbol}>
        <Text style={{ fontSize: symbol, color: valueColor }}>{card.suit}</Text>
      </View>
      <Text style={[styles.value, {
        color: valueColor, fontSize: font, right: 6, bottom: 2, position: 'absolute',}]}>
            {card.value}
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2.5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    margin: 4,
    overflow: 'hidden',
  },
  value: {
    fontFamily: FONTS.title,
    position: 'absolute',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  centerSymbol: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '35%',
  },
}); 
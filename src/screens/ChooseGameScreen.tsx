import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShotTimeHeader } from '../components/ShotTimeHeader';
import { COLORS, FONTS } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../supabase/client';

const GAMES = [
  { key: '97', label: '97' },
  { key: 'jeu_roi', label: 'Jeu du Roi' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseGame'>;

export const ChooseGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const handleChooseGame = async (gameKey: string) => {
    const { code, pseudo } = route.params;
    await supabase.from('parties').update({ selected_game: gameKey }).eq('code', code);
    if (gameKey === '97') {
      navigation.replace('Game97', { code, pseudo });
    } else if (gameKey === 'jeu_roi') {
      navigation.replace('JeuRoi', { code, pseudo });
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.violet, COLORS.violet, COLORS.pink]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ShotTimeHeader title="Choisis ton jeu" showBack={true} />
      <View style={styles.content}>
        <Text style={styles.title}>Quel jeu veux-tu lancer ?</Text>
        <FlatList
          data={GAMES}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.gameCard} activeOpacity={0.85} onPress={() => handleChooseGame(item.key)}>
              <Text style={styles.gameLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.key}
          contentContainerStyle={{ paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  title: {
    color: COLORS.cyan,
    fontFamily: FONTS.title,
    fontSize: 30,
    marginTop: 32,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: COLORS.pink,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  gameCard: {
    backgroundColor: COLORS.violet,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginVertical: 14,
    alignItems: 'center',
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    opacity: 0.96,
  },
  gameLabel: {
    color: COLORS.white,
    fontFamily: FONTS.title,
    fontSize: 26,
    letterSpacing: 2,
    textShadowColor: COLORS.violet,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
}); 
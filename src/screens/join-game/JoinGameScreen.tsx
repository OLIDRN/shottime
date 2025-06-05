import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { ShotTimeContainer } from '../../components/ShotTimeContainer';
import { ShotTimeHeader } from '../../components/ShotTimeHeader';
import { ShotTimeButton } from '../../components/ShotTimeButton';
import { COLORS, FONTS } from '../../theme';
import { usePartyStore } from '../../store/partyStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

export const JoinGameScreen: React.FC = () => {
  const [pseudo, setPseudo] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const joinParty = usePartyStore((s) => s.joinParty);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleJoin = () => {
    setError(null);
    const result = joinParty(code, pseudo);
    if (!result.success) {
      setError(result.error || 'Erreur inconnue');
    } else {
      navigation.replace('Lobby', { code, pseudo });
    }
  };

  return (
    <ShotTimeContainer>
      <ShotTimeHeader title="Rejoindre" />
      <View style={styles.content}>
        <Text style={styles.label}>Entre ton pseudo :</Text>
        <TextInput
          style={styles.input}
          placeholder="Ton pseudo..."
          placeholderTextColor={COLORS.white + '99'}
          value={pseudo}
          onChangeText={setPseudo}
          maxLength={16}
          autoCapitalize="words"
        />
        <Text style={styles.label}>Code de session :</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: K7X9"
          placeholderTextColor={COLORS.white + '99'}
          value={code}
          onChangeText={setCode}
          maxLength={5}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <ShotTimeButton
          title="Rejoindre la partie"
          onPress={handleJoin}
          disabled={pseudo.trim().length < 2 || code.trim().length < 3}
        />
      </View>
    </ShotTimeContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.text,
    fontSize: 20,
    marginBottom: 12,
    letterSpacing: 1,
  },
  input: {
    width: 220,
    backgroundColor: COLORS.violet,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.pink,
    color: COLORS.white,
    fontFamily: FONTS.text,
    fontSize: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    textAlign: 'center',
    shadowColor: COLORS.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  error: {
    color: COLORS.pink,
    fontFamily: FONTS.text,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
}); 
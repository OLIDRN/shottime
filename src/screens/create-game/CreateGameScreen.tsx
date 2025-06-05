import React from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { ShotTimeContainer } from '../../components/ShotTimeContainer';
import { ShotTimeHeader } from '../../components/ShotTimeHeader';
import { ShotTimeButton } from '../../components/ShotTimeButton';
import { COLORS, FONTS } from '../../theme';
import { generateCode } from '../../utils/generateCode';
import { usePartyStore } from '../../store/partyStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const { height } = Dimensions.get('window');

export const CreateGameScreen: React.FC = () => {
  const [pseudo, setPseudo] = React.useState('');
  const [code, setCode] = React.useState<string | null>(null);
  const createParty = usePartyStore((s) => s.createParty);
  const getParty = usePartyStore((s) => s.getParty);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGenerate = () => {
    const newCode = generateCode();
    setCode(newCode);
    createParty(newCode, pseudo);
    navigation.replace('Lobby', { code: newCode, pseudo });
  };

  const players = code ? getParty(code)?.players ?? [] : [];

  return (
    <ShotTimeContainer>
      <ShotTimeHeader title="Créer" />
      <View style={styles.flexContent}>
        {!code ? (
          <View style={styles.topBlock}>
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
            <ShotTimeButton
              title="Générer un code"
              onPress={handleGenerate}
              disabled={pseudo.trim().length < 2}
            />
          </View>
        ) : (
          <>
            <View style={styles.codeBlock}>
              <Text style={styles.label}>Code de session :</Text>
              <Text style={styles.code}>{code}</Text>
            </View>
            <View style={styles.playersCard}>
              <Text style={styles.label}>Joueurs dans la partie :</Text>
              <View style={styles.playersList}>
                {players.map((p, i) => (
                  <Text key={i} style={styles.player}>
                    {p} {i === 0 && <Text style={{ color: COLORS.cyan }}>👑</Text>}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    </ShotTimeContainer>
  );
};

const styles = StyleSheet.create({
  flexContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  topBlock: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  codeBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.08,
    marginBottom: 16,
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
  code: {
    color: COLORS.cyan,
    fontFamily: FONTS.title,
    fontSize: 48,
    letterSpacing: 8,
    textShadowColor: COLORS.pink,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    marginBottom: 8,
  },
  playersCard: {
    backgroundColor: COLORS.violet,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: COLORS.pink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  playersList: {
    marginTop: 8,
    alignItems: 'center',
  },
  player: {
    color: COLORS.white,
    fontFamily: FONTS.text,
    fontSize: 20,
    marginVertical: 2,
  },
}); 
import React from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { ShotTimeContainer } from '../../components/ShotTimeContainer';
import { ShotTimeHeader } from '../../components/ShotTimeHeader';
import { ShotTimeButton } from '../../components/ShotTimeButton';
import { COLORS, FONTS } from '../../theme';
import { supabase } from '../../supabase/client';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

export const JoinGameScreen: React.FC = () => {
  const [pseudo, setPseudo] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleJoin = async () => {
    setError(null);
    setLoading(true);
    const { data: parties, error: partyError } = await supabase
      .from('parties')
      .select('code')
      .eq('code', code);
    if (partyError || !parties || parties.length === 0) {
      setError('Code de session invalide.');
      setLoading(false);
      return;
    }
    const { data: joueurs, error: joueursError } = await supabase
      .from('joueurs')
      .select('pseudo')
      .eq('party_code', code)
      .eq('pseudo', pseudo);
    if (joueursError) {
      setError('Erreur lors de la vérification du pseudo.');
      setLoading(false);
      return;
    }
    if (joueurs && joueurs.length > 0) {
      setError('Pseudo déjà pris dans cette partie.');
      setLoading(false);
      return;
    }
    // 3. Ajouter le joueur
    const { error: insertError } = await supabase
      .from('joueurs')
      .insert([{ pseudo, party_code: code, is_host: false }]);
    setLoading(false);
    if (insertError) {
      setError('Erreur lors de la connexion à la partie.');
      return;
    }
    navigation.replace('Lobby', { code, pseudo });
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
          title={loading ? 'Connexion...' : 'Rejoindre la partie'}
          onPress={handleJoin}
          disabled={pseudo.trim().length < 2 || code.trim().length < 3 || loading}
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
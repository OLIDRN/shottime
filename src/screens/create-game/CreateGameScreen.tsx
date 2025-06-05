import React from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Alert } from 'react-native';
import { ShotTimeContainer } from '../../components/ShotTimeContainer';
import { ShotTimeHeader } from '../../components/ShotTimeHeader';
import { ShotTimeButton } from '../../components/ShotTimeButton';
import { COLORS, FONTS } from '../../theme';
import { generateCode } from '../../utils/generateCode';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { supabase } from '../../supabase/client';

const { height } = Dimensions.get('window');

export const CreateGameScreen: React.FC = () => {
  const [pseudo, setPseudo] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGenerate = async () => {
    setLoading(true);
    const code = generateCode();
    const { error: partyError } = await supabase
      .from('parties')
      .insert([{ code }]);
    if (partyError) {
      setLoading(false);
      Alert.alert('Erreur', partyError.message);
      return;
    }
    const { error: playerError } = await supabase
      .from('joueurs')
      .insert([{ pseudo, party_code: code, is_host: true }]);
    setLoading(false);
    if (playerError) {
      Alert.alert('Erreur', playerError.message);
      return;
    }
    navigation.replace('Lobby', { code, pseudo });
  };

  return (
    <ShotTimeContainer>
      <ShotTimeHeader title="Créer" />
      <View style={styles.flexContent}>
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
            title={loading ? 'Création...' : 'Générer un code'}
            onPress={handleGenerate}
            disabled={pseudo.trim().length < 2 || loading}
          />
        </View>
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
}); 
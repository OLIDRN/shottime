import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { ShotTimeContainer } from '../../components/ShotTimeContainer';
import { ShotTimeHeader } from '../../components/ShotTimeHeader';
import { ShotTimeButton } from '../../components/ShotTimeButton';
import { COLORS, FONTS } from '../../theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabase/client';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const { height } = Dimensions.get('window');

type LobbyRouteParams = { code: string; pseudo: string };

type Joueur = {
  id: string;
  pseudo: string;
  party_code: string;
  is_host: boolean;
};

export const LobbyScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { code, pseudo } = (route.params || {}) as LobbyRouteParams;
  const [players, setPlayers] = React.useState<Joueur[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [partyExists, setPartyExists] = React.useState(true);

  const fetchPlayers = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('joueurs')
      .select('*')
      .eq('party_code', code)
      .order('joined_at', { ascending: true });
    console.log('[fetchPlayers] data:', data, 'error:', error);
    setPlayers(data || []);
    setLoading(false);
  }, [code]);

  const checkParty = React.useCallback(async () => {
    const { data } = await supabase
      .from('parties')
      .select('code')
      .eq('code', code);
    setPartyExists(!!(data && data.length > 0));
  }, [code]);

  React.useEffect(() => {
    let isMounted = true;
    fetchPlayers();
    checkParty();
    const channelJoueurs = supabase
      .channel('joueurs-lobby-' + code)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'joueurs', filter: `party_code=eq.${code}` },
        (payload) => {
          console.log('[Realtime callback] payload:', payload);
          if (isMounted) fetchPlayers();
        }
      )
      .subscribe();
    const channelParties = supabase
      .channel('parties-lobby-' + code)
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'parties', filter: `code=eq.${code}` },
        (payload) => {
          if (isMounted) {
            setPartyExists(false);
          }
        }
      )
      .subscribe();
    return () => {
      isMounted = false;
      channelJoueurs.unsubscribe();
      channelParties.unsubscribe();
    };
  }, [code, fetchPlayers, checkParty]);

  React.useEffect(() => {
    if (!partyExists) {
      Alert.alert('Partie terminée', "L'hôte a quitté la partie.", [
        { text: 'OK', onPress: () => navigation.replace('Home') }
      ]);
    }
  }, [partyExists, navigation]);

  const isHost = players[0]?.pseudo === pseudo;

  const handleQuitHost = async () => {
    Alert.alert('Quitter la partie', 'Es-tu sûr de vouloir quitter et supprimer la partie pour tout le monde ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Oui', style: 'destructive', onPress: async () => {
          await supabase.from('parties').delete().eq('code', code);
        }
      }
    ]);
  };

  const canStart = players.length >= 2;

  return (
    <ShotTimeContainer>
      <ShotTimeHeader title="Lobby" showBack={false} />
      <View style={styles.content}>
        <View style={styles.codeBlock}>
          <Text style={styles.label}>Code de session :</Text>
          <Text style={styles.code}>{code}</Text>
        </View>
        <View style={styles.playersCard}>
          <Text style={styles.label}>Joueurs connectés :</Text>
          {loading ? (
            <ActivityIndicator color={COLORS.cyan} size="large" style={{ marginTop: 16 }} />
          ) : (
            <View style={styles.playersList}>
              {players.map((p, i) => (
                <Text key={p.id} style={styles.player}>
                  {p.pseudo} {p.is_host && <Text style={{ color: COLORS.cyan }}>👑</Text>}
                  {p.pseudo === pseudo && <Text style={{ color: COLORS.orange }}> (Toi)</Text>}
                </Text>
              ))}
            </View>
          )}
        </View>
        {isHost ? (
          <View style={styles.buttonRow}>
            <ShotTimeButton
              title="Lancer"
              onPress={() => {
                if (canStart) navigation.navigate('ChooseGame', { code, pseudo });
              }}
              style={{ flex: 1, marginRight: 8 }}
              disabled={!canStart}
            />
            <ShotTimeButton title="Quitter" onPress={handleQuitHost} style={{ backgroundColor: COLORS.pink, flex: 1, marginLeft: 8 }} />
          </View>
        ): null}
      </View>
    </ShotTimeContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  codeBlock: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.text,
    fontSize: 20,
    marginBottom: 8,
    letterSpacing: 1,
  },
  code: {
    color: COLORS.cyan,
    fontFamily: FONTS.title,
    fontSize: 40,
    letterSpacing: 8,
    textShadowColor: COLORS.pink,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    marginBottom: 0,
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
    minWidth: 260,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
}); 
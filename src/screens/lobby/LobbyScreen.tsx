import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ShotTimeContainer } from '../../components/ShotTimeContainer';
import { ShotTimeHeader } from '../../components/ShotTimeHeader';
import { ShotTimeButton } from '../../components/ShotTimeButton';
import { COLORS, FONTS } from '../../theme';
import { usePartyStore } from '../../store/partyStore';
import { useRoute } from '@react-navigation/native';

const { height } = Dimensions.get('window');

type LobbyRouteParams = { code: string; pseudo: string };

export const LobbyScreen: React.FC = () => {
  const route = useRoute();
  const { code, pseudo } = (route.params || {}) as LobbyRouteParams;
  const party = usePartyStore((s) => s.getParty(code));
  const isHost = party?.players[0] === pseudo;

  return (
    <ShotTimeContainer>
      <ShotTimeHeader title="Lobby" showBack={false} />
      <View style={styles.content}>
        <Text style={styles.label}>Code de session :</Text>
        <Text style={styles.code}>{code}</Text>
        <View style={styles.playersCard}>
          <Text style={styles.label}>Joueurs connectés :</Text>
          <View style={styles.playersList}>
            {party?.players.map((p, i) => (
              <Text key={i} style={styles.player}>
                {p} {i === 0 && <Text style={{ color: COLORS.cyan }}>👑</Text>}
                {p === pseudo && <Text style={{ color: COLORS.orange }}> (Toi)</Text>}
              </Text>
            ))}
          </View>
        </View>
        {isHost && (
          <ShotTimeButton title="Lancer la partie" onPress={() => {}} />
        )}
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
  label: {
    color: COLORS.white,
    fontFamily: FONTS.text,
    fontSize: 20,
    marginBottom: 12,
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
    marginBottom: 16,
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
}); 
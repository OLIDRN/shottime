import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, Pressable, Alert } from 'react-native';
import { ShotTimeHeader } from '../components/ShotTimeHeader';
import { COLORS, FONTS } from '../theme';
import { generateDeck, shuffle, Card } from '../utils/deckUtils';
import { PlayingCard } from '../components/PlayingCard';
import { supabase } from '../supabase/client';

const FAKE_PLAYERS = ['Alice', 'Bob', 'Charlie'];

export const Game97Screen = ({ route }: { route: any }) => {
  const { code, pseudo } = route.params;
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<any>(undefined);
  const isHost = useRef(false);
  const [specialModal, setSpecialModal] = useState<{ type: 'J' | 'Q', card: Card, index: number } | null>(null);
  const [pendingCard, setPendingCard] = useState<{ card: Card, index: number } | null>(null);

  const initGameState = async (players: string[]) => {
    let deck = shuffle(generateDeck());
    const hands: { [pseudo: string]: Card[] } = {};
    for (const p of players) {
      hands[p] = deck.slice(0, 4);
      deck = deck.slice(4);
    }
    const state = {
      players,
      deck,
      hands,
      pile: [],
      total: 0,
      currentPlayerIdx: 0,
      direction: 1,
    };
    await supabase.from('parties').update({ game_state: state }).eq('code', code);
  };

  const fetchGameState = async () => {
    if (!gameState) setLoading(true);
    const { data, error } = await supabase.from('parties').select('game_state, joueurs (pseudo)').eq('code', code).single();
    if (data && data.game_state) {
      setGameState(data.game_state);
      setLoading(false);
    } else if (data && data.joueurs) {
        const pseudos = data.joueurs.map((j: any) => j.pseudo);
      if (pseudos[0] === pseudo) {
        isHost.current = true;
        await initGameState(pseudos);
      }
    }
  };

  useEffect(() => {
    fetchGameState();
    const channel = supabase
      .channel('partie-97-' + code)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'parties', filter: `code=eq.${code}` },
        (payload) => {
          if (payload.new && payload.new.game_state) {
            setGameState(payload.new.game_state);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [code, pseudo]);

  if (typeof gameState === 'undefined') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.violet }}>
        <ActivityIndicator size="large" color={COLORS.cyan} />
      </View>
    );
  }

  const { players, deck, hands, pile, total, currentPlayerIdx, direction } = gameState;
  const currentPlayer = players[currentPlayerIdx];
  const myHand = hands[pseudo] || [];

  const canPlayAnyCard = () => {
    if (!myHand.length) return false;
    for (const card of myHand) {
      if (card.value === 'K') return true;
      if (card.value === 'J') {
        if (total + 10 <= 97 || total - 10 <= 97) return true;
      } else if (card.value === 'Q') {
        for (let d = 10; d <= 90; d += 10) {
          if (d <= 97) return true;
        }
      } else {
        let cardValue = card.value === 'A' ? 1 : Number(card.value);
        if (total + cardValue <= 97) return true;
      }
    }
    return false;
  };

  const canPlayCard = currentPlayer === pseudo && myHand.length === 4;

  function checkDizaineAlert(newTotal: number) {
    if (newTotal >= 10 && newTotal <= 90 && newTotal % 10 === 0) {
      const gorgées = newTotal / 10;
      Alert.alert('Distribution !', `Tu distribues ${gorgées} gorgée${gorgées > 1 ? 's' : ''} !`);
    }
  }

  const playCard = async (card: Card, index: number) => {
    if (currentPlayer !== pseudo) return;
    if (myHand.length === 0) return;
    let cardValue = 0;
    if (card.value === 'A') cardValue = 1;
    else if (!isNaN(Number(card.value))) cardValue = Number(card.value);
    if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
    } else {
      if (total + cardValue > 97) {
        Alert.alert('Perdu !', 'Tu ne peux pas jouer cette carte, tu dépasses 97. Tu subis la rivière !');
        return;
      }
    }
    if (card.value === 'J') {
      setSpecialModal({ type: 'J', card, index });
      return;
    }
    if (card.value === 'Q') {
      setSpecialModal({ type: 'Q', card, index });
      return;
    }
    if (card.value === 'K') {
      const newPile = [...pile, card];
      const newHands = { ...hands };
      const handCopy = [...(newHands[currentPlayer] || [])];
      handCopy.splice(index, 1);
      newHands[currentPlayer] = handCopy;
      const newTotal = total + cardValue;
      checkDizaineAlert(newTotal);
      const newState = {
        players,
        deck,
        hands: newHands,
        pile: newPile,
        total: newTotal,
        currentPlayerIdx,
        direction: -direction,
      };
      await supabase.from('parties').update({ game_state: newState }).eq('code', code);
      return;
    }
    const newTotal = total + cardValue;
    checkDizaineAlert(newTotal);
    const newPile = [...pile, card];
    const newHands = { ...hands };
    const handCopy = [...(newHands[currentPlayer] || [])];
    handCopy.splice(index, 1);
    newHands[currentPlayer] = handCopy;
    const newState = {
      players,
      deck,
      hands: newHands,
      pile: newPile,
      total: newTotal,
      currentPlayerIdx,
      direction,
    };
    await supabase.from('parties').update({ game_state: newState }).eq('code', code);
  };

  const handleJackChoice = async (plus10: boolean) => {
    if (!specialModal) return;
    const { card, index } = specialModal;
    let cardValue = plus10 ? 10 : -10;
    if (total + cardValue > 97) {
      Alert.alert('Perdu !', 'Tu ne peux pas jouer ce Valet, tu dépasses 97. Tu subis la rivière !');
      setSpecialModal(null);
      return;
    }
    const newTotal = total + cardValue;
    checkDizaineAlert(newTotal);
    const newPile = [...pile, card];
    const newHands = { ...hands };
    const handCopy = [...(newHands[currentPlayer] || [])];
    handCopy.splice(index, 1);
    newHands[currentPlayer] = handCopy;
    const newState = {
      players,
      deck,
      hands: newHands,
      pile: newPile,
      total: newTotal,
      currentPlayerIdx,
      direction,
    };
    setSpecialModal(null);
    await supabase.from('parties').update({ game_state: newState }).eq('code', code);
  };

  const handleQueenChoice = async (dizaine: number) => {
    if (!specialModal) return;
    const { card, index } = specialModal;
    if (dizaine > 97) {
      Alert.alert('Perdu !', 'Tu ne peux pas choisir cette dizaine, tu dépasses 97. Tu subis la rivière !');
      setSpecialModal(null);
      return;
    }
    const newTotal = dizaine;
    checkDizaineAlert(newTotal);
    const newPile = [...pile, card];
    const newHands = { ...hands };
    const handCopy = [...(newHands[currentPlayer] || [])];
    handCopy.splice(index, 1);
    newHands[currentPlayer] = handCopy;
    const newState = {
      players,
      deck,
      hands: newHands,
      pile: newPile,
      total: newTotal,
      currentPlayerIdx,
      direction,
    };
    setSpecialModal(null);
    await supabase.from('parties').update({ game_state: newState }).eq('code', code);
  };

  function canDrawCard() {
    if (myHand.length >= 4) return false;
    if (deck.length > 0) return true;
    if (deck.length === 0 && pile.length > 1) return true;
    return false;
  }

  const drawCard = async () => {
    if (currentPlayer !== pseudo) return;
    if (!gameState) return;
    let { hands, deck, players, pile, total, currentPlayerIdx, direction } = gameState;
    const myHand = hands[pseudo] || [];
    if (deck.length === 0 && pile.length > 1) {
      deck = shuffle(pile.slice(0, -1));
      pile = [pile[pile.length - 1]];
      Alert.alert('Nouvelle pioche !', "Le tas central a été remélangé pour former une nouvelle pioche.");
    }
    if (myHand.length >= 4 || (deck.length === 0 && pile.length === 1)) return;
    const newHands = { ...hands };
    const newDeck = [...deck];
    newHands[pseudo] = [...myHand, newDeck[0]];
    newDeck.shift();
    let nextIdx = currentPlayerIdx;
    if (newHands[pseudo].length === 4) {
      nextIdx = currentPlayerIdx + direction;
      if (nextIdx < 0) nextIdx = players.length - 1;
      if (nextIdx >= players.length) nextIdx = 0;
    }
    const newState = {
      players,
      deck: newDeck,
      hands: newHands,
      pile,
      total,
      currentPlayerIdx: nextIdx,
      direction,
    };
    await supabase.from('parties').update({ game_state: newState }).eq('code', code);
  };

  return (
    <View style={styles.container}>
      <ShotTimeHeader title="Jeu du 97" showBack={false} />
      <View style={styles.centerBlock}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.total}>{total}</Text>
        <Text style={styles.playerLabel}>À toi de jouer, {currentPlayer} !</Text>
        <View style={styles.boardRow}>
          <View style={styles.deckBlock}>
            <TouchableOpacity
              disabled={currentPlayer !== pseudo || !canDrawCard()}
              onPress={drawCard}
              activeOpacity={0.7}
            >
              <View style={styles.deckStack}>
                <View style={[styles.cardBack, { zIndex: 1, left: 4, top: 4 }]} />
                <View style={[styles.cardBack, { zIndex: 2, left: 2, top: 2 }]} />
                <View style={[styles.cardBack, { zIndex: 3, left: 0, top: 0 }]} />
              </View>
              <Text style={styles.deckCount}>{deck.length}</Text>
              <Text style={styles.deckLabel}>Pioche</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pileStack}>
            {pile.slice(-3).map((card, i, arr) => (
              <View key={i} style={{ position: 'absolute', left: i * 8, top: i * 4, zIndex: i }}>
                <PlayingCard card={card} size="large" />
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.handBlock}>
        <Text style={styles.handTitle}>Ta main :</Text>
        <FlatList
          data={myHand}
          horizontal
          renderItem={({ item, index }) => (
            <TouchableOpacity
              disabled={!canPlayCard}
              onPress={() => playCard(item, index)}>
              <PlayingCard card={item} size="large" />
            </TouchableOpacity>
          )}
          keyExtractor={(_, i) => 'hand-' + i}
        />
      </View>
      <Modal visible={!!specialModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: COLORS.violet, borderRadius: 20, padding: 28, alignItems: 'center', minWidth: 260 }}>
            {specialModal?.type === 'J' && (
              <>
                <Text style={{ color: COLORS.white, fontFamily: FONTS.title, fontSize: 22, marginBottom: 16 }}>Valet : +10 ou -10 ?</Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Pressable onPress={() => handleJackChoice(true)} style={{ backgroundColor: COLORS.cyan, borderRadius: 12, padding: 16, margin: 8 }}>
                    <Text style={{ color: COLORS.violet, fontFamily: FONTS.title, fontSize: 20 }}>+10</Text>
                  </Pressable>
                  <Pressable onPress={() => handleJackChoice(false)} style={{ backgroundColor: COLORS.pink, borderRadius: 12, padding: 16, margin: 8 }}>
                    <Text style={{ color: COLORS.white, fontFamily: FONTS.title, fontSize: 20 }}>-10</Text>
                  </Pressable>
                </View>
              </>
            )}
            {specialModal?.type === 'Q' && (
              <>
                <Text style={{ color: COLORS.white, fontFamily: FONTS.title, fontSize: 22, marginBottom: 16 }}>Dame : Choisis une dizaine</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[10,20,30,40,50,60,70,80,90].map(d => (
                    <Pressable key={d} onPress={() => handleQueenChoice(d)} style={{ backgroundColor: COLORS.cyan, borderRadius: 12, padding: 12, margin: 8, minWidth: 48, alignItems: 'center' }}>
                      <Text style={{ color: COLORS.violet, fontFamily: FONTS.title, fontSize: 18 }}>{d}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
            <Pressable onPress={() => setSpecialModal(null)} style={{ marginTop: 18 }}>
              <Text style={{ color: COLORS.orange, fontFamily: FONTS.text, fontSize: 16 }}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.violet,
    paddingTop: 24,
  },
  centerBlock: {
    alignItems: 'center',
    marginTop: 24,
  },
  totalLabel: {
    color: COLORS.cyan,
    fontFamily: FONTS.text,
    fontSize: 22,
    marginBottom: 8,
  },
  total: {
    color: COLORS.white,
    fontFamily: FONTS.title,
    fontSize: 60,
    marginBottom: 8,
    textShadowColor: COLORS.pink,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  playerLabel: {
    color: COLORS.orange,
    fontFamily: FONTS.text,
    fontSize: 20,
    marginBottom: 16,
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  deckBlock: {
    alignItems: 'center',
    marginRight: 32,
  },
  deckStack: {
    width: 56,
    height: 80,
    position: 'relative',
  },
  cardBack: {
    position: 'absolute',
    width: 56,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.cyan,
    borderWidth: 2,
    borderColor: COLORS.violet,
  },
  deckCount: {
    color: COLORS.cyan,
    fontFamily: FONTS.title,
    fontSize: 18,
    marginTop: 2,
  },
  deckLabel: {
    color: COLORS.white,
    fontFamily: FONTS.text,
    fontSize: 14,
    marginTop: 0,
  },
  pileStack: {
    width: 80 + 16,
    height: 120 + 8,
    marginLeft: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pileLabel: {
    color: COLORS.white,
    fontFamily: FONTS.text,
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  handBlock: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  handTitle: {
    color: COLORS.cyan,
    fontFamily: FONTS.text,
    fontSize: 20,
    marginBottom: 8,
  },
}); 
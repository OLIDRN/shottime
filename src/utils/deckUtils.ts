export type Card = {
  value: string;
  suit: string;
};

export const SUITS = ['♠️', '♥️', '♦️', '♣️'];
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function generateDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ value, suit });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  return deck
    .map(card => ({ card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ card }) => card);
}

export function deal(deck: Card[], count: number): [Card[], Card[]] {
  return [deck.slice(0, count), deck.slice(count)];
}

export function draw(deck: Card[]): [Card | undefined, Card[]] {
  return [deck[0], deck.slice(1)];
}

export function getCardLabel(card: Card): string {
  return card.value + card.suit;
} 
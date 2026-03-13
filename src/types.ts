export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type GameStatus = 'waiting' | 'playing' | 'selecting_suit' | 'game_over';
export type PlayerType = 'player' | 'ai';

export interface GameState {
  deck: Card[];
  playerHand: Card[];
  aiHand: Card[];
  discardPile: Card[];
  currentTurn: PlayerType;
  status: GameStatus;
  winner: PlayerType | null;
  activeSuit: Suit | null; // Used when an 8 is played
}

import { useState, useEffect, useCallback } from 'react';
import { Card, GameState, PlayerType, Suit, GameStatus } from './types';
import { createDeck, shuffle } from './constants';

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    status: 'waiting',
    winner: null,
    activeSuit: null,
  });

  const startGame = useCallback(() => {
    const fullDeck = createDeck();
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Discard pile starts with one card, but not an 8
    let discardIndex = 0;
    while (fullDeck[discardIndex].rank === '8') {
      discardIndex++;
    }
    const firstDiscard = fullDeck.splice(discardIndex, 1)[0];

    setState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile: [firstDiscard],
      currentTurn: 'player',
      status: 'playing',
      winner: null,
      activeSuit: firstDiscard.suit,
    });
  }, []);

  const checkWin = (hand: Card[], player: PlayerType) => {
    if (hand.length === 0) {
      setState(prev => ({
        ...prev,
        status: 'game_over',
        winner: player
      }));
      return true;
    }
    return false;
  };

  const isPlayable = (card: Card, topCard: Card, activeSuit: Suit | null) => {
    if (card.rank === '8') return true;
    return card.suit === activeSuit || card.rank === topCard.rank;
  };

  const drawCard = (player: PlayerType) => {
    setState(prev => {
      if (prev.deck.length === 0) {
        // Reshuffle discard pile into deck if empty
        const newDiscard = prev.discardPile.slice(-1);
        const newDeck = shuffle(prev.discardPile.slice(0, -1));
        if (newDeck.length === 0) return prev; // Truly out of cards
        
        const card = newDeck.pop()!;
        const updatedHand = player === 'player' ? [...prev.playerHand, card] : [...prev.aiHand, card];
        
        return {
          ...prev,
          deck: newDeck,
          discardPile: newDiscard,
          [player === 'player' ? 'playerHand' : 'aiHand']: updatedHand,
          currentTurn: player === 'player' ? 'ai' : 'player'
        };
      }

      const newDeck = [...prev.deck];
      const card = newDeck.pop()!;
      const updatedHand = player === 'player' ? [...prev.playerHand, card] : [...prev.aiHand, card];

      return {
        ...prev,
        deck: newDeck,
        [player === 'player' ? 'playerHand' : 'aiHand']: updatedHand,
        currentTurn: player === 'player' ? 'ai' : 'player'
      };
    });
  };

  const playCard = (cardId: string, player: PlayerType, selectedSuit?: Suit) => {
    setState(prev => {
      const hand = player === 'player' ? prev.playerHand : prev.aiHand;
      const cardIndex = hand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;

      const card = hand[cardIndex];
      const newHand = [...hand];
      newHand.splice(cardIndex, 1);

      const isEight = card.rank === '8';
      
      // If it's an 8 and no suit selected yet (for player), change status to select suit
      if (isEight && player === 'player' && !selectedSuit) {
        return {
          ...prev,
          status: 'selecting_suit',
          // We'll handle the actual play after suit selection
        };
      }

      const nextTurn = player === 'player' ? 'ai' : 'player';
      const newActiveSuit = isEight ? (selectedSuit || card.suit) : card.suit;

      const newState = {
        ...prev,
        [player === 'player' ? 'playerHand' : 'aiHand']: newHand,
        discardPile: [...prev.discardPile, card],
        activeSuit: newActiveSuit,
        currentTurn: nextTurn,
        status: 'playing' as GameStatus,
      };

      // Check win condition immediately after state update logic
      if (newHand.length === 0) {
        newState.status = 'game_over';
        newState.winner = player;
      }

      return newState;
    });
  };

  const handleSuitSelection = (suit: Suit) => {
    // Find the 8 in player's hand (it must be there if we are in this state)
    const eightIndex = state.playerHand.findIndex(c => c.rank === '8');
    if (eightIndex !== -1) {
      const card = state.playerHand[eightIndex];
      playCard(card.id, 'player', suit);
    }
  };

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.currentTurn === 'ai') {
      const timer = setTimeout(() => {
        const topCard = state.discardPile[state.discardPile.length - 1];
        const playableCards = state.aiHand.filter(c => isPlayable(c, topCard, state.activeSuit));

        if (playableCards.length > 0) {
          // AI Strategy: Play an 8 if it's the only playable or randomly
          const eight = playableCards.find(c => c.rank === '8');
          const normal = playableCards.filter(c => c.rank !== '8');
          
          let cardToPlay;
          if (normal.length > 0) {
            cardToPlay = normal[Math.floor(Math.random() * normal.length)];
          } else {
            cardToPlay = eight!;
          }

          if (cardToPlay.rank === '8') {
            // AI chooses suit with most cards in hand
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
            state.aiHand.forEach(c => { if (c.rank !== '8') suitCounts[c.suit]++; });
            const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
            playCard(cardToPlay.id, 'ai', bestSuit);
          } else {
            playCard(cardToPlay.id, 'ai');
          }
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.currentTurn, state.status, state.aiHand, state.discardPile, state.activeSuit]);

  return {
    state,
    startGame,
    playCard: (id: string) => playCard(id, 'player'),
    drawCard: () => drawCard('player'),
    handleSuitSelection,
  };
};

import { motion, AnimatePresence } from 'motion/react';
import { useCrazyEights } from './useCrazyEights';
import { Card } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { SUIT_SYMBOLS, SUIT_COLORS } from './constants';
import { Trophy, RotateCcw, Info, ChevronDown } from 'lucide-react';

export default function App() {
  const { state, startGame, playCard, drawCard, handleSuitSelection } = useCrazyEights();

  const topCard = state.discardPile[state.discardPile.length - 1];

  return (
    <div className="min-h-screen bg-emerald-900 text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-lg">8</div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Crazy Eights</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Live Match
          </div>
          <button 
            onClick={startGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Restart Game"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 gap-8">
        {state.status === 'waiting' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="mb-8 flex justify-center gap-4">
              {['hearts', 'spades', 'diamonds', 'clubs'].map((s, i) => (
                <motion.div
                  key={s}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }}
                  className={`text-4xl ${SUIT_COLORS[s as any]}`}
                >
                  {SUIT_SYMBOLS[s as any]}
                </motion.div>
              ))}
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight">READY TO PLAY?</h2>
            <p className="text-emerald-100/60 mb-8">Match the suit or rank. Use 8s as wild cards. Be the first to clear your hand!</p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              START GAME
            </button>
          </motion.div>
        ) : (
          <>
            {/* AI Hand */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300/60 uppercase tracking-widest">
                AI Opponent ({state.aiHand.length} cards)
                {state.currentTurn === 'ai' && <span className="text-emerald-400 animate-pulse">Thinking...</span>}
              </div>
              <div className="flex justify-center -space-x-8 sm:-space-x-12 h-24 sm:h-36">
                {state.aiHand.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card card={card} isHidden className="scale-75 sm:scale-100" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Center Area: Deck and Discard */}
            <div className="flex items-center gap-8 sm:gap-16 my-4">
              {/* Draw Pile */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  onClick={state.currentTurn === 'player' ? drawCard : undefined}
                  className={`relative group ${state.currentTurn === 'player' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <div className="absolute inset-0 bg-indigo-900 rounded-lg translate-y-2 translate-x-1" />
                  <div className="absolute inset-0 bg-indigo-800 rounded-lg translate-y-1 translate-x-0.5" />
                  <Card 
                    card={{ id: 'deck', suit: 'spades', rank: '8' }} 
                    isHidden 
                    className={`relative z-10 transition-transform ${state.currentTurn === 'player' ? 'group-hover:-translate-y-1' : ''}`}
                  />
                  {state.currentTurn === 'player' && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-emerald-900 px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      DRAW CARD
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-emerald-300/40 uppercase tracking-tighter">Deck ({state.deck.length})</span>
              </div>

              {/* Discard Pile */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={topCard.id}
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      className="relative z-10"
                    >
                      <Card card={topCard} />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Active Suit Indicator (if 8 was played) */}
                  {state.activeSuit && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-4 -top-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border-2 border-emerald-500"
                    >
                      <span className={`text-xl ${SUIT_COLORS[state.activeSuit]}`}>
                        {SUIT_SYMBOLS[state.activeSuit]}
                      </span>
                    </motion.div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-emerald-300/40 uppercase tracking-tighter">Discard</span>
              </div>
            </div>

            {/* Player Hand */}
            <div className="w-full flex flex-col items-center gap-4 mt-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300/60 uppercase tracking-widest">
                Your Hand ({state.playerHand.length} cards)
                {state.currentTurn === 'player' && <span className="text-emerald-400 animate-pulse">Your Turn</span>}
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl px-4 pb-8">
                {state.playerHand.map((card) => {
                  const playable = state.currentTurn === 'player' && (
                    card.rank === '8' || 
                    card.suit === state.activeSuit || 
                    card.rank === topCard.rank
                  );
                  
                  return (
                    <Card 
                      key={card.id} 
                      card={card} 
                      isPlayable={playable}
                      onClick={() => playCard(card.id)}
                      className="scale-90 sm:scale-100"
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {state.status === 'selecting_suit' && (
          <SuitSelector onSelect={handleSuitSelection} />
        )}

        {state.status === 'game_over' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full text-center text-slate-900"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-yellow-600" size={40} />
              </div>
              
              <h2 className="text-4xl font-black mb-2 tracking-tight uppercase italic">
                {state.winner === 'player' ? 'Victory!' : 'Defeat!'}
              </h2>
              <p className="text-slate-500 mb-8">
                {state.winner === 'player' 
                  ? 'Incredible strategy! You cleared your hand first.' 
                  : 'The AI outplayed you this time. Ready for a rematch?'}
              </p>
              
              <button 
                onClick={startGame}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                PLAY AGAIN
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Hint */}
      <div className="sm:hidden fixed bottom-4 right-4 z-20">
        <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
          <Info size={20} className="text-white/60" />
        </div>
      </div>
    </div>
  );
}

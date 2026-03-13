import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS, SUITS } from '../constants';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Crazy Eight!</h2>
        <p className="text-slate-500 mb-8">Choose a new suit to play</p>
        
        <div className="grid grid-cols-2 gap-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group
              `}
            >
              <span className={`text-4xl mb-2 ${SUIT_COLORS[suit]} group-hover:scale-125 transition-transform`}>
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="text-sm font-semibold capitalize text-slate-600">
                {suit}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

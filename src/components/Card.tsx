import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType, Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  isHidden?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  isPlayable = false, 
  isHidden = false,
  className = ""
}) => {
  if (isHidden) {
    return (
      <motion.div
        layoutId={card.id}
        className={`w-16 h-24 sm:w-24 sm:h-36 bg-indigo-700 rounded-lg border-2 border-white/20 shadow-lg flex items-center justify-center relative overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="text-white text-xs">♠</div>
          ))}
        </div>
        <div className="w-8 h-12 sm:w-12 sm:h-16 border border-white/30 rounded flex items-center justify-center">
          <div className="text-white/40 text-2xl font-bold">8</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={card.id}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border border-slate-200 shadow-md flex flex-col justify-between p-1 sm:p-2 cursor-pointer relative
        ${isPlayable ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}
        ${className}
      `}
    >
      <div className={`flex flex-col items-start leading-none ${SUIT_COLORS[card.suit]}`}>
        <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      
      <div className={`flex items-center justify-center text-2xl sm:text-4xl ${SUIT_COLORS[card.suit]}`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      
      <div className={`flex flex-col items-end leading-none rotate-180 ${SUIT_COLORS[card.suit]}`}>
        <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { RollResult } from '../types';

interface DiceRollerProps {
  onRoll?: (result: RollResult) => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll }) => {
  const [history, setHistory] = useState<RollResult[]>([]);
  const [modifier, setModifier] = useState<number>(0);

  const rollDice = (sides: number) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    const result: RollResult = {
      total: roll + modifier,
      dice: [roll],
      modifier,
      crit: roll === sides ? 'success' : roll === 1 ? 'fail' : null
    };

    setHistory(prev => [result, ...prev].slice(0, 20));
    if (onRoll) onRoll(result);
  };

  const rollD100 = () => {
    const roll = Math.floor(Math.random() * 100) + 1;
     // Common LoM rpg mechanic: low is often good for success checks, high for damage.
    const result: RollResult = {
      total: roll,
      dice: [roll],
      modifier: 0,
      crit: roll <= 5 ? 'success' : roll >= 96 ? 'fail' : null
    };
    setHistory(prev => [result, ...prev].slice(0, 20));
    if (onRoll) onRoll(result);
  }

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="bg-mystic-800 border border-mystic-gold/30 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 border-b border-mystic-gold/20 pb-2">
        <h3 className="text-mystic-gold font-serif text-lg">Dados do Destino</h3>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-[10px] font-serif uppercase tracking-widest text-stone-500 hover:text-red-400 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={() => rollDice(20)} className="px-4 py-2 bg-mystic-700 hover:bg-mystic-600 text-stone-200 rounded border border-stone-600 transition-colors">d20</button>
        <button onClick={() => rollDice(4)} className="px-3 py-2 bg-mystic-700 hover:bg-mystic-600 text-stone-200 rounded border border-stone-600 transition-colors">d4</button>
        <button onClick={() => rollDice(6)} className="px-3 py-2 bg-mystic-700 hover:bg-mystic-600 text-stone-200 rounded border border-stone-600 transition-colors">d6</button>
        <button onClick={() => rollDice(8)} className="px-3 py-2 bg-mystic-700 hover:bg-mystic-600 text-stone-200 rounded border border-stone-600 transition-colors">d8</button>
        <button onClick={() => rollDice(10)} className="px-3 py-2 bg-mystic-700 hover:bg-mystic-600 text-stone-200 rounded border border-stone-600 transition-colors">d10</button>
        <button onClick={() => rollDice(12)} className="px-3 py-2 bg-mystic-700 hover:bg-mystic-600 text-stone-200 rounded border border-stone-600 transition-colors">d12</button>
        <button onClick={() => rollD100()} className="px-4 py-2 bg-mystic-crimson/80 hover:bg-mystic-crimson text-white font-bold rounded border border-red-900 transition-colors">d100</button>
      </div>

      <div className="flex items-center gap-2 mb-4 justify-center text-sm">
        <label className="text-stone-400">Modificador:</label>
        <input 
          type="number" 
          value={modifier} 
          onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
          className="w-16 bg-mystic-900 border border-stone-700 rounded px-2 py-1 text-center text-stone-200 focus:border-mystic-gold outline-none"
        />
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {history.map((roll, idx) => (
          <div key={idx} className="flex justify-between items-center bg-mystic-900/50 p-2 rounded border border-stone-800/50 animate-fadeIn">
            <span className="text-xs text-stone-500 font-serif">Rolagem</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold text-lg ${
                roll.crit === 'success' ? 'text-green-400' : 
                roll.crit === 'fail' ? 'text-red-500' : 'text-mystic-gold'
              }`}>
                {roll.total}
              </span>
              <span className="text-xs text-stone-600">
                ({roll.dice.join('+')}{roll.modifier !== 0 ? (roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier) : ''})
              </span>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-center text-stone-600 italic text-sm py-4 font-serif">Os dados ainda não falaram.</p>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
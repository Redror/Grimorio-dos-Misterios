
import React, { useState } from 'react';
import { Character, SkillEntry } from '../types';
import { SKILLS_DEFINITION } from '../constants';

interface SkillsProps {
  character: Character;
  updateCharacter: (c: Character) => void;
}

const Skills: React.FC<SkillsProps> = ({ character, updateCharacter }) => {
  const [isEditingLabels, setIsEditingLabels] = useState(false);

  // Use the direct attribute value as requested
  const intAttr = character.attributes.intelligence;
  
  // Base points at Seq 9: 5 + Intelligence Attribute
  const basePoints = 5 + intAttr;
  
  // Advancement logic: +2 + Intelligence Attribute per sequence advanced
  const sequenceAdvancementCount = Math.max(0, 9 - character.sequence);
  const pointsPerAdvancement = 2 + intAttr;
  
  const totalPointsAvailable = basePoints + (sequenceAdvancementCount * pointsPerAdvancement);
  
  // "Gasto" (Spent) points are only the points put into "Treino Normal" (trained)
  // Explicit cast to SkillEntry[] to fix type inference issue on Object.values with empty object fallback
  const currentSpent = (Object.values(character.skills || {}) as SkillEntry[]).reduce((acc: number, entry: SkillEntry) => acc + (entry.trained || 0), 0);
  const remaining = totalPointsAvailable - currentSpent;

  const handleUpdateSkill = (skillName: string, updates: Partial<SkillEntry>) => {
    const currentEntry = character.skills?.[skillName] || { trained: 0, extra: 0 };
    updateCharacter({
      ...character,
      skills: {
        ...(character.skills || {}),
        [skillName]: { ...currentEntry, ...updates }
      }
    });
  };

  const handleUpdateSkillLabel = (originalName: string, newLabel: string) => {
    updateCharacter({
      ...character,
      skillLabels: {
        ...(character.skillLabels || {}),
        [originalName]: newLabel
      }
    });
  };

  const getAttrShortName = (attrKey: string) => {
    const labels: Record<string, string> = {
      strength: 'FOR',
      agility: 'AGI',
      intelligence: 'INT',
      spirit: 'VIG',
      mysticism: 'ESP',
      presence: 'PRE'
    };
    return labels[attrKey] || attrKey.toUpperCase().substring(0, 3);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Pool Header */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-gold to-transparent opacity-50"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-stone-700 pb-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-serif text-mystic-gold">Perícias</h2>
              <p className="text-stone-500 text-sm italic">O preparo é a única barreira contra o desconhecido.</p>
            </div>
            <button 
              onClick={() => setIsEditingLabels(!isEditingLabels)}
              className={`text-[10px] px-2 py-1 rounded transition-colors border ${
                isEditingLabels 
                  ? 'bg-mystic-gold text-mystic-900 border-mystic-gold font-bold' 
                  : 'text-stone-500 border-stone-700 hover:text-stone-300 hover:border-stone-500'
              }`}
            >
              {isEditingLabels ? "Salvar Nomes" : "Editar Nomes"}
            </button>
          </div>
          
          <div className="bg-mystic-900 border border-stone-700 p-4 rounded flex gap-8 items-center shadow-inner">
             <div className="text-center">
               <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Total Disponível</span>
               <span className="text-2xl font-bold text-mystic-gold">{totalPointsAvailable}</span>
               <div className="text-[9px] text-stone-600 mt-1">
                 (5 + {intAttr} INT) 
                 {sequenceAdvancementCount > 0 && ` + ${sequenceAdvancementCount}x(2 + ${intAttr})`}
               </div>
             </div>
             <div className="text-center">
               <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Gasto</span>
               <span className="text-2xl font-bold text-stone-300">{currentSpent}</span>
             </div>
             <div className="text-center">
               <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Saldo</span>
               <span className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : remaining === 0 ? 'text-stone-500' : 'text-green-500'}`}>
                 {remaining}
               </span>
             </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-[10px] uppercase tracking-widest text-stone-500 border-b border-stone-800/50 pb-2">
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-mystic-gold rounded-full shadow-[0_0_5px_rgba(197,160,89,0.8)]"></span> Treino Ativo</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-stone-700 rounded-full"></span> Não Treinado</div>
          <div className="flex items-center gap-1 ml-4"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Modificadores Extras</div>
        </div>

        {/* Skills Grid */}
        {/* Changed grid layout from lg:grid-cols-3 to xl:grid-cols-2 to prevent overflow in 2/3 column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Object.entries(SKILLS_DEFINITION).map(([skillName, attrKey]) => {
            const attrVal = character.attributes[attrKey];
            const entry = character.skills?.[skillName] || { trained: 0, extra: 0 };
            const totalValue = (entry.trained || 0) + (entry.extra || 0);
            const isTrained = entry.trained > 0;
            const displayName = character.skillLabels?.[skillName] || skillName;

            return (
              <div 
                key={skillName} 
                className={`grid grid-cols-12 gap-1 items-center group p-3 rounded transition-all border ${
                  isTrained 
                    ? 'bg-mystic-gold/5 border-mystic-gold/30 shadow-[inset_0_0_15px_rgba(197,160,89,0.05)]' 
                    : 'border-transparent border-b-stone-800/30 hover:bg-white/5'
                }`}
              >
                {/* Name Section - Takes 5/12 columns */}
                <div className="col-span-5 flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isTrained && (
                      <div className="w-1.5 h-1.5 rounded-full bg-mystic-gold shadow-[0_0_8px_rgba(197,160,89,1)] shrink-0"></div>
                    )}
                    {isEditingLabels ? (
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => handleUpdateSkillLabel(skillName, e.target.value)}
                        className="bg-transparent border-b border-mystic-gold/50 text-mystic-gold font-serif text-sm focus:outline-none w-full"
                        placeholder={skillName}
                      />
                    ) : (
                      <span className={`text-sm font-serif font-medium transition-colors truncate ${isTrained ? 'text-mystic-gold' : 'text-stone-300'}`} title={displayName}>
                        {displayName}
                      </span>
                    )}
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded uppercase shrink-0 ${isTrained ? 'bg-mystic-gold/20 text-mystic-gold' : 'bg-stone-900 text-stone-600'}`}>
                      {getAttrShortName(attrKey)}
                    </span>
                  </div>
                  <span className="text-[9px] text-stone-600 mt-0.5 italic truncate">Bonus Atrib: +{attrVal}</span>
                </div>
                
                {/* Controls Section - Takes 7/12 columns */}
                <div className="col-span-7 flex items-center justify-start gap-1">
                  {/* Trained Points Input */}
                  <div className={`flex items-center rounded border overflow-hidden transition-colors ${
                    isTrained ? 'bg-mystic-900 border-mystic-gold/50' : 'bg-mystic-900/40 border-stone-700/50'
                  }`} title="Treino Normal (Pool)">
                    <button 
                      onClick={() => handleUpdateSkill(skillName, { trained: Math.max(0, entry.trained - 1) })}
                      className="px-1.5 py-1 hover:bg-mystic-700 text-stone-500 hover:text-white transition-colors text-xs"
                    >-</button>
                    <input 
                      type="number"
                      value={entry.trained}
                      onChange={(e) => handleUpdateSkill(skillName, { trained: parseInt(e.target.value) || 0 })}
                      className={`w-7 bg-transparent text-center text-[11px] font-bold focus:outline-none appearance-none ${
                        isTrained ? 'text-mystic-gold' : 'text-stone-500'
                      }`}
                    />
                    <button 
                      onClick={() => handleUpdateSkill(skillName, { trained: entry.trained + 1 })}
                      className="px-1.5 py-1 hover:bg-mystic-700 text-stone-500 hover:text-white transition-colors text-xs"
                    >+</button>
                  </div>

                  {/* Attribute/Extra Bonus Input */}
                  <div className="flex items-center bg-blue-900/10 rounded border border-blue-900/30 overflow-hidden" title="Modificadores Externos">
                    <span className="text-[9px] px-1 text-blue-400 font-bold">+</span>
                    <input 
                      type="number"
                      value={entry.extra}
                      onChange={(e) => handleUpdateSkill(skillName, { extra: parseInt(e.target.value) || 0 })}
                      className="w-7 bg-transparent text-center text-[11px] text-blue-300 font-bold focus:outline-none appearance-none"
                      placeholder="0"
                    />
                  </div>

                  {/* Resulting Total */}
                  <div className={`w-9 h-7 flex items-center justify-center rounded border transition-all ${
                    isTrained 
                      ? 'bg-mystic-gold/20 border-mystic-gold/60 shadow-[0_0_10px_rgba(197,160,89,0.2)]' 
                      : 'bg-stone-900 border-stone-800'
                  }`}>
                    <span className={`text-sm font-bold ${isTrained ? 'text-mystic-gold' : 'text-stone-500'}`}>
                      {totalValue}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Summary */}
      <div className="bg-mystic-900/60 p-5 rounded-lg border border-stone-800 text-[12px] text-stone-500 font-serif italic space-y-2 leading-relaxed">
        <h4 className="text-mystic-gold not-italic font-bold uppercase tracking-widest text-[10px] mb-2">Orientações de Treinamento</h4>
        <p>• <strong className="text-stone-400">Ponto de Treino:</strong> Cada ponto alocado em <span className="text-mystic-gold">Treino Normal</span> consome sua pool de conhecimento e é marcado com um brilho dourado.</p>
        <p>• <strong className="text-stone-400">Pool Total:</strong> 5 + Inteligência ({intAttr}) = {basePoints} + Ganhos de Avanço ({sequenceAdvancementCount}x realizados).</p>
        <p>• <strong className="text-stone-400">Soma Final:</strong> O valor <span className="text-mystic-gold font-bold">[{totalPointsAvailable}]</span> totaliza suas chances. Não esqueça de inserir seus bônus de atributo no campo azul!</p>
      </div>
    </div>
  );
};

export default Skills;

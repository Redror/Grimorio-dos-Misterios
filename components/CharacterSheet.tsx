
import React, { useState } from 'react';
import { Character, Pathway, Ability } from '../types';
import { PATHWAY_LIST, PATHWAY_QUOTES } from '../constants';

interface CharacterSheetProps {
  character: Character;
  updateCharacter: (c: Character) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, updateCharacter }) => {
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);
  const [isEditingStats, setIsEditingStats] = useState(false);

  const handleStatChange = (stat: keyof typeof character.stats, value: number) => {
    updateCharacter({
      ...character,
      stats: {
        ...character.stats,
        [stat]: value
      }
    });
  };

  const handleAttrChange = (attr: keyof typeof character.attributes, value: number) => {
    updateCharacter({
      ...character,
      attributes: {
        ...character.attributes,
        [attr]: value
      }
    });
  };

  const handleAttrLabelChange = (attrKey: string, newLabel: string) => {
    updateCharacter({
      ...character,
      attributeLabels: {
        ...character.attributeLabels,
        [attrKey]: newLabel
      }
    });
  };

  const calculateDerivedStats = () => {
    // Vigor corresponds to Spirit attribute in this system's mapping
    const vigor = character.attributes.spirit || 0;
    // Espiritualidade corresponds to Mysticism attribute
    const esp = character.attributes.mysticism || 0;
    
    // Sequence ranges from 9 (Low) to 0 (High). 
    // If undefined, default to 9.
    const seq = typeof character.sequence === 'number' ? character.sequence : 9;
    
    // --- HP Calculation ---
    // Base Human: 10 + Vigor
    // Per Advance: 3 + 2*Vigor
    // Advances count: If Seq 9, 1 advance. If Seq 0, 10 advances.
    const advances = Math.max(0, 10 - seq);
    
    const baseHp = 10 + vigor;
    const growthHp = advances * (3 + (2 * vigor));
    const newMaxHp = baseHp + growthHp;

    // --- EE (Spirituality) Calculation ---
    // Same logic as HP but based on Esp (Mysticism)
    const baseEe = 10 + esp;
    const growthEe = advances * (3 + (2 * esp));
    const newMaxEe = baseEe + growthEe;

    // --- Sanity Calculation ---
    // Base Human: 50 + 10*Esp
    // Reduction per potion: (Potion Level) - Esp. Min 0.
    // Iterating from Potion 9 down to current Sequence Potion.
    const baseSanity = 50 + (10 * esp);
    let sanityReduction = 0;
    
    // If currently Seq 9, loop runs for k=9.
    // If currently Seq 7, loop runs for k=9, k=8, k=7.
    for (let k = 9; k >= seq; k--) {
        const potionLevel = k;
        const cost = Math.max(0, potionLevel - esp);
        sanityReduction += cost;
    }
    
    const newMaxSanity = Math.max(0, baseSanity - sanityReduction);

    const message = `Auto-Cálculo (Baseado no Guia):

Atributos Utilizados:
- Vigor (Spirit): ${vigor}
- Espiritualidade (Mysticism): ${esp}
- Sequência Atual: ${seq}

Novos Valores Máximos:
- Vida (HP): ${newMaxHp} (Antigo: ${character.stats.maxHp})
- Energia Espiritual: ${newMaxEe} (Antigo: ${character.stats.maxSpirituality})
- Sanidade: ${newMaxSanity} (Antigo: ${character.stats.maxSanity})

Deseja aplicar estas alterações?`;

    if (confirm(message)) {
      updateCharacter({
        ...character,
        stats: {
          ...character.stats,
          maxHp: newMaxHp,
          maxSpirituality: newMaxEe,
          maxSanity: newMaxSanity,
          // Ensure current values don't exceed new max
          hp: Math.min(character.stats.hp, newMaxHp),
          spirituality: Math.min(character.stats.spirituality, newMaxEe),
          sanity: Math.min(character.stats.sanity, newMaxSanity)
        }
      });
    }
  };

  const getHpPercent = () => (character.stats.hp / character.stats.maxHp) * 100;
  const getSpiritualityPercent = () => (character.stats.spirituality / character.stats.maxSpirituality) * 100;
  const getSanityPercent = () => (character.stats.sanity / character.stats.maxSanity) * 100;

  const handleAddAbility = () => {
    const newAbility = { id: Date.now().toString(), name: 'Nova Habilidade', description: 'Descrição...', cost: '0' };
    updateCharacter({...character, abilities: [...(character.abilities || []), newAbility]});
  };

  const handleAddTrait = () => {
    const newTrait = { id: 't' + Date.now().toString(), name: 'Novo Traço', description: 'Descrição Passiva...', cost: 'Passiva' };
    updateCharacter({...character, traits: [...(character.traits || []), newTrait]});
  };

  const currentQuote = PATHWAY_QUOTES[character.pathway] || "";

  // Helper for sanity/corruption color
  const isCorrupted = character.stats.sanity === 0;
  const isSanityLow = character.stats.sanity < (character.stats.maxSanity * 0.3);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-mystic-800 p-6 rounded-lg border border-mystic-gold/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-gold to-transparent opacity-50"></div>
        
        {/* Left Side: Identity */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-serif text-mystic-gold uppercase tracking-widest mb-1">Nome</label>
              <input 
                type="text" 
                value={character.name} 
                onChange={(e) => updateCharacter({...character, name: e.target.value})}
                className="w-full bg-transparent border-b border-stone-600 text-stone-100 text-xl font-serif focus:border-mystic-gold outline-none pb-1"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-xs font-serif text-mystic-gold uppercase tracking-widest mb-1">Origem</label>
              <div className="text-stone-300 font-serif border-b border-stone-700 py-1 text-sm overflow-hidden whitespace-nowrap text-ellipsis flex flex-col">
                <span>{character.origin || "Nenhuma"}</span>
                {character.originChoice && (
                  <span className="text-[10px] text-mystic-gold italic leading-none">{character.originChoice}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-serif text-stone-500 uppercase tracking-widest mb-1">Caminho (Pathway)</label>
                <select 
                  value={character.pathway} 
                  onChange={(e) => updateCharacter({...character, pathway: e.target.value})}
                  className="w-full bg-mystic-900 border border-stone-700 text-stone-300 rounded p-2 text-sm focus:border-mystic-gold outline-none"
                >
                  {PATHWAY_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs font-serif text-stone-500 uppercase tracking-widest mb-1">Sequência</label>
                <input 
                  type="number" 
                  max={9} min={0} 
                  value={character.sequence} 
                  onChange={(e) => updateCharacter({...character, sequence: parseInt(e.target.value) || 0})}
                  className="w-full bg-mystic-900 border border-stone-700 text-stone-300 rounded p-2 text-sm text-center focus:border-mystic-gold outline-none"
                />
              </div>
            </div>
            {currentQuote && (
              <p className="text-[11px] font-serif italic text-mystic-gold/70 leading-relaxed animate-fadeIn mt-1">
                "{currentQuote}"
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Vital Bars */}
        <div className="space-y-5">
           <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] font-serif text-stone-500 uppercase tracking-tighter">Status Vitais</span>
             <div className="flex gap-2">
               {/* Button always visible for easier access */}
               <button 
                 onClick={calculateDerivedStats}
                 className="text-[9px] px-2 py-0.5 rounded bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/30 hover:bg-mystic-gold hover:text-mystic-900 transition-colors uppercase font-bold"
                 title="Calcula Max com base em Vigor, Esp e Sequência"
               >
                 Auto-Calcular (Guia)
               </button>
               <button 
                  onClick={() => setIsEditingStats(!isEditingStats)}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                    isEditingStats ? 'bg-mystic-gold text-mystic-900' : 'text-stone-500 hover:text-mystic-gold border border-stone-700'
                  }`}
                >
                  {isEditingStats ? 'Salvar' : 'Editar Valores'}
                </button>
             </div>
           </div>

           {/* HP Bar */}
           <div className="relative group">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-400 font-serif">Vida (HP)</span>
                <div className="flex items-center gap-1">
                   {isEditingStats ? (
                     <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={character.stats.hp}
                          onChange={(e) => handleStatChange('hp', parseInt(e.target.value) || 0)}
                          className="w-12 bg-mystic-900 border border-green-900 text-green-200 text-center rounded text-[10px]"
                        />
                        <span>/</span>
                        <input 
                          type="number" 
                          value={character.stats.maxHp}
                          onChange={(e) => handleStatChange('maxHp', parseInt(e.target.value) || 0)}
                          className="w-12 bg-mystic-900 border border-green-900 text-green-200 text-center rounded text-[10px]"
                        />
                     </div>
                   ) : (
                     <span className={character.stats.hp === 0 ? 'text-red-500' : ''}>{character.stats.hp} / {character.stats.maxHp}</span>
                   )}
                </div>
              </div>
              <div className="h-2.5 bg-mystic-900 rounded-full overflow-hidden border border-stone-700">
                <div className={`h-full transition-all duration-500 ${character.stats.hp < (character.stats.maxHp * 0.2) ? 'bg-red-600 animate-pulse' : 'bg-green-600/60'}`} style={{width: `${Math.min(100, Math.max(0, getHpPercent()))}%`}}></div>
              </div>
              {!isEditingStats && (
                <div className="flex gap-1.5 mt-1">
                  <button onClick={() => handleStatChange('hp', Math.max(0, character.stats.hp - 5))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-red-900 transition-colors">-5</button>
                  <button onClick={() => handleStatChange('hp', Math.max(0, character.stats.hp - 1))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-red-800 transition-colors">-1</button>
                  <button onClick={() => handleStatChange('hp', Math.min(character.stats.maxHp, character.stats.hp + 1))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-green-800 transition-colors">+1</button>
                  <button onClick={() => handleStatChange('hp', Math.min(character.stats.maxHp, character.stats.hp + 5))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-green-900 transition-colors">+5</button>
                </div>
              )}
              {/* HP Warning Messages */}
              {character.stats.hp < (character.stats.maxHp * 0.2) && character.stats.hp > 0 && (
                <p className="text-[9px] text-red-400 mt-1 font-serif italic text-center animate-pulse">Sua centelha de vida está se apagando...</p>
              )}
              {character.stats.hp === 0 && (
                <p className="text-[9px] text-red-600 mt-1 font-serif font-bold text-center animate-pulse uppercase tracking-widest">O corpo falhou. O descanso eterno chama.</p>
              )}
           </div>

           {/* Spirituality Bar */}
           <div className="relative group">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-300 font-serif">Espiritualidade</span>
                <div className="flex items-center gap-1">
                   {isEditingStats ? (
                     <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={character.stats.spirituality}
                          onChange={(e) => handleStatChange('spirituality', parseInt(e.target.value) || 0)}
                          className="w-12 bg-mystic-900 border border-blue-900 text-blue-200 text-center rounded text-[10px]"
                        />
                        <span>/</span>
                        <input 
                          type="number" 
                          value={character.stats.maxSpirituality}
                          onChange={(e) => handleStatChange('maxSpirituality', parseInt(e.target.value) || 0)}
                          className="w-12 bg-mystic-900 border border-blue-900 text-blue-200 text-center rounded text-[10px]"
                        />
                     </div>
                   ) : (
                     <span className={character.stats.spirituality === 0 ? 'text-blue-500' : ''}>{character.stats.spirituality} / {character.stats.maxSpirituality}</span>
                   )}
                </div>
              </div>
              <div className="h-2.5 bg-mystic-900 rounded-full overflow-hidden border border-stone-700">
                <div className={`h-full transition-all duration-500 ${character.stats.spirituality < (character.stats.maxSpirituality * 0.2) ? 'bg-blue-400 animate-pulse' : 'bg-blue-600/60'}`} style={{width: `${Math.min(100, Math.max(0, getSpiritualityPercent()))}%`}}></div>
              </div>
              {!isEditingStats && (
                <div className="flex gap-1.5 mt-1">
                  <button onClick={() => handleStatChange('spirituality', Math.max(0, character.stats.spirituality - 5))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-blue-900 transition-colors">-5</button>
                  <button onClick={() => handleStatChange('spirituality', Math.max(0, character.stats.spirituality - 1))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-blue-800 transition-colors">-1</button>
                  <button onClick={() => handleStatChange('spirituality', Math.min(character.stats.maxSpirituality, character.stats.spirituality + 1))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-blue-700 transition-colors">+1</button>
                  <button onClick={() => handleStatChange('spirituality', Math.min(character.stats.maxSpirituality, character.stats.spirituality + 5))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-blue-900 transition-colors">+5</button>
                </div>
              )}
              {/* Spirituality Warning Messages */}
              {character.stats.spirituality < (character.stats.maxSpirituality * 0.2) && character.stats.spirituality > 0 && (
                <p className="text-[9px] text-blue-400 mt-1 font-serif italic text-center animate-pulse">Sua conexão com o místico está instável...</p>
              )}
              {character.stats.spirituality === 0 && (
                <p className="text-[9px] text-blue-500 mt-1 font-serif font-bold text-center animate-pulse uppercase tracking-widest">Vazio espiritual. O preço foi alto demais.</p>
              )}
           </div>

           {/* Sanity Bar */}
           <div className="relative group">
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-serif font-bold transition-colors duration-500 ${ (isCorrupted || isSanityLow) ? 'text-mystic-corruption' : 'text-mystic-fog'}`}>
                  {isCorrupted ? "Corrupção" : "Sanidade"}
                </span>
                <div className="flex items-center gap-1">
                  {isEditingStats ? (
                    <div className="flex items-center gap-1">
                       <input 
                         type="number" 
                         value={character.stats.sanity}
                         onChange={(e) => handleStatChange('sanity', parseInt(e.target.value) || 0)}
                         className={`w-12 bg-mystic-900 text-center rounded text-[10px] border ${(isCorrupted || isSanityLow) ? 'border-mystic-corruption text-mystic-corruption' : 'border-stone-700 text-stone-300'}`}
                       />
                       <span>/</span>
                       <input 
                         type="number" 
                         value={character.stats.maxSanity}
                         onChange={(e) => handleStatChange('maxSanity', parseInt(e.target.value) || 0)}
                         className={`w-12 bg-mystic-900 text-center rounded text-[10px] border ${(isCorrupted || isSanityLow) ? 'border-mystic-corruption text-mystic-corruption' : 'border-stone-700 text-stone-300'}`}
                       />
                    </div>
                  ) : (
                    <span className={(isCorrupted || isSanityLow) ? 'text-mystic-corruption' : 'text-mystic-fog opacity-80'}>{character.stats.sanity} / {character.stats.maxSanity}</span>
                  )}
                </div>
              </div>
              <div className="h-2.5 bg-mystic-900 rounded-full overflow-hidden border border-stone-700 relative">
                <div className={`h-full transition-all duration-700 ${
                  isCorrupted 
                    ? 'bg-mystic-corruption shadow-[0_0_15px_rgba(124,58,237,0.8)]' 
                    : isSanityLow
                      ? 'bg-mystic-corruption animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.6)]' 
                      : 'bg-mystic-fog/40'
                  }`} style={{width: `${Math.min(100, Math.max(0, getSanityPercent()))}%`}}></div>
              </div>
              {!isEditingStats && (
                <div className="flex gap-1.5 mt-1">
                  <button onClick={() => handleStatChange('sanity', Math.max(0, character.stats.sanity - 5))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-mystic-corruption transition-colors">-5</button>
                  <button onClick={() => handleStatChange('sanity', Math.max(0, character.stats.sanity - 1))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-mystic-corruption transition-colors">-1</button>
                  <button onClick={() => handleStatChange('sanity', Math.min(character.stats.maxSanity, character.stats.sanity + 1))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-stone-700 transition-colors">+1</button>
                  <button onClick={() => handleStatChange('sanity', Math.min(character.stats.maxSanity, character.stats.sanity + 5))} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded hover:text-white hover:bg-stone-700 transition-colors">+5</button>
                </div>
              )}
              {/* Sanity Warning Messages */}
              {isSanityLow && character.stats.sanity > 0 && (
                 <p className="text-[10px] text-mystic-corruption mt-1 font-serif italic text-center animate-pulse drop-shadow-[0_0_2px_rgba(124,58,237,0.3)]">
                   Os sussurros estão ficando mais altos...
                 </p>
              )}
              {isCorrupted && (
                 <p className="text-[10px] text-mystic-corruption mt-1 font-serif font-bold text-center animate-pulse uppercase tracking-widest drop-shadow-[0_0_3px_rgba(124,58,237,0.5)]">
                   A Loucura é Inevitável
                 </p>
              )}
           </div>
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/20 relative">
         <div className="flex justify-between items-center mb-4 border-b border-stone-700 pb-2">
           <h3 className="text-mystic-gold font-serif text-lg">Atributos</h3>
           <button 
             onClick={() => setIsEditingAttributes(!isEditingAttributes)}
             className={`text-xs px-3 py-1 rounded transition-colors ${
               isEditingAttributes ? 'bg-mystic-gold text-mystic-900' : 'bg-mystic-700 text-stone-300 hover:bg-mystic-600'
             }`}
           >
             {isEditingAttributes ? 'Salvar Atributos' : 'Editar Atributos'}
           </button>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(character.attributes).map(([key, value]) => (
              <div key={key} className="bg-mystic-900/50 p-3 rounded border border-stone-800 text-center group hover:border-mystic-gold/50 transition-colors">
                 {isEditingAttributes ? (
                   <input 
                     type="text"
                     value={character.attributeLabels?.[key] || key}
                     onChange={(e) => handleAttrLabelChange(key, e.target.value)}
                     className="block w-full bg-mystic-800 text-xs text-mystic-gold uppercase text-center mb-2 outline-none border border-stone-700 rounded focus:border-mystic-gold"
                     placeholder="Nome"
                   />
                 ) : (
                   <label 
                     onClick={() => setIsEditingAttributes(true)}
                     className="block text-xs text-stone-500 uppercase mb-2 group-hover:text-stone-300 cursor-pointer hover:text-mystic-gold transition-colors"
                   >
                     {character.attributeLabels?.[key] || key}
                   </label>
                 )}
                 <input 
                   type="number" 
                   value={value} 
                   onChange={(e) => handleAttrChange(key as keyof typeof character.attributes, parseInt(e.target.value) || 0)}
                   readOnly={!isEditingAttributes}
                   className={`w-full bg-transparent text-center text-xl font-bold text-stone-200 focus:outline-none ${!isEditingAttributes ? 'cursor-default' : 'border-b border-mystic-gold/30'}`}
                 />
              </div>
            ))}
         </div>
      </div>

      {/* Lists Section: Habilidades, Traços, Inventário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Habilidades */}
          <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/20 flex flex-col h-96">
            <h3 className="text-mystic-gold font-serif text-lg mb-4 flex justify-between items-center">
              <span>Habilidades</span>
              <button 
                onClick={handleAddAbility}
                className="text-[10px] px-2 py-1 border border-stone-600 rounded hover:bg-stone-700"
              >
                + Adicionar
              </button>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
               {character.abilities?.map((ability, idx) => (
                 <div key={ability.id} className="p-3 bg-mystic-900 border border-stone-800 rounded group relative">
                    <input 
                      className="bg-transparent font-bold text-stone-200 w-full focus:outline-none mb-1 text-sm"
                      value={ability.name}
                      onChange={(e) => {
                        const newAbilities = [...character.abilities];
                        newAbilities[idx].name = e.target.value;
                        updateCharacter({...character, abilities: newAbilities});
                      }}
                      placeholder="Habilidade"
                    />
                    <textarea 
                       className="bg-transparent text-xs text-stone-400 w-full resize-none focus:outline-none"
                       rows={2}
                       value={ability.description}
                       onChange={(e) => {
                        const newAbilities = [...character.abilities];
                        newAbilities[idx].description = e.target.value;
                        updateCharacter({...character, abilities: newAbilities});
                      }}
                      placeholder="Descrição"
                    />
                    <div className="flex justify-between items-center mt-2">
                       <input 
                         className="bg-stone-900/50 text-[10px] text-blue-300 px-2 py-1 rounded w-1/2 focus:outline-none border border-transparent focus:border-blue-900"
                         value={ability.cost}
                         onChange={(e) => {
                          const newAbilities = [...character.abilities];
                          newAbilities[idx].cost = e.target.value;
                          updateCharacter({...character, abilities: newAbilities});
                        }}
                         placeholder="Custo"
                       />
                       <button 
                        className="text-red-900 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                        onClick={() => {
                          updateCharacter({...character, abilities: character.abilities.filter(a => a.id !== ability.id)});
                        }}
                       >
                         Excluir
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Traços (Passivas) */}
          <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/20 flex flex-col h-96">
            <h3 className="text-mystic-gold font-serif text-lg mb-4 flex justify-between items-center">
              <span>Traços</span>
              <button 
                onClick={handleAddTrait}
                className="text-[10px] px-2 py-1 border border-stone-600 rounded hover:bg-stone-700"
              >
                + Adicionar
              </button>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
               {character.traits?.map((trait, idx) => (
                 <div key={trait.id} className="p-3 bg-mystic-900 border border-stone-800 rounded group relative">
                    <input 
                      className="bg-transparent font-bold text-mystic-gold w-full focus:outline-none mb-1 text-sm font-serif"
                      value={trait.name}
                      onChange={(e) => {
                        const newTraits = [...character.traits];
                        newTraits[idx].name = e.target.value;
                        updateCharacter({...character, traits: newTraits});
                      }}
                      placeholder="Traço Passivo"
                    />
                    <textarea 
                       className="bg-transparent text-xs text-stone-400 w-full resize-none focus:outline-none"
                       rows={2}
                       value={trait.description}
                       onChange={(e) => {
                        const newTraits = [...character.traits];
                        newTraits[idx].description = e.target.value;
                        updateCharacter({...character, traits: newTraits});
                      }}
                      placeholder="Efeito Passivo"
                    />
                    <div className="flex justify-between items-center mt-2">
                       <input 
                         className="bg-stone-900/50 text-[10px] text-stone-500 uppercase tracking-widest px-2 py-1 rounded w-1/2 focus:outline-none border border-transparent focus:border-stone-700"
                         value={trait.cost}
                         onChange={(e) => {
                          const newTraits = [...character.traits];
                          newTraits[idx].cost = e.target.value;
                          updateCharacter({...character, traits: newTraits});
                        }}
                         placeholder="Tipo"
                       />
                       <button 
                        className="text-red-900 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                        onClick={() => {
                          updateCharacter({...character, traits: character.traits.filter(t => t.id !== trait.id)});
                        }}
                       >
                         Excluir
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Inventário */}
          <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/20 flex flex-col h-96">
            <h3 className="text-mystic-gold font-serif text-lg mb-4">Inventário & Artefatos</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <textarea 
                className="w-full h-full bg-mystic-900 border border-stone-800 p-4 text-sm text-stone-300 leading-relaxed focus:border-mystic-gold focus:outline-none resize-none font-serif"
                value={character.notes}
                onChange={(e) => updateCharacter({...character, notes: e.target.value})}
                placeholder="Liste seus itens, artefatos selados e segredos aqui..."
              />
            </div>
          </div>
      </div>
    </div>
  );
};

export default CharacterSheet;

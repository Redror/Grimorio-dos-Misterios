
import React from 'react';
import { Character, PersonalInfo, SoulArtifact } from '../types';

interface PersonalProps {
  character: Character;
  updateCharacter: (c: Character) => void;
}

// Helper components defined outside to prevent re-mounting on every render
const TextAreaField = ({ label, value, onChange, rows = 3 }: { label: string, value: string, onChange: (val: string) => void, rows?: number }) => (
  <div className="space-y-1">
    <label className="block text-xs font-serif text-mystic-gold uppercase tracking-widest">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-mystic-900 border border-stone-700 text-stone-300 rounded p-2 text-sm focus:border-mystic-gold outline-none resize-y font-serif leading-relaxed"
      rows={rows}
    />
  </div>
);

const InputField = ({ label, value, onChange, placeholder = "" }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => (
  <div>
    <label className="block text-[10px] font-serif text-stone-500 uppercase tracking-widest mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-mystic-900 border border-stone-700 text-stone-300 rounded p-2 text-sm focus:border-mystic-gold outline-none"
    />
  </div>
);

const Personal: React.FC<PersonalProps> = ({ character, updateCharacter }) => {
  const p = character.personal;

  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    updateCharacter({
      ...character,
      personal: {
        ...character.personal,
        [field]: value
      }
    });
  };

  const updateArtifact = (field: keyof SoulArtifact, value: string) => {
    updateCharacter({
      ...character,
      personal: {
        ...character.personal,
        soulArtifact: {
          ...character.personal.soulArtifact,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20">
        <h2 className="text-2xl font-serif text-mystic-gold mb-2">Arquivo Pessoal</h2>
        <p className="text-stone-500 text-sm italic">"A memória é a única coisa que realmente possuímos."</p>
      </div>

      {/* Sobre Você */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <TextAreaField label="Sobre Você" value={p.about} onChange={(v) => updatePersonal('about', v)} rows={5} />
      </div>

      {/* Informações Básicas */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-lg font-serif text-mystic-gold border-b border-mystic-gold/10 pb-2 mb-4">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div className="grid grid-cols-3 gap-4">
               <div className="col-span-2">
                 {/* Name is synced with main sheet, but displayed here for consistency with template */}
                 <label className="block text-[10px] font-serif text-stone-500 uppercase tracking-widest mb-1">Nome</label>
                 <div className="w-full bg-mystic-900/50 border border-stone-800 text-stone-400 rounded p-2 text-sm italic">{character.name}</div>
               </div>
               <InputField label="Idade" value={p.age} onChange={(v) => updatePersonal('age', v)} />
             </div>

             <div className="p-3 bg-mystic-900/40 rounded border border-stone-800 space-y-3">
               <span className="text-xs font-bold text-stone-400 uppercase block mb-2">Localização</span>
               <div className="grid grid-cols-2 gap-3">
                 <InputField label="País de Origem" value={p.originCountry} onChange={(v) => updatePersonal('originCountry', v)} />
                 <InputField label="País Atual" value={p.currentCountry} onChange={(v) => updatePersonal('currentCountry', v)} />
                 <InputField label="Cidade de Origem" value={p.originCity} onChange={(v) => updatePersonal('originCity', v)} />
                 <InputField label="Cidade Atual" value={p.currentCity} onChange={(v) => updatePersonal('currentCity', v)} />
               </div>
             </div>
             
             <div className="p-3 bg-mystic-900/40 rounded border border-stone-800 space-y-3">
               <span className="text-xs font-bold text-stone-400 uppercase block mb-2">Linguística</span>
               <InputField label="Língua Nativa" value={p.nativeLanguage} onChange={(v) => updatePersonal('nativeLanguage', v)} />
               <TextAreaField label="Línguas Faladas" value={p.spokenLanguages} onChange={(v) => updatePersonal('spokenLanguages', v)} rows={2} />
             </div>
          </div>

          <div className="space-y-4">
            <InputField label="Profissão Atual" value={p.profession} onChange={(v) => updatePersonal('profession', v)} />
            <TextAreaField label="Parentes" value={p.relatives} onChange={(v) => updatePersonal('relatives', v)} rows={3} />
            <TextAreaField label="Amigos" value={p.friends} onChange={(v) => updatePersonal('friends', v)} rows={3} />
            <TextAreaField label="Adendos (Opcional)" value={p.addendums} onChange={(v) => updatePersonal('addendums', v)} rows={4} />
          </div>
        </div>
      </div>

      {/* Questionário Pessoal */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-lg font-serif text-mystic-gold border-b border-mystic-gold/10 pb-2 mb-6">Questionário Pessoal</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <TextAreaField label="Algo de que você se arrepende:" value={p.regret} onChange={(v) => updatePersonal('regret', v)} rows={2} />
          <TextAreaField label="Seu maior medo (algo completamente irracional):" value={p.fear} onChange={(v) => updatePersonal('fear', v)} rows={2} />
          <TextAreaField label="Um momento em que você se descontrolou:" value={p.lossOfControl} onChange={(v) => updatePersonal('lossOfControl', v)} rows={2} />
          <TextAreaField label="Um ponto em que você deseja melhorar:" value={p.improvement} onChange={(v) => updatePersonal('improvement', v)} rows={2} />
          <TextAreaField label="Algo que você gosta de fazer ou um hobbie:" value={p.hobby} onChange={(v) => updatePersonal('hobby', v)} rows={2} />
          <TextAreaField label="Um momento em que você sentiu desgosto, nojo ou decepção consigo mesmo:" value={p.disgust} onChange={(v) => updatePersonal('disgust', v)} rows={2} />
          <TextAreaField label="Um momento em que você se sentiu orgulhoso de si mesmo:" value={p.pride} onChange={(v) => updatePersonal('pride', v)} rows={2} />
          <TextAreaField label="Um segredo seu:" value={p.secret} onChange={(v) => updatePersonal('secret', v)} rows={2} />
          <TextAreaField label="Sua família e o lugar onde mora ou morava:" value={p.familyAndHome} onChange={(v) => updatePersonal('familyAndHome', v)} rows={3} />
          <TextAreaField label="Pessoas importantes para você e sua relação com elas:" value={p.importantPeople} onChange={(v) => updatePersonal('importantPeople', v)} rows={3} />
          
          <div className="p-4 bg-mystic-900/50 rounded border border-stone-800 space-y-4">
            <label className="block text-xs font-serif text-mystic-gold uppercase tracking-widest">Rumores regionais ou sociais sobre você:</label>
            <div className="space-y-2">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Quais são os rumores?</span>
              <textarea
                value={p.rumors}
                onChange={(e) => updatePersonal("rumors", e.target.value)}
                className="w-full bg-mystic-800 border border-stone-700 text-stone-300 rounded p-2 text-sm focus:border-mystic-gold outline-none resize-y"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-stone-500 uppercase font-bold">São verdadeiros ou falsos?</span>
              <textarea
                value={p.rumorsTruth}
                onChange={(e) => updatePersonal("rumorsTruth", e.target.value)}
                className="w-full bg-mystic-800 border border-stone-700 text-stone-300 rounded p-2 text-sm focus:border-mystic-gold outline-none resize-y"
                rows={2}
              />
            </div>
          </div>

          <TextAreaField label="Um desejo seu:" value={p.desire} onChange={(v) => updatePersonal('desire', v)} rows={2} />
        </div>
      </div>

      {/* Artefato de Alma */}
      <div className="bg-mystic-900 border-2 border-mystic-gold/40 p-6 rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.1)] relative overflow-hidden">
         {/* Decorative Corner */}
         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-mystic-gold/20 to-transparent"></div>
         
         <div className="text-center mb-6">
           <h3 className="text-2xl font-serif text-mystic-gold uppercase tracking-widest">Artefato de Alma</h3>
           <p className="text-[10px] text-stone-500 mt-2 italic max-w-md mx-auto">"A cristalização da espiritualidade remanescente. Esse será o artefato que aparecerá em seu corpo caso o seu personagem morra."</p>
         </div>

         <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-xs font-serif text-mystic-gold uppercase tracking-widest mb-1 text-center">Nome do Artefato</label>
              <input
                type="text"
                value={p.soulArtifact.name}
                onChange={(e) => updateArtifact('name', e.target.value)}
                className="w-full bg-black/40 border-b border-mystic-gold text-center text-xl font-serif text-white p-2 focus:outline-none placeholder-stone-700"
                placeholder="Nome..."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-serif text-stone-400 uppercase tracking-widest">Habilidades</label>
              <div className="w-full h-px bg-stone-700 mb-2"></div>
              <textarea
                value={p.soulArtifact.abilities}
                onChange={(e) => updateArtifact('abilities', e.target.value)}
                className="w-full bg-mystic-800/50 border border-stone-700 text-stone-300 rounded p-3 text-sm focus:border-mystic-gold outline-none h-24"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-serif text-red-400 uppercase tracking-widest">Desvantagem</label>
              <div className="w-full h-px bg-red-900/50 mb-2"></div>
              <textarea
                value={p.soulArtifact.disadvantage}
                onChange={(e) => updateArtifact('disadvantage', e.target.value)}
                className="w-full bg-red-900/10 border border-red-900/30 text-stone-300 rounded p-3 text-sm focus:border-red-500 outline-none h-20"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-serif text-blue-400 uppercase tracking-widest">Método de Selamento</label>
              <div className="w-full h-px bg-blue-900/50 mb-2"></div>
              <textarea
                value={p.soulArtifact.sealingMethod}
                onChange={(e) => updateArtifact('sealingMethod', e.target.value)}
                className="w-full bg-blue-900/10 border border-blue-900/30 text-stone-300 rounded p-3 text-sm focus:border-blue-500 outline-none h-20"
              />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Personal;

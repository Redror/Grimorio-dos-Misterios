import React, { useState } from 'react';
import { Character } from '../types';

interface OriginsProps {
  character: Character;
  updateCharacter: (c: Character) => void;
}

interface OriginBenefit {
  title: string;
  description: string;
  choice?: OriginBenefit[];
}

interface OriginData {
  name: string;
  benefits: OriginBenefit[];
}

const ORIGINS_DATA: OriginData[] = [
  {
    name: "Agente",
    benefits: [
      {
        title: "Transcendente",
        description: "Envolvido em um incidente paranormal, você se viu ingerindo uma característica transcendente sem transformá-lo em uma poção. Você foi resgatado pela sua organização, mas os resquícios da característica serão difíceis de digerir. (+50% de atuação para digerir)."
      },
      {
        title: "Armamento da Purificação",
        description: "Você requisitou da igreja um item místico com uso limitado."
      }
    ]
  },
  {
    name: "Artífice",
    benefits: [
      {
        title: "Eficiência",
        description: "Escolha entre Alquimia e artesanato; SE POSSÍVEL, parte dos componentes não serão perdidos em caso de falha."
      },
      {
        title: "Especialista",
        description: "Escolha um bônus:",
        choice: [
          { title: "Armadilheiro", description: "Suas armadilhas causam um dado a mais, do tipo mais presente, como dano e, em sua maioria, infligem debuffs." },
          { title: "High Tech", description: "Armas feitas com seu Artesanato podem acoplar uma modificação." }
        ]
      }
    ]
  },
  {
    name: "Artista Marcial",
    benefits: [
      {
        title: "Filho de marte",
        description: "Escolha um dos bônus:",
        choice: [
          { title: "Agressivo", description: "A cada acerto em combate, o próximo ataque receberá +2. Este efeito se acumula até três vezes, mas, ao receber dano de qualquer fonte, você perde dois acúmulos." },
          { title: "Defensivo", description: "Você pode usar sua arma média ou grande como um escudo, bloqueando ataques corpo a corpo e projéteis e provendo +4 Bloqueio. Este efeito é válido para apenas uma arma." }
        ]
      }
    ]
  },
  {
    name: "Atirador",
    benefits: [
      {
        title: "Certeiro",
        description: "A cada tiro acertado com sucesso, o próximo tiro ganha +1 de dano de acerto garantido + Porte de arma, acumulando até 2 vezes. (Pequeno: +1, Médio: +2, Grande: +3)."
      },
      {
        title: "Soldado",
        description: "Escolha um dos bônus:",
        choice: [
          { title: "Pistoleiro", description: "(+1 Pontaria, +1 Reflexo). Dedo ágil: Ação padrão para +1 tiro, mas todos os tiros do round têm -3 de vantagem no acerto." },
          { title: "Escopeteiro", description: "(+2 Pontaria, +1 Reflexo). Multiuso: Ação de movimento para coronhada (1d6 concussivo + falha em Const DT 15 gera -5 em testes ofensivos do alvo)." },
          { title: "Franco-atirador", description: "(+1 Pontaria). Mãos hábeis: Recarrega rifle usando ação de movimento ou livre." }
        ]
      }
    ]
  },
  {
    name: "Caçador de Recompensas",
    benefits: [
      {
        title: "Fornecedor",
        description: "Um contato reabastece contratos de abates. Cada cabeça vale 1 libra de ouro por sequência. Máximo de 2 contratos por ato."
      },
      {
        title: "Treino de Caça",
        description: "Treine duas armas à sua escolha e uma perícia de combate."
      }
    ]
  },
  {
    name: "Charlatão",
    benefits: [
      {
        title: "Malandro",
        description: "Sabe quando as pessoas mentem. +2 em testes de Percepção para perceber enganos."
      },
      {
        title: "Manipular",
        description: "Duas vezes por dia, pode rerolar uma jogada de Enganação, Crime, Persuasão ou Diplomacia."
      }
    ]
  },
  {
    name: "Comandante",
    benefits: [
      {
        title: "Cadeia de Comando",
        description: "Duas vezes por cena, ordem ofensiva/defensiva para aliado dá 1d6 no teste de acerto, dano, bloqueio ou esquiva."
      },
      {
        title: "Arte da Guerra",
        description: "Duas vezes por dia, pode rerolar um teste de Diplomacia ou Persuasão."
      }
    ]
  },
  {
    name: "Combatente",
    benefits: [
      {
        title: "Rancoroso",
        description: "Gasta Reação Defensiva para contra-ataque aprimorado. Se seu teste for maior, acerta primeiro e reduz acerto dele em 3."
      },
      {
        title: "Treinamento",
        description: "Treine uma arma branca e arma de fogo (média ou pequena), ambas de portes diferentes."
      }
    ]
  },
  {
    name: "Criminoso",
    benefits: [
      {
        title: "Sem Falhas",
        description: "3 vezes por dia, pode rerolar testes de Crime."
      },
      {
        title: "Mania",
        description: "Ao cometer crime com sucesso, recupera 1 de Sanidade e 1 EE. Mestre decide o crime."
      }
    ]
  },
  {
    name: "Espadachim",
    benefits: [
      {
        title: "Vontade da espada",
        description: "Escolha um dos bônus:",
        choice: [
          { title: "Andarilho", description: "Movimentação: 8 + 2x AGI. Passos rápidos: Adversário tem desvantagem em acerto contra você em movimento." },
          { title: "Espadachim Negro", description: "Sacrifício: Morte brutal com espada grande gera teste de Vontade (Int) DT 10+Intimidação nos hostis próximos (falha gera Medo/Desvantagem). +1 Acerto com Espada Grande." },
          { title: "Duelista", description: "Dose dupla: Espadas causam dado extra (com 2 faces a menos). +1 Acerto com Espada Curta." }
        ]
      }
    ]
  },
  {
    name: "Guarda Costas",
    benefits: [
      {
        title: "Tempo de Reação",
        description: "Uma reação defensiva extra. Pode defender aliado em raio de 4 metros."
      },
      {
        title: "Corpo Robusto",
        description: "+1 Defesa."
      }
    ]
  },
  {
    name: "Investigador Particular",
    benefits: [
      {
        title: "Olhar Afiado",
        description: "Duas vezes por descanso longo, receba +3 em Investigação, Percepção, Diplomacia ou Psicologia."
      },
      {
        title: "Dedução Perspicaz",
        description: "Recupera 2 EE por achar pistas (máximo de 2 casos por Ato)."
      }
    ]
  },
  {
    name: "Médico",
    benefits: [
      {
        title: "Conhecimento Fisiológico",
        description: "Curas dão dado extra ou 1/3 do total bruto. Treinado em Medicina."
      },
      {
        title: "Emergência",
        description: "Uma vez por descanso longo (Ação de Movimento), estabiliza ser morrendo. Se usado em si mesmo, perde efeitos da classe por 2 dias."
      }
    ]
  },
  {
    name: "Ocultista",
    benefits: [
      {
        title: "Cogitação",
        description: "Ação de movimento para teste de resistência contra controle mental/espiritual. Vantagem em resistência enquanto medita. Uso restrito entre descansos."
      },
      {
        title: "Fluxo",
        description: "+1 em testes espirituais durante cogitação."
      },
      {
        title: "Flutuação do Espírito",
        description: "Uma vez por descanso longo, recupera 2 + Nível de EE."
      }
    ]
  },
  {
    name: "Pedinte",
    benefits: [
      {
        title: "Adaptação",
        description: "+2 em Sobrevivência. Resistência parcial a climas extremos e venenos."
      },
      {
        title: "Estômago de Aço",
        description: "Ao se alimentar, recebe benefícios de uma refeição de maior nível."
      }
    ]
  },
  {
    name: "Rato de Periferia",
    benefits: [
      {
        title: "Instintos Urbanos",
        description: "+1 em Furtividade e +1 em Reflexos."
      },
      {
        title: "Boa lábia",
        description: "Pechincha nata: Preços de compra e venda são 25% melhores para você."
      }
    ]
  }
];

const Origins: React.FC<OriginsProps> = ({ character, updateCharacter }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrigins = ORIGINS_DATA.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.benefits.some(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectOrigin = (originName: string) => {
    // We update the origin. We reset originChoice if it's a new origin.
    updateCharacter({ 
      ...character, 
      origin: originName,
      originChoice: character.origin === originName ? character.originChoice : undefined
    });
  };

  const selectChoice = (originName: string, choiceTitle: string) => {
    updateCharacter({ 
      ...character, 
      origin: originName,
      originChoice: choiceTitle 
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20">
        <div>
          <h2 className="text-2xl font-serif text-mystic-gold">Origens e Antecedentes</h2>
          <p className="text-stone-500 text-sm italic">O passado molda o seu destino no nevoeiro.</p>
        </div>
        <div className="relative w-full md:w-64">
           <input 
             type="text"
             placeholder="Buscar origem..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-mystic-800 border border-stone-700 rounded-full px-4 py-2 text-sm focus:border-mystic-gold outline-none text-stone-300"
           />
        </div>
      </div>

      {character.origin && (
        <div className="bg-mystic-gold/10 border border-mystic-gold/40 p-5 rounded-lg flex justify-between items-center shadow-lg">
          <div>
            <span className="text-xs text-mystic-gold uppercase tracking-widest block mb-1 font-bold">Origem Vinculada</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif text-white">{character.origin}</span>
              {character.originChoice && (
                <span className="text-mystic-gold font-serif italic text-sm">- {character.originChoice}</span>
              )}
            </div>
          </div>
          <button 
            onClick={() => updateCharacter({...character, origin: undefined, originChoice: undefined})}
            className="px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30 rounded text-xs transition-colors"
          >
            Mudar Origem
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOrigins.map((origin) => {
          const isSelected = character.origin === origin.name;
          
          return (
            <div 
              key={origin.name} 
              className={`bg-mystic-800 border rounded-lg p-6 transition-all duration-300 relative overflow-hidden group ${
                isSelected 
                  ? 'border-mystic-gold shadow-[0_0_20px_rgba(197,160,89,0.2)] bg-mystic-800/90' 
                  : 'border-stone-800 hover:border-mystic-gold/40 hover:bg-mystic-800/60'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 border-b border-stone-700 pb-3">
                <div className="flex items-center gap-2">
                  {isSelected && <div className="w-2 h-2 rounded-full bg-mystic-gold shadow-[0_0_8px_rgba(197,160,89,1)]"></div>}
                  <h3 className={`text-xl font-serif ${isSelected ? 'text-mystic-gold' : 'text-stone-200'}`}>
                    {origin.name}
                  </h3>
                </div>
                {!isSelected && (
                  <button 
                    onClick={() => selectOrigin(origin.name)}
                    className="text-[10px] px-4 py-1.5 rounded bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/30 hover:bg-mystic-gold hover:text-mystic-900 transition-all font-bold uppercase tracking-widest"
                  >
                    Selecionar
                  </button>
                )}
              </div>

              {/* Benefits Content */}
              <div className="space-y-5">
                {origin.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="space-y-1.5">
                    <h4 className="text-[11px] font-bold text-mystic-gold/80 uppercase tracking-widest">{benefit.title}</h4>
                    <p className="text-sm text-stone-400 leading-relaxed italic">{benefit.description}</p>
                    
                    {benefit.choice && (
                      <div className="mt-3 pl-3 border-l-2 border-mystic-gold/20 space-y-3">
                         <p className="text-[9px] text-stone-600 uppercase font-black tracking-widest">Escolha uma Especialização:</p>
                         <div className="grid gap-2">
                           {benefit.choice.map((c, cIdx) => {
                             const isChoiceSelected = isSelected && character.originChoice === c.title;
                             return (
                               <button 
                                 key={cIdx} 
                                 onClick={() => selectChoice(origin.name, c.title)}
                                 className={`text-left p-3 rounded border transition-all ${
                                   isChoiceSelected 
                                     ? 'bg-mystic-gold/20 border-mystic-gold/50 shadow-inner' 
                                     : 'bg-black/30 border-stone-800 hover:border-mystic-gold/30'
                                 }`}
                               >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className={`text-[11px] font-bold ${isChoiceSelected ? 'text-mystic-gold' : 'text-stone-300'}`}>
                                      {c.title}
                                    </span>
                                    {isChoiceSelected && <span className="text-[8px] text-mystic-gold uppercase font-bold">Ativo</span>}
                                  </div>
                                  <span className="text-[10px] text-stone-500 leading-tight block">{c.description}</span>
                               </button>
                             );
                           })}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Decoration */}
              <div className="absolute -bottom-4 -right-2 opacity-5 pointer-events-none select-none">
                 <span className="text-8xl font-serif italic text-mystic-gold">{origin.name[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Origins;
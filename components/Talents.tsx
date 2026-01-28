
import React, { useState } from 'react';
import { Character, Talent } from '../types';

interface TalentsProps {
  character?: Character; // Optional for backward compatibility but effectively required
  updateCharacter?: (c: Character) => void;
}

const Talents: React.FC<TalentsProps> = ({ character, updateCharacter }) => {
  const [activeTab, setActiveTab] = useState<'genericos' | 'especiais' | 'combate' | 'mundanos'>('genericos');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTalent = (name: string, desc: string, type: Talent['type']) => {
    if (!character || !updateCharacter) return;
    
    // Create new talent object
    const newTalent: Talent = {
      id: Date.now().toString(),
      name,
      description: desc,
      type
    };

    updateCharacter({
      ...character,
      talents: [...(character.talents || []), newTalent]
    });
  };

  const handleRemoveTalent = (id: string) => {
    if (!character || !updateCharacter) return;
    updateCharacter({
      ...character,
      talents: (character.talents || []).filter(t => t.id !== id)
    });
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded text-[10px] font-serif uppercase tracking-widest transition-all ${
        activeTab === id 
          ? 'bg-mystic-gold text-mystic-900 font-bold shadow-[0_0_10px_rgba(197,160,89,0.4)]' 
          : 'bg-mystic-800 text-stone-500 hover:text-stone-300 border border-stone-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Meus Talentos Section (Table like Origem) */}
      {character && (
        <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mystic-gold/5 rounded-bl-full pointer-events-none"></div>
          <h2 className="text-xl font-serif text-mystic-gold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-mystic-gold rounded-full"></span>
            Meus Talentos
          </h2>
          
          {(!character.talents || character.talents.length === 0) ? (
            <p className="text-sm text-stone-500 italic">Nenhum talento adquirido ainda. Explore as opções abaixo.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-700 text-[10px] text-stone-500 uppercase tracking-widest">
                    <th className="py-2 px-3 font-medium">Nome</th>
                    <th className="py-2 px-3 font-medium">Tipo</th>
                    <th className="py-2 px-3 font-medium">Efeito</th>
                    <th className="py-2 px-3 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-stone-300">
                  {character.talents.map((talent) => (
                    <tr key={talent.id} className="border-b border-stone-800/50 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-3 font-bold text-stone-200">{talent.name}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[9px] px-2 py-1 rounded uppercase tracking-wider font-bold ${
                          talent.type === 'Genérico' ? 'bg-stone-700 text-stone-300' :
                          talent.type === 'Especial' ? 'bg-purple-900/40 text-purple-300' :
                          talent.type === 'Combate' ? 'bg-red-900/40 text-red-300' :
                          'bg-blue-900/40 text-blue-300'
                        }`}>
                          {talent.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-stone-400 italic max-w-xs truncate" title={talent.description}>
                        {talent.description}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button 
                          onClick={() => handleRemoveTalent(talent.id)}
                          className="text-red-500 hover:text-red-300 text-xs px-2 py-1 border border-red-900/30 rounded hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif text-mystic-gold mb-2">Talentos & Estilos</h2>
            <p className="text-stone-500 text-sm italic">"A corda da alma de cada indivíduo tem tendências únicas."</p>
          </div>
          <input 
            type="text" 
            placeholder="Buscar talento..." 
            className="w-full md:w-64 bg-mystic-800 border border-stone-700 rounded p-2 text-sm text-stone-300 focus:border-mystic-gold outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6 border-t border-stone-800 pt-4">
          <TabButton id="genericos" label="Genéricos" />
          <TabButton id="especiais" label="Especiais (Caminho)" />
          <TabButton id="combate" label="Estilos de Combate" />
          <TabButton id="mundanos" label="Mundanos" />
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'genericos' && <GenericSection search={searchTerm} onAdd={(n, d) => handleAddTalent(n, d, 'Genérico')} />}
        {activeTab === 'especiais' && <SpecialSection search={searchTerm} onAdd={(n, d) => handleAddTalent(n, d, 'Especial')} />}
        {activeTab === 'combate' && <CombatSection search={searchTerm} onAdd={(n, d) => handleAddTalent(n, d, 'Combate')} />}
        {activeTab === 'mundanos' && <MundaneSection search={searchTerm} onAdd={(n, d) => handleAddTalent(n, d, 'Mundano')} />}
      </div>
    </div>
  );
};

// --- DATA & SUB-COMPONENTS ---

interface SimpleTalent {
  name: string;
  desc: string;
  tags?: string[];
}

interface SectionProps {
  search: string;
  onAdd: (name: string, desc: string) => void;
}

const AddButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="ml-2 text-[10px] bg-mystic-gold/10 hover:bg-mystic-gold text-mystic-gold hover:text-mystic-900 border border-mystic-gold/30 px-2 py-0.5 rounded transition-all uppercase tracking-wider font-bold"
  >
    + Adicionar
  </button>
);

const GENERIC_DATA = {
  low: [
    { name: "Treinamento de Alta Intensidade", desc: "Seu corpo, alma ou mente se fortalecem, provendo +1 ponto de atributo.", tags: ["Acumulável"] },
    { name: "Porte Avantajado", desc: "Seu corpo absorve melhor o benefício das poções. A cada sequência, receba +3 Pv." },
    { name: "Artista Marcial", desc: "Você recebe conhecimento sobre um estilo de combate específico.", tags: ["Acumulável"] },
    { name: "Adquirir Experiência", desc: "Sua mente absorve conhecimento advindo do mundo espiritual. +3 pontos de perícia para distribuir.", tags: ["Acumulável"] },
    { name: "Multitarefas", desc: "Sua velocidade cognitiva aumenta, permitindo usar uma Ação Movimento extra na mesma rodada." },
    { name: "Ímpeto", desc: "Seu desejo por uma luta é amplificado. No começo de um combate, margem de crítico reduzida em 2 pontos, durando um turno." },
    { name: "Técnica de Montagem", desc: "Você se torna instintivamente melhor na criação de itens. Itens de criação economizam 25% dos materiais." },
    { name: "Espiritualidade Forte", desc: "Aumenta sua resistência à marca espiritual remanescente em poções. Reduz a perda de sanidade por avanço de sequência em 2." },
    { name: "Mobilidade", desc: "Recebe +5 metros de Movimentação.", tags: ["Acumulável"] },
    { name: "Poço de Energia", desc: "Aumenta o tamanho de sua alma a cada sequência, permitindo o acúmulo de +3 EE a cada uma delas." },
    { name: "Foco Total", desc: "Você tem vantagem em testes de concentração." }
  ],
  mid: [
    { name: "Poder Concentrado", desc: "Espelha as melhorias genéticas de uma poção em seu próprio corpo e alma, recebendo +2 pontos de atributo." },
    { name: "Resiliência", desc: "Seu corpo se torna mais resistente, provendo resistência a efeitos de controle físicos." },
    { name: "Temperar a Mente", desc: "Você treina a sua mente para discernir o real de ilusões, recebendo resistência a efeitos de controle mental." },
    { name: "Espírito Inabalável", desc: "Fortifica sua alma ao ponto de se tornar resistente a efeitos de controle espirituais." },
    { name: "Tempo de Reação", desc: "Melhora a sua capacidade de reagir ao ambiente à sua volta, permitindo usar uma reação defensiva extra." },
    { name: "Aceleração", desc: "Seu controle sobre o próprio corpo aumenta, fazendo com que maximize a eficiência de seus movimentos para realizar uma Ação de Movimento extra." },
    { name: "Vitalidade Aumentada", desc: "Seu corpo é afetado diretamente pela melhoria da sua afinidade com o mundo místico, provendo duas vezes o seu Vigor como PV.", tags: ["Acumulável"] },
    { name: "Apostador", desc: "Se o dado de dano de um acerto for 1, todo o ataque erra. Se for máximo, o dano daquele dado é dobrado." },
    { name: "Feitiçaria", desc: "Aprende a usar sua afinidade espiritual para melhorar feitiços. Adiciona seu modificador de Espiritualidade ao dano de seus feitiços." },
    { name: "Evasivo", desc: "Receba +1 Defesa.", tags: ["Acumulável"] },
    { name: "Frenesi", desc: "Ao acertar um crítico no DADO, pode realizar outro ataque usando qualquer ação. Se errar, perde 2 de Defesa." },
    { name: "Metabolismo Rápido", desc: "Seu corpo torna-se mais resistente a poções não transcendentes, aumentando a toxicidade máxima a cada descanso em 3." }
  ]
};

const GenericSection = ({ search, onAdd }: SectionProps) => {
  const filter = (list: SimpleTalent[]) => list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-lg mb-4 border-b border-mystic-gold/10 pb-2">Sequência Baixa (9, 8, 7)</h3>
        <div className="space-y-4">
          {filter(GENERIC_DATA.low).map((t, i) => (
            <div key={i} className="group">
              <div className="flex justify-between items-baseline mb-1">
                <div className="flex items-center">
                   <h4 className="text-stone-200 font-bold text-sm group-hover:text-mystic-gold transition-colors">{t.name}</h4>
                   <AddButton onClick={() => onAdd(t.name, t.desc)} />
                </div>
                {t.tags && <span className="text-[9px] bg-stone-900 text-stone-500 px-1 rounded uppercase tracking-wider">{t.tags[0]}</span>}
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-lg mb-4 border-b border-mystic-gold/10 pb-2">Sequência Média (6, 5)</h3>
        <div className="space-y-4">
          {filter(GENERIC_DATA.mid).map((t, i) => (
            <div key={i} className="group">
              <div className="flex justify-between items-baseline mb-1">
                <div className="flex items-center">
                  <h4 className="text-stone-200 font-bold text-sm group-hover:text-mystic-gold transition-colors">{t.name}</h4>
                  <AddButton onClick={() => onAdd(t.name, t.desc)} />
                </div>
                {t.tags && <span className="text-[9px] bg-stone-900 text-stone-500 px-1 rounded uppercase tracking-wider">{t.tags[0]}</span>}
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SPECIAL_DATA = [
  {
    pathway: "Saqueador",
    talents: [
      { name: "Brute-force", desc: "Não importa qual língua, código ou símbolo seja, você consegue compreender, falar e escrever em todos, uma vez que tenha os visto ou ouvido." },
      { name: "Feitiço de Bolso", desc: "Capacidade de roubo aumenta em 1. Pode roubar habilidades já materializadas como Reação Defensiva com teste de Crime." }
    ]
  },
  {
    pathway: "Vidente",
    talents: [
      { name: "Cartola do Mágico", desc: "Uma vez por turno, pode lançar um Truque como Ação Bônus. A cada avanço, melhora uma propriedade de um truque." },
      { name: "Reminiscência", desc: "+2 em testes interpessoais para interpretar alguém cuja aparência tomou. Conhecimento intuitivo sobre intenções concede vantagem em testes contra o indivíduo." }
    ]
  },
  {
    pathway: "Aprendiz",
    talents: [
      { name: "Queima de Energia", desc: "Pode gastar o dobro de EE ao usar um feitiço/habilidade para: +1 dado de dano, dobrar alcance, vantagem no teste ou +5 na DT." },
      { name: "Revisor", desc: "Simplifica habilidades escritas na alma. Gastam metade da Tinta Espiritual (arredondado para baixo)." }
    ]
  },
  {
    pathway: "Monstro",
    talents: [
      { name: "Reserva do Monstro", desc: "Mantém toda Sorte não gasta para o dia seguinte (máximo acúmulo de 1 dia)." },
      { name: "Abate por Acaso", desc: "Ao errar um projétil, jogue 1d4. Se par, o projétil ricocheteia e acerta causando metade do dano (mín 1)." }
    ]
  },
  {
    pathway: "Prisioneiro",
    talents: [
      { name: "Instabilidade Genética", desc: "+6 de tolerância a Bestialidade gerada por mutações." },
      { name: "Supressão Emocional", desc: "Custo: 1d4 dano mental. Encontra fagulha de controle em meio a uma crise para realizar distinções simples." }
    ]
  },
  {
    pathway: "Advogado",
    talents: [
      { name: "Especialista em Contratos", desc: "Habilidades de Distorção em seres racionais dão desvantagem em testes de resistência aos mesmos." },
      { name: "Causas Naturais", desc: "Ao distorcer leis físicas, pode engatilhar uma segunda habilidade de distorção imediatamente em outra lei natural, pagando apenas seu custo." }
    ]
  },
  {
    pathway: "Assassino",
    talents: [
      { name: "Distância Focal", desc: "Qualquer objeto reflexivo conta como espelho se estiver a metade da distância máxima requerida." },
      { name: "Bruxa Má", desc: "A cada sequência (incluindo a atual), pode aprender uma Maldição de força equiparada." }
    ]
  }
];

const SpecialSection = ({ search, onAdd }: SectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
      {SPECIAL_DATA.filter(p => 
        p.pathway.toLowerCase().includes(search.toLowerCase()) || 
        p.talents.some(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
      ).map((p, idx) => (
        <div key={idx} className="bg-mystic-800 p-5 rounded-lg border border-stone-800 relative overflow-hidden">
          <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">{p.pathway}</h3>
          <div className="space-y-4">
            {p.talents.map((t, i) => (
               <div key={i}>
                 <div className="flex items-center mb-1">
                   <h4 className="text-stone-200 font-bold text-sm">{t.name}</h4>
                   <AddButton onClick={() => onAdd(t.name, t.desc)} />
                 </div>
                 <p className="text-xs text-stone-400 leading-relaxed">{t.desc}</p>
               </div>
            ))}
          </div>
          <div className="absolute -bottom-4 -right-2 opacity-5 pointer-events-none text-6xl font-serif text-mystic-gold">
            {p.pathway[0]}
          </div>
        </div>
      ))}
    </div>
  );
};

interface CombatStyle {
  weapon: string;
  styles: {
    name: string;
    talents: { name: string; desc: string }[];
  }[];
}

const COMBAT_DATA: CombatStyle[] = [
  {
    weapon: "Alabarda",
    styles: [
      { name: "Devastador", talents: [{ name: "Ataque Amplo", desc: "Perde intercalar cortante/perfurante. Ataques cortantes acertam cone 180° raio 2m." }] },
      { name: "Mestre de Batalha", talents: [{ name: "Domínio Marcial", desc: "Após ataque Cortante, próximo Perfurante tem margem crit 17 (e vice-versa)." }] }
    ]
  },
  {
    weapon: "Arco e Besta",
    styles: [
      { name: "Ágil", talents: [{ name: "Disparo Rápido", desc: "Realiza disparos igual a Agilidade no mesmo ataque, com -2 em todos os testes." }] },
      { name: "Atirador de Elite", talents: [{ name: "Precisão", desc: "Alcance base +200%. +5 no teste se > 1/4 alcance max, -5 se < 1/4." }] },
      { name: "Caçador", talents: [{ name: "Abater", desc: "Ataques em alvos sob controle físico causam +1 dado de dano." }] },
      { name: "Cauteloso", talents: [{ name: "Distanciamento", desc: "Pode mover metade do deslocamento enquanto dispara arco curto." }] },
      { name: "Estrategista", talents: [{ name: "Criatividade Irrestrita", desc: "Sem desvantagem ao anexar itens na flecha (Ação Livre)." }] }
    ]
  },
  {
    weapon: "Chicote",
    styles: [
      { name: "Controle", talents: [
        { name: "Agarrar", desc: "Teste Luta com Vantagem vs Const+For. Prende alvo (Restrição Física). Ataques futuros acertam auto." },
        { name: "Derrubar", desc: "Ataca pernas. Alvo faz Acrobacia+Agi ou cai (Prostrado/Larga itens)." }
      ]},
      { name: "Lacerar", talents: [{ name: "Ferir", desc: "Dano vira Cortante/Perf. Alvo faz Fortitude (Vigor) DT 10+3xNvl ou ganha Laceração (1d4 dot, vulnerável). Acumula 5x." }] }
    ]
  },
  {
    weapon: "Clava e Bastão",
    styles: [
      { name: "Artista Marcial", talents: [{ name: "Equilíbrio", desc: "Inicio do turno: Aceita -5 Ataque p/ +5 Defesa (ou vice-versa)." }] },
      { name: "Força Bruta", talents: [{ name: "Impacto Total", desc: "Aceita -4 Ataque p/ somar Força no dano novamente." }] }
    ]
  },
  {
    weapon: "Escudo",
    styles: [
      { name: "Corcel", talents: [
        { name: "Aríete Humano", desc: "Movimento + Padrão sem atq oportunidade. Ataque final causa distância como dano." },
        { name: "Incapacitar", desc: "Alvo faz Const+Vigor (DT 5+dano) ou é lançado 3m e cai." }
      ]},
      { name: "Defensor", talents: [
        { name: "Deixa Comigo!", desc: "Usa ação defensiva para bloquear por aliado a até 4m." },
        { name: "Perito em Segurança", desc: "Recebe uma Ação Defensiva extra." }
      ]}
    ]
  },
  {
    weapon: "Espada Curta",
    styles: [
      { name: "Duelista", talents: [
        { name: "Golpe Fatal", desc: "Crítico ignora escudos/bloqueios/resistências e causa Sangramento (1d4 turnos)." },
        { name: "Combate Eficiente", desc: "Ataques perfurantes recebem +1 dado de dano." }
      ]},
      { name: "Empunhadura Dupla", talents: [
        { name: "Corte Cruzado", desc: "Duas espadas: Gasta Movimento p/ ataque extra com -2." },
        { name: "Coordenação", desc: "Deflete com reação (Teste Luta vs Atq). Se ganhar, faz ataque normal." }
      ]},
      { name: "Trapaceiro", talents: [
        { name: "Jogo Sujo", desc: "Mão livre usa Ação Livre p/ itens/habilidades de ação padrão." },
        { name: "Rasteira", desc: "Gasta Movimento p/ derrubar (Teste Luta)." }
      ]}
    ]
  },
  {
    weapon: "Espada Grande",
    styles: [
      { name: "Berserk", talents: [{ name: "Ataque/Defesa", desc: "+6 Ataque / -6 Defesa. +1 Letalidade enquanto ativo." }] },
      { name: "Condicionamento", talents: [
        { name: "Poder do Estilo", desc: "Considera Espada Grande como Curta (mantém mult)." },
        { name: "Movimentos Improváveis", desc: "Após ataque, faz estocada bônus (Alcance dobrado, move metade)." }
      ]},
      { name: "Mestre de Guerra", talents: [
        { name: "Ataque Amplo", desc: "Ataca arco 180°. Dano reduz 2 a cada alvo extra." },
        { name: "Concentrar Poder", desc: "Acertar alvo único dá +1 dado de dano." }
      ]}
    ]
  },
  {
    weapon: "Espingarda",
    styles: [
      { name: "Atirador Defensivo", talents: [
        { name: "Contra-disparo", desc: "Esquiva/Bloqueio com sucesso permite contra-ataque." },
        { name: "Treinamento", desc: "Sem desvantagem em pontaria por usar escudo." }
      ]},
      { name: "Tático", talents: [{ name: "Preparação", desc: "Usa arma pequena/média ou item na outra mão. +2 em ambas. Item consumível vira Ação Bônus." }] }
    ]
  },
  {
    weapon: "Faca",
    styles: [
      { name: "Arremessador", talents: [{ name: "Precisão Múltipla", desc: "Arremessa +1 faca por ponto de Destreza." }] },
      { name: "Assassino", talents: [
        { name: "Letal", desc: "Atacar desprevenido é Crit Auto. Críticos causam Paralisia (DT 15+Agi) e +2 dados dano." },
        { name: "Aproveitar-se", desc: "Atacar flanqueado dá +2 Letalidade." }
      ]},
      { name: "Tático", talents: [
        { name: "Combate Versátil", desc: "Empunha arma secundária sem desvantagem. Pode atacar com ela (+2 teste)." },
        { name: "Desengajar", desc: "Ao afastar, chuta (1d4, empurra 3m). Sem teste se acertou últimos 2 ataques." }
      ]}
    ]
  },
  {
    weapon: "Lança",
    styles: [
      { name: "Devastador", talents: [
        { name: "Devastar", desc: "Ataca cone 180° raio 3m. Dano +1d6 por criatura acertada." },
        { name: "Destruidor", desc: "+1 Luta p/ cada alvo acertado no último ataque." }
      ]},
      { name: "Empalador", talents: [
        { name: "Laceração", desc: "Perfuração c/ dano max causa Sangramento (8T). Acumula 4x." },
        { name: "Acumular Feridas", desc: "Vantagem no dano contra alvos Sangrando." }
      ]},
      { name: "Golpeador", talents: [
        { name: "Golpes Consecutivos", desc: "Crítico no DADO permite atacar novamente com qualquer ação." },
        { name: "Coordenação", desc: "+1 Letalidade." }
      ]}
    ]
  },
  {
    weapon: "Machado",
    styles: [
      { name: "Arremessador", talents: [{ name: "Lançamento Pesado", desc: "Arremesso causa dobro de dano." }] },
      { name: "Machados Duplos", talents: [{ name: "Corte Duplo", desc: "Gasta Movimento p/ segundo ataque." }] }
    ]
  },
  {
    weapon: "Machado Grande",
    styles: [
      { name: "Executor", talents: [
        { name: "Decretar", desc: "Crítico automático em imobilizados." },
        { name: "Executar", desc: "1/dia: Causa dano máximo em um crítico." }
      ]},
      { name: "Perseguidor", talents: [
        { name: "Sem Piedade", desc: "Troca Movimento por Bônus+Livre p/ arremessar (5+2xFor m). +5 Letalidade." },
        { name: "Força Centrípeta", desc: "Arremesso causa +1 dado dano. Crítico por arremesso +1 dado extra." }
      ]}
    ]
  },
  {
    weapon: "Punhos",
    styles: [
      { name: "Brutamontes", talents: [{ name: "Subjugar", desc: "Dano vira 1.5x For (ou 2x gastando Movimento). Se gastar Mov, crit 17." }] },
      { name: "Pugilista", talents: [{ name: "Barragem", desc: "Força não soma dano. Acerto desfere golpes igual metade da Agi. Dano rolado individualmente." }] }
    ]
  },
  {
    weapon: "Revólver",
    styles: [
      { name: "Duelista", talents: [
        { name: "Mano a Mano", desc: "Foco mútuo dá +1 DADO e +1 dado dano (maior)." },
        { name: "Esvaziar Tambor", desc: "Crítico permite atacar novamente com -1 acumulativo." }
      ]},
      { name: "Empunhadura Dupla", talents: [
        { name: "Pistoleiro", desc: "2 Revólveres: Ação Padrão dispara ambos com +2." },
        { name: "Alvos Gêmeos", desc: "Troca Movimento por Padrão para atacar outro alvo." }
      ]},
      { name: "Evasor", talents: [
        { name: "Disparo Preventivo", desc: "DADO > 10 dá desvantagem física ao alvo e tira Movimento dele." },
        { name: "Agilidade", desc: "Movimento extra. Se usar todo mov, +3 atq." }
      ]},
      { name: "Saque Rápido", talents: [
        { name: "Saque Rápido", desc: "Ação Bônus troca arma e ataca (requer slot)." },
        { name: "Sempre Pronto", desc: "+3 Iniciativa." },
        { name: "Proativo", desc: "Primeiro ataque em combate é Crítico." }
      ]}
    ]
  },
  {
    weapon: "Rifle de Precisão",
    styles: [
      { name: "Atirador de Elite", talents: [{ name: "Headshot", desc: "1/combate: Se furtivo, Crítico Auto. Distância 2x, Dano 1.5x." }] },
      { name: "Cadência", talents: [{ name: "Mãos Ágeis", desc: "Recarrega como Ação Bônus (requer slot tático)." }] }
    ]
  }
];

const CombatSection = ({ search, onAdd }: SectionProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {COMBAT_DATA.filter(w => 
         w.weapon.toLowerCase().includes(search.toLowerCase()) || 
         w.styles.some(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.talents.some(t => t.name.toLowerCase().includes(search.toLowerCase())))
      ).map((w, idx) => (
        <div key={idx} className="bg-mystic-800 p-5 rounded-lg border border-stone-800">
          <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">{w.weapon}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {w.styles.map((style, sIdx) => (
              <div key={sIdx} className="bg-mystic-900/50 p-3 rounded border border-stone-700/50">
                 <h4 className="text-stone-300 font-bold uppercase tracking-widest text-xs mb-3">{style.name}</h4>
                 <div className="space-y-3">
                   {style.talents.map((t, tIdx) => (
                     <div key={tIdx}>
                       <div className="flex items-center">
                          <span className="text-mystic-gold font-bold text-xs">{t.name}: </span>
                          <AddButton onClick={() => onAdd(t.name, t.desc)} />
                       </div>
                       <span className="text-xs text-stone-400">{t.desc}</span>
                     </div>
                   ))}
                 </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MUNDANE_DATA: SimpleTalent[] = [
  { name: "Micro-precisão", desc: "+2 para procedimentos delicados (cirurgias, etc)." },
  { name: "Batedor de Carteira", desc: "+2 para roubar itens em bolsos sem ser percebido." },
  { name: "Concentração", desc: "Gasta Ação de Movimento para receber +2 no próximo teste." },
  { name: "Faro", desc: "Pode descobrir propriedades químicas de substâncias pelo odor." },
  { name: "Arco-reflexo", desc: "Quase sempre acerta primeiro em um contra-ataque." },
  { name: "Mentiroso", desc: "+2 em testes de Enganação." },
  { name: "Destreza com Espadas", desc: "Críticos com espadas dão um dado a mais de um número de faces menor (ex: 1d8 vira 1d6)." },
  { name: "Mestre Cuca", desc: "Refeições recuperam 1d6 a mais em um atributo. Se tirar 20, recupera Sanidade." },
  { name: "Apenas Beleza", desc: "+2 em testes influenciados pela aparência." },
  { name: "Corpo Aberto", desc: "Deficiência que expõe o Corpo Espiritual. Pode ver/ouvir seres de outros planos ocasionalmente." },
  { name: "Perspectiva", desc: "Pode adicionar Psicologia em testes para perceber/investigar alvos sobre os quais tem informação." },
  { name: "Coordenação", desc: "Ao sofrer contra-ataque, usa reação defensiva e continua a ação." },
  { name: "Facilidade Marcial", desc: "Talento natural raro. Escolha um Estilo Marcial para aprender." }
];

const MundaneSection = ({ search, onAdd }: SectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
       {MUNDANE_DATA.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())).map((t, i) => (
         <div key={i} className="bg-mystic-800 p-4 rounded border border-stone-800 hover:border-mystic-gold/20 transition-all">
           <div className="flex justify-between items-start mb-2">
              <h4 className="text-stone-200 font-bold text-sm">{t.name}</h4>
              <AddButton onClick={() => onAdd(t.name, t.desc)} />
           </div>
           <p className="text-xs text-stone-400 leading-relaxed">{t.desc}</p>
         </div>
       ))}
    </div>
  );
};

export default Talents;

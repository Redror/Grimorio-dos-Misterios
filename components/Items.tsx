import React, { useState } from 'react';

interface ItemEntry {
  name: string;
  category: string;
  subCategory?: string;
  stats?: string;
  damage?: string;
  range?: string;
  crit?: string;
  description: string;
  requirement?: string;
  penalty?: string;
}

interface ItemsProps {
  onAddItem: (name: string, fullDescription: string) => void;
}

const ITEMS_DATA: ItemEntry[] = [
  // WEAPONS - AGILITY
  { name: "Arco", category: "Armas", subCategory: "Agilidade", damage: "1D6 + 1D4 Perfurante", stats: "Peso 2", range: "40m + 4x Pontaria", crit: "(18) 2D6 + 4", description: "Gasta ação de Movimento para recarregar." },
  { name: "Faca (Metal)", category: "Armas", subCategory: "Agilidade", damage: "1D6 Cortante/Perfurante", range: "0,5m / 10m + 2x Pontaria", crit: "(18) AgiD4 + Agi", description: "Lâmina versátil para combate próximo ou arremesso." },
  { name: "Revolver", category: "Armas", subCategory: "Agilidade", damage: "1D6 Perfurante", range: "30m + 3x Pontaria", crit: "(18) 3D4", description: "Disparo requer Ação Padrão." },
  { name: "Rifle de Caça", category: "Armas", subCategory: "Agilidade", damage: "2D10 Perfurante", range: "60m + 5x Pontaria", crit: "(18) 3D10", description: "Ação Completa p/ +2 no Dado. Requer Ação Padrão para recarregar." },
  { name: "Espingarda", category: "Armas", subCategory: "Agilidade", damage: "3D6 (3 instâncias)", range: "12m", crit: "(15, 1m) 5D6 (4 instâncias)", description: "Dano reduz 1D6 a cada 3m após os 3m iniciais. Recarga: Ação Padrão." },
  { name: "Besta", category: "Armas", subCategory: "Agilidade", damage: "2D4 Perfurante", range: "30m + 3x Pontaria", crit: "(19) 4D6", description: "Atirar: Ação Padrão. Recarregar: Movimento." },
  { name: "Chicote (Couro)", category: "Armas", subCategory: "Agilidade", damage: "1D6 Impacto", range: "4m", crit: "(18) 2D4 + Agi", description: "Se o alvo falhar em CON+Vigor, recebe Agi extra como dano e Laceração." },
  { name: "Chicote (Ponta Metal)", category: "Armas", subCategory: "Agilidade", damage: "1D8 Impacto", range: "4m", crit: "(19) 2D6 + Agi", description: "Se falhar CON+Vigor, +Agi de dano. Crítico garante 2 Lacerações." },
  { name: "Espada Curta", category: "Armas", subCategory: "Agilidade", damage: "1D8 Cortante/Perfurante", range: "1,5m / 7m", crit: "(18) 2D6 + Agl", description: "Uso em Ação Padrão." },
  { name: "Lança", category: "Armas", subCategory: "Agilidade", damage: "1D8 Cortante/Perfurante", range: "2,5m / 8m + Pontaria", crit: "(18) 2D6 + Agl", description: "Arremessável." },
  
  // WEAPONS - STRENGTH
  { name: "Espada Grande", category: "Armas", subCategory: "Força", damage: "2D6 (Padrão+Mov) ou 1D8 (Padrão)", range: "2m", crit: "(19) 3D6 + For", description: "Cortante/Perfurante. Requer força bruta." },
  { name: "Machadinha", category: "Armas", subCategory: "Força", damage: "1D8 + For", range: "1,5m / 8m + Pontaria", crit: "(18) 2D6 + For", description: "Arremessável (causa +1D3 de dano no arremesso)." },
  { name: "Machado Grande", category: "Armas", subCategory: "Força", damage: "1D12 (Padrão+Mov) ou 1D8 (Padrão)", range: "1,5m", crit: "(20) 2D12 + For", description: "Impacto massivo. Dano Cortante." },
  { name: "Alabarda", category: "Armas", subCategory: "Força", damage: "1D8 + For", range: "2m", crit: "(20) 1D20 + For", description: "Alterne Cortante/Perfurante para causar 1D12+For no próximo golpe." },
  { name: "Bastão (Madeira)", category: "Armas", subCategory: "Força", damage: "1D3 + For", range: "Variável", crit: "(18) 2D3 + For", description: "Dano de Impacto simples." },
  { name: "Clava (Metal)", category: "Armas", subCategory: "Força", damage: "1D8 + For", range: "1,5m", crit: "(18) 1D8 + 2x For", description: "Dano de Impacto pesado." },

  // HYBRID
  { name: "Mãos (Desarmado)", category: "Armas", subCategory: "Híbrido", damage: "1 + Força", crit: "(18) Dano Duplo", description: "Impacto. Críticos requerem 18 natural." },
  { name: "Soco Inglês / Manoplas", category: "Armas", subCategory: "Híbrido", damage: "+1D4 Impacto", crit: "(18) 1D6", description: "Adicional ao dano desarmado." },

  // NEUTRAL / SHIELDS
  { name: "Escudo (Madeira)", category: "Armas", subCategory: "Neutro", stats: "+2 Bloqueio, +1 RD Físico", description: "Bloqueia Elétrico e manifestações espirituais materiais. Veneno negado." },
  { name: "Escudo (Metal)", category: "Armas", subCategory: "Neutro", stats: "+3 Bloqueio, +2 RD Físico, +1 DEF", description: "Danos Elétricos penetram. Veneno negado." },

  // ARMORS - LIGHT
  { name: "Armadura de Couro", category: "Armaduras", subCategory: "Leve", requirement: "Força 1", penalty: "-1 CA", stats: "RD Física 3", description: "Proteção leve padrão." },
  { name: "Tecido de Malha Fina (Amerita)", category: "Armaduras", subCategory: "Leve", requirement: "Força 1", penalty: "-1 CA", stats: "RD Cortante 4, Física 2, +2 Persuasão", description: "Igreja do Vapor. Tecido de cor latão e aura de bem-estar." },
  { name: "Traje de Escamas (Peixe Tigre)", category: "Armaduras", subCategory: "Leve", requirement: "Força 1", penalty: "-1 CA", stats: "RD Concussivo 4, Física 2, +2 Constituição", description: "Igreja das Tempestades. Absorve impactos." },
  { name: "Terno de Fibra Escura (Lobo Negro)", category: "Armaduras", subCategory: "Leve", requirement: "Força 1", penalty: "-1 CA", stats: "RD Perfurante 4, Física 2, +2 Furtividade", description: "Igreja da Noite Eterna. Requinte e modernidade." },

  // ARMORS - MEDIUM
  { name: "Malha Metálica", category: "Armaduras", subCategory: "Média", requirement: "Força 2", penalty: "-3 CA, -3 Mov", stats: "RD Física 6", description: "Armadura média equilibrada." },
  { name: "Colete Balístico (Abelha Atroz)", category: "Armaduras", subCategory: "Média", requirement: "Força 2", penalty: "-3 CA, -3 Mov", stats: "RD Perfurante 6, Física 3", description: "Igreja Mãe Terra. Gel denso desacelera projéteis. Afasta insetos." },
  { name: "Casaco Acolchoado (Cabra Aríete)", category: "Armaduras", subCategory: "Média", requirement: "Força 2", penalty: "-3 CA, -3 Mov", stats: "RD Concussiva 6, Físico 3", description: "Igreja do Combate. Alta resistência e isolamento térmico (Frio)." },
  { name: "Placa de Radônio", category: "Armaduras", subCategory: "Média", requirement: "Força 2", penalty: "-3 CA, -3 Mov", stats: "RD Cortante 6, Física 3", description: "Liga espelhada. Reflete toda a luz. Proteção estratégica contra cortes." },

  // ARMORS - HEAVY
  { name: "Armadura de Placas", category: "Armaduras", subCategory: "Pesada", requirement: "Força 3", penalty: "-5 CA, -3 Mov", stats: "RD Física 8", description: "Proteção máxima pesada." },
  { name: "Manto de Caça (Urso Cobre)", category: "Armaduras", subCategory: "Pesada", requirement: "Força 3", penalty: "-5 CA, -3 Mov", stats: "RD Perfurante 8, Física 4, +2 Intimidação", description: "Afasta predadores normais, mas pode atrair ursos-cobre." },
  { name: "Túnica Cerimonial (Condor Albo)", category: "Armaduras", subCategory: "Pesada", requirement: "Força 3", penalty: "-5 CA, -3 Mov", stats: "RD Concussiva 8, Física 4", description: "Estilo sulista. Penas de Condor Albo fornecem resistência degenerativa." },
  { name: "Placas de Cinetita", category: "Armaduras", subCategory: "Pesada", requirement: "Força 3", penalty: "-5 CA, -3 Mov", stats: "RD Concussiva 8, Física 4", description: "Igreja do Vapor. Absorve energia mecânica. Imune a movimento forçado." },

  // MODS
  { name: "Cano Estendido", category: "Modificações", description: "Duplica a distância do disparo." },
  { name: "Mira de Precisão", category: "Modificações", description: "+2 em testes de Pontaria." },
  { name: "Tambor Baixa Milimetragem (Rev.)", category: "Modificações", description: "+3 balas no revólver. Disparos ignoram 1 Redução Perfurante." },
  { name: "Porta Balas (Rifle)", category: "Modificações", description: "Até 3 balas prontas para recarga rápida." },
  { name: "Alto Calibre", category: "Modificações", description: "+1 Dado de dano (tipo presente). Recuo impõe -4 no teste." },
  { name: "Bayonetta", category: "Modificações", description: "Lâmina acoplada. Estocada: 1d6 perf. Crit 18: 2d6 + Agi." },
  { name: "Afiação Sutil (Corte)", category: "Modificações", description: "+1 Dado de dano. Perde bônus após 10 acertos. Degrada fio após mais 10." },
  { name: "Alta Densidade (Impacto)", category: "Modificações", description: "+1D6 dano em armas médias/grandes. Manuseio difícil (-2 em testes)." },

  // MISC
  { name: "Dinamite", category: "Diversos", stats: "2 PI", description: "4D6 Impacto/Ígneo (6m). 1D6 até 10m. 2 turnos p/ explodir." },
  { name: "Kit Alquímico", category: "Diversos", stats: "3 PI", description: "Permite criar itens. 10 pts materiais iniciais. Dura até Erro Crítico." },
  { name: "Kit Médico", category: "Diversos", stats: "3 PI", description: "+5 Medicina p/ estabilizar. Cura 2D6 (DT 13). Ação Completa." },
  { name: "Veneno Simples", category: "Diversos", stats: "2 PI", description: "2 cargas. Aplica Envenenamento Leve (6 ataques). -5 ou -10 em perf." },
  { name: "Cogumelo Frank", category: "Diversos", stats: "5 PI", description: "Cura PV total e tira de Morrendo. Altamente duvidoso!" },
  { name: "Gazua", category: "Diversos", stats: "1 PI", description: "+5 em arrombamento. 6 cargas de durabilidade." },

  // BOOKS
  { name: "Flora de Loen", category: "Livros", stats: "2 PI", description: "1D4 p/ identificar plantas não transcendentes." },
  { name: "Arqueologia Avançada (Roselle)", category: "Livros", stats: "2 PI", description: "+2 História e Geografia. Localiza catacumbas." },
  { name: "Lendas e Mitos (Roselle)", category: "Livros", stats: "2 PI", description: "+4 Criptozoologia (Biologia)." },
  { name: "Loen Real (Fofocas)", category: "Livros", stats: "1 PI", description: "+4 em Atualidades. Atualizar semanalmente." }
];

const Items: React.FC<ItemsProps> = ({ onAddItem }) => {
  const [activeSubTab, setActiveSubTab] = useState('Armas');
  const [search, setSearch] = useState('');

  const filtered = ITEMS_DATA.filter(item => 
    item.category === activeSubTab && 
    (item.name.toLowerCase().includes(search.toLowerCase()) || 
     item.description.toLowerCase().includes(search.toLowerCase()))
  );

  const formatFullDescription = (item: ItemEntry) => {
    const parts = [];
    if (item.subCategory) parts.push(`[${item.subCategory}]`);
    if (item.damage) parts.push(`Dano: ${item.damage}`);
    if (item.range) parts.push(`Alcance: ${item.range}`);
    if (item.crit) parts.push(`Crítico: ${item.crit}`);
    if (item.requirement) parts.push(`Requisito: ${item.requirement}`);
    if (item.penalty) parts.push(`Penalidade: ${item.penalty}`);
    if (item.stats) parts.push(`Stats: ${item.stats}`);
    parts.push(`Descrição: ${item.description}`);
    return parts.join(' | ');
  };

  const categories = ["Armas", "Armaduras", "Modificações", "Diversos", "Livros", "Artefatos"];

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif text-mystic-gold">Catálogo de Itens</h2>
            <p className="text-stone-500 text-sm italic">"Para cada problema, uma ferramenta. Para cada mistério, um preço."</p>
          </div>
          <input 
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-mystic-800 border border-stone-700 rounded-full px-4 py-2 text-sm text-stone-300 focus:outline-none focus:border-mystic-gold"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-6 border-t border-stone-800 pt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveSubTab(cat)}
              className={`px-4 py-2 rounded text-[10px] font-serif uppercase tracking-widest transition-all ${
                activeSubTab === cat ? 'bg-mystic-gold text-mystic-900 font-bold' : 'bg-mystic-800 text-stone-500 hover:text-stone-300 border border-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSubTab === 'Artefatos' ? (
          <div className="col-span-full space-y-4">
            <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/40 shadow-xl">
               <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/20 pb-2">Regras de Artefatos Selados</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm leading-relaxed text-stone-300">
                 <div className="space-y-4">
                    <p><strong className="text-mystic-gold">Limites de Capacidade:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><span className="text-white">Pessoas Comuns:</span> 1 Item Místico/Artefato.</li>
                      <li><span className="text-white">Beyonders:</span> Máximo de 2 Artefatos. Armamentos (Itens Místicos) contam como "Meio Artefato".</li>
                    </ul>
                    <div className="p-3 bg-red-900/10 border border-red-900/30 rounded italic text-red-400 text-xs">
                      Carregar mais que o limite sobrecarrega o corpo e alma, resultando em morte catastrófica ou perda de controle.
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-mystic-gold font-bold uppercase text-xs tracking-widest">Graus de Perigo</h4>
                    <ul className="space-y-3">
                       <li className="flex gap-2"><span className="text-green-500 font-bold">Grau 3:</span> <span>"Perigosos". Confiados a times de 3+ membros.</span></li>
                       <li className="flex gap-2"><span className="text-yellow-500 font-bold">Grau 2:</span> <span>"Consideravelmente Perigosos". Uso por Capitães ou Bispos.</span></li>
                       <li className="flex gap-2"><span className="text-orange-500 font-bold">Grau 1:</span> <span>"Altamente Perigosos". Restrito a casos especiais e Diáconos.</span></li>
                       <li className="flex gap-2"><span className="text-mystic-corruption font-bold animate-pulse">Grau 0:</span> <span>"Perigo Extremo". Confidencialidade máxima. Mudam a geopolítica mundial.</span></li>
                    </ul>
                 </div>
               </div>
            </div>
            
            <div className="p-4 bg-mystic-900/50 border border-stone-800 rounded italic text-xs text-stone-500 text-center">
              "Todo artefato tem um número, por exemplo: O Artefato 02-125 (Grau 2, No. 125)."
            </div>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.name} className="bg-mystic-800 p-4 rounded border border-stone-800 hover:border-mystic-gold/20 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-mystic-gold font-serif font-bold">{item.name}</h4>
                    <span className="text-[9px] text-stone-600 uppercase tracking-widest">{item.subCategory}</span>
                  </div>
                  {item.damage && <span className="text-red-400 font-mono text-xs font-bold">{item.damage}</span>}
                </div>
                
                <p className="text-[11px] text-stone-300 leading-snug mb-3 italic">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] text-stone-500 mb-4 uppercase font-bold">
                  {item.range && <div><span className="text-stone-700">Alc:</span> {item.range}</div>}
                  {item.crit && <div><span className="text-stone-700">Crit:</span> {item.crit}</div>}
                  {item.stats && <div><span className="text-stone-700">Obs:</span> {item.stats}</div>}
                  {item.requirement && <div><span className="text-stone-700">Req:</span> {item.requirement}</div>}
                  {item.penalty && <div className="col-span-2"><span className="text-red-900">Penalidade:</span> {item.penalty}</div>}
                </div>
              </div>
              
              <button 
                onClick={() => onAddItem(item.name, formatFullDescription(item))}
                className="w-full mt-auto bg-mystic-gold/5 border border-mystic-gold/20 text-mystic-gold text-[10px] font-bold py-2 rounded uppercase tracking-widest hover:bg-mystic-gold hover:text-mystic-900 transition-all"
              >
                + Adicionar ao Inventário
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Items;
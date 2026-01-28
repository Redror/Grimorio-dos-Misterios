import React, { useState } from 'react';

const Rituals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fundamentos' | 'grimorio' | 'feiticaria'>('fundamentos');

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
      {/* Header */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20">
        <h2 className="text-2xl font-serif text-mystic-gold mb-2">Rituais & Ocultismo</h2>
        <p className="text-stone-500 text-sm italic">"Magia ritualística é algo muito perigoso. O preço é sempre cobrado."</p>
        
        <div className="flex flex-wrap gap-2 mt-6 border-t border-stone-800 pt-4">
          <TabButton id="fundamentos" label="Fundamentos" />
          <TabButton id="grimorio" label="Grimório de Rituais" />
          <TabButton id="feiticaria" label="Feitiçaria (Sistema)" />
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'fundamentos' && <FundamentalsSection />}
        {activeTab === 'grimorio' && <GrimoireSection />}
        {activeTab === 'feiticaria' && <SpellsSection />}
      </div>
    </div>
  );
};

const FundamentalsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
    <div className="space-y-6">
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Introdução</h3>
        <p className="text-stone-300 text-sm leading-relaxed mb-4">
          A Magia Ritualística abrange uma ampla variedade de rituais longos, elaborados e complexos. Para pessoas comuns, depende de astromancia e horários precisos. Para Beyonders, a <strong>Visão Espiritual</strong> e <strong>Projeções Astrais</strong> são as chaves.
        </p>
        <div className="bg-mystic-900/50 p-4 rounded border-l-2 border-red-900">
          <p className="text-xs text-stone-400 italic">"De acordo com Velho Neil, Beyonders de Baixa Sequência não são fortes o suficiente. Quase toda a magia que podem realizar é a busca de poderes externos."</p>
        </div>
      </div>

      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Estrutura do Ritual</h3>
        <ul className="space-y-3 text-sm text-stone-300">
          <li className="flex gap-3">
            <span className="text-mystic-gold font-bold">1.</span>
            <span><strong>Sacrifício:</strong> Desperta o interesse da existência correspondente.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-mystic-gold font-bold">2.</span>
            <span><strong>Encantamentos:</strong> Descrevem especificamente a existência (Nome Honorífico).</span>
          </li>
          <li className="flex gap-3">
            <span className="text-mystic-gold font-bold">3.</span>
            <span><strong>Símbolos:</strong> Formatação simples para transmitir o pedido.</span>
          </li>
        </ul>
      </div>

      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Numerologia (Ordem Ascética)</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-black/20 rounded border border-stone-700">
            <span className="text-2xl font-serif text-mystic-gold block">0</span>
            <span className="text-[10px] uppercase text-stone-500 tracking-widest">Caos / Desconhecido</span>
          </div>
          <div className="p-3 bg-black/20 rounded border border-stone-700">
            <span className="text-2xl font-serif text-mystic-gold block">1</span>
            <span className="text-[10px] uppercase text-stone-500 tracking-widest">Criador / Começo</span>
          </div>
          <div className="p-3 bg-black/20 rounded border border-stone-700">
            <span className="text-2xl font-serif text-mystic-gold block">2</span>
            <span className="text-[10px] uppercase text-stone-500 tracking-widest">Mundo / Divindades</span>
          </div>
          <div className="p-3 bg-black/20 rounded border border-stone-700">
            <span className="text-2xl font-serif text-mystic-gold block">3</span>
            <span className="text-[10px] uppercase text-stone-500 tracking-widest">Todas as Coisas</span>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Preparação do Altar</h3>
        <div className="space-y-4 text-sm text-stone-300">
          <p>O ambiente deve ser "espiritualmente limpo". Não requer solenidade sagrada, mas não pode haver itens diversos atrapalhando.</p>
          
          <div className="space-y-2">
            <h4 className="text-mystic-gold text-xs uppercase font-bold mt-4">Materiais Essenciais</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="bg-mystic-900 px-2 py-1 rounded border border-stone-700">Adaga de Metal Puro (Prata/Latão)</span>
              <span className="bg-mystic-900 px-2 py-1 rounded border border-stone-700">Velas (Ingredientes da Divindade)</span>
              <span className="bg-mystic-900 px-2 py-1 rounded border border-stone-700">Óleos Essenciais / Extratos</span>
              <span className="bg-mystic-900 px-2 py-1 rounded border border-stone-700">Pós de Ervas</span>
            </div>
          </div>

          <div className="space-y-2">
             <h4 className="text-mystic-gold text-xs uppercase font-bold mt-4">Execução</h4>
             <ul className="list-disc pl-4 space-y-1 text-xs text-stone-400">
               <li>Entrar em <strong>Cogitação</strong>.</li>
               <li>Construir a <strong>Parede de Espiritualidade</strong> com a adaga.</li>
               <li>Acender velas da <strong>Esquerda para a Direita</strong> (Deus &rarr; Eu).</li>
               <li>Recitar encantamento em <strong>Hermes</strong>.</li>
               <li>Ao fim: Apagar velas da <strong>Direita para a Esquerda</strong> (Eu &rarr; Deus) e dissipar parede.</li>
             </ul>
          </div>
        </div>
      </div>

      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Sacrifícios</h3>
        <p className="text-xs text-stone-400 mb-4">Alguns rituais exigem mais do que ervas. A eficácia aumenta com a potência do sacrifício.</p>
        <div className="flex flex-col gap-2">
           <div className="flex justify-between items-center p-2 bg-black/20 rounded">
              <span className="text-sm text-stone-300">Pessoas Comuns</span>
              <span className="text-xs text-stone-500">3º Melhor</span>
           </div>
           <div className="flex justify-between items-center p-2 bg-black/20 rounded border border-stone-700">
              <span className="text-sm text-mystic-gold">Criaturas Beyonder</span>
              <span className="text-xs text-stone-500">2º Melhor</span>
           </div>
           <div className="flex justify-between items-center p-2 bg-red-900/10 rounded border border-red-900/30">
              <span className="text-sm text-red-400 font-bold">Semideuses</span>
              <span className="text-xs text-red-900">O Melhor</span>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const GrimoireSection = () => {
  const [filter, setFilter] = useState('');

  const RITUALS = [
    {
      name: "Ritual de Oração à Divindade",
      desc: "O modelo ritual padrão no misticismo para obter um pouco da atenção de uma divindade para conduzir magias."
    },
    {
      name: "Ritual de 'IOU' (Velho Neil)",
      desc: "Usado para pagar dívidas espirituais. Utiliza 3 velas (Baunilha Noturna, Flor da Lua, Vela comum com hortelã) para a Deusa da Noite Eterna.",
      quote: "Usarei magia para quitar essa dívida de trinta libras hoje."
    },
    {
      name: "Sifão do Destino (Colin Iliad)",
      desc: "Criação de amuletos usando Vermes do Tempo. Requer esculpir recipiente de amuleto, mercúrio líquido e oração ao Louco.",
      quote: "Prova de Glória."
    },
    {
      name: "Ritual de Santificação",
      desc: "Limpa e purifica um item para uso místico (ex: adaga de prata). Usa sal, água pura e oração.",
      quote: "Eu te santifico! Eu te limpo e purifico, permitindo que você me sirva neste ritual!"
    },
    {
      name: "Ritual Mediúnico",
      desc: "Permite comunicação com almas e espíritos sem barreiras. Funciona em seres vivos."
    },
    {
      name: "Ritual de Sacrifício",
      desc: "Oferece um objeto a uma divindade. Termos críticos em Hermes/Jotun: 'rezar', 'observar', 'oferecer', 'reino', 'portões', 'abrir'."
    },
    {
      name: "Ritual de Outorga",
      desc: "Recebe um objeto da divindade. Termos críticos: 'rezar', 'observar', 'dar', 'reino', 'portões', 'força', 'abrir'."
    },
    {
      name: "Ritual Dualístico",
      desc: "Usa 2 velas (Eu e Divindade) e um item relacionado para canalizar poder divino no objeto."
    },
    {
      name: "Danças Espirituais",
      desc: "Origem no Continente Sul (Morte). Usa ritmo e movimento para harmonizar espiritualidade com a natureza."
    },
    {
      name: "Sonambulismo Artificial",
      desc: "Técnica de mediunidade onde a mente dorme mas a espiritualidade dispersa para comunicar com espíritos superiores."
    },
    {
      name: "Queda da Alma",
      desc: "Possessão à distância (max 500 milhas). Requer altar do Deus da Sabedoria (olho onisciente), adaga de latão, lavanda e menta.",
      note: "Permite controlar corpo alvo ou usar escrita automática."
    },
    {
      name: "Adivinhação no Espelho",
      desc: "Recebe revelação de uma terceira pessoa/local. Perigoso para o usuário (exposição a entidades), seguro para o alvo.",
      quote: "Espelho, espelho meu..."
    },
    {
      name: "Ritual de Ação Secreta",
      desc: "Alinhamento com o alvo da oração para adquirir conhecimento. Gera 'overlap' de segredos entre executor e alvo."
    },
    {
      name: "Sacrifício da Lua de Sangue",
      desc: "Usa sangue de Beyonder e pele de animal para contatar seres ocultos. Resultados imprevisíveis."
    },
    {
      name: "Manifestação da Impressão Mental",
      desc: "Cria imagens replicadas da mente (retratos falados sobrenaturais) através de oração."
    }
  ];

  const RITE_OF_PASSAGE = {
    name: "Rito de Travessia (Morte)",
    difficulty: 15,
    prep: "1 Matéria Ritualística",
    materials: "Cabeça de cobra, penas de corvo, canoa de madeira, remo, moedas.",
    effect: "Área 300m. Envia espíritos (Nvl 1 ou menor) ao submundo igual à qtd de moedas.",
    failure: "Materiais decaem.",
    critFail: "Abre um Portão dos Mortos. Liberta 1 espírito Nvl 3 e 2 espíritos Nvl 2."
  };

  const filtered = RITUALS.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6 animate-fadeIn">
      <input 
        type="text" 
        placeholder="Buscar ritual..." 
        className="w-full bg-mystic-800 border border-stone-700 rounded p-3 text-stone-300 focus:border-mystic-gold outline-none"
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Destaque: Rito de Passagem */}
      {!filter || "rito de travessia".includes(filter.toLowerCase()) ? (
         <div className="bg-mystic-900 border border-mystic-gold/40 p-6 rounded-lg shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 text-mystic-gold/5 text-9xl font-serif">†</div>
            <h3 className="text-xl font-serif text-mystic-gold mb-2">{RITE_OF_PASSAGE.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-300 mb-4">
               <div><span className="text-stone-500 uppercase tracking-widest">Materiais:</span> {RITE_OF_PASSAGE.materials}</div>
               <div><span className="text-stone-500 uppercase tracking-widest">Dificuldade:</span> {RITE_OF_PASSAGE.difficulty}</div>
            </div>
            <p className="text-sm text-stone-400 italic border-l-2 border-stone-700 pl-3 mb-4">{RITE_OF_PASSAGE.effect}</p>
            <div className="flex gap-4 text-xs">
              <span className="text-stone-500">Falha: {RITE_OF_PASSAGE.failure}</span>
              <span className="text-red-500 font-bold">Crítico: {RITE_OF_PASSAGE.critFail}</span>
            </div>
         </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ritual, idx) => (
          <div key={idx} className="bg-mystic-800 p-4 rounded border border-stone-800 hover:border-mystic-gold/30 transition-all flex flex-col">
            <h4 className="text-mystic-gold font-serif font-bold mb-2">{ritual.name}</h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3 flex-1">{ritual.desc}</p>
            {ritual.quote && (
              <p className="text-[10px] text-stone-500 italic border-t border-stone-800 pt-2">"{ritual.quote}"</p>
            )}
            {ritual.note && (
              <p className="text-[10px] text-red-400 mt-2 font-bold uppercase">Nota: {ritual.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SpellsSection = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-2">Sistema de Feitiçaria</h3>
        <p className="text-sm text-stone-400 leading-relaxed">
          O uso de feitiços consiste na estruturação de símbolos, materiais e idiomas, compilando tudo em uma combinação de 
          <span className="text-white font-bold"> Meio-Forma-Afinidade-Efeito</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Escalas */}
        <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
           <h4 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-4">Escalas de Complexidade</h4>
           <ul className="space-y-2 text-xs text-stone-300">
             <li className="flex justify-between border-b border-stone-800 pb-1"><span>5ª Escala (Mais Simples)</span> <span className="text-stone-500">Até 4 Componentes</span></li>
             <li className="flex justify-between border-b border-stone-800 pb-1"><span>4ª Escala</span> <span className="text-stone-500">Até 5 Componentes</span></li>
             <li className="flex justify-between border-b border-stone-800 pb-1"><span>3ª Escala</span> <span className="text-stone-500">Até 6 Componentes</span></li>
             <li className="flex justify-between border-b border-stone-800 pb-1"><span>2ª Escala</span> <span className="text-stone-500">Até 7 Componentes</span></li>
             <li className="flex justify-between border-b border-stone-800 pb-1"><span className="text-mystic-gold">1ª Escala (Mais Complexa)</span> <span className="text-mystic-gold">Até 8 Componentes</span></li>
           </ul>
        </div>

        {/* Formas */}
        <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
           <h4 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-4">Formas de Materialização</h4>
           <ul className="space-y-2 text-xs text-stone-300">
             <li className="grid grid-cols-3"><span className="font-bold">Projétil</span> <span className="col-span-2 text-stone-500">10m. Único e retilíneo.</span></li>
             <li className="grid grid-cols-3"><span className="font-bold">Aura</span> <span className="col-span-2 text-stone-500">5m. Esfera centrada em você.</span></li>
             <li className="grid grid-cols-3"><span className="font-bold">Feixe</span> <span className="col-span-2 text-stone-500">5m. Contínuo e retilíneo.</span></li>
             <li className="grid grid-cols-3"><span className="font-bold">Onda</span> <span className="col-span-2 text-stone-500">5m. Arco de 180°.</span></li>
           </ul>
        </div>
      </div>

      {/* Afinidades */}
      <div className="bg-mystic-900 border border-stone-800 rounded-lg overflow-hidden">
        <div className="bg-mystic-800 px-6 py-3 border-b border-stone-700">
          <h4 className="text-mystic-gold text-sm font-bold uppercase tracking-widest">Tabela de Afinidades (Dano Base)</h4>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
           <div className="p-2 bg-red-900/10 border border-red-900/20 rounded"><strong className="text-red-400 block">Fogo/Solar</strong> 1d8</div>
           <div className="p-2 bg-blue-900/10 border border-blue-900/20 rounded"><strong className="text-blue-400 block">Frio/Ar/Elét/Luz</strong> 1d6</div>
           <div className="p-2 bg-stone-800 border border-stone-700 rounded"><strong className="text-stone-400 block">Terra/Mental</strong> 1d6</div>
           <div className="p-2 bg-purple-900/10 border border-purple-900/20 rounded"><strong className="text-purple-400 block">Degeneração</strong> 1d8</div>
           <div className="p-2 bg-green-900/10 border border-green-900/20 rounded"><strong className="text-green-400 block">Metabolismo</strong> 1d4 Dano / 1d6 Cura</div>
           <div className="p-2 bg-green-900/10 border border-green-900/20 rounded"><strong className="text-green-400 block">Vitalidade</strong> 1d6 Cura</div>
        </div>
      </div>

      {/* Efeitos & Modificadores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
            <h4 className="text-stone-400 text-xs font-bold uppercase mb-4 border-b border-stone-700 pb-2">Efeitos Especiais</h4>
            <div className="space-y-3 text-xs text-stone-300 h-64 overflow-y-auto custom-scrollbar pr-2">
               <p><strong className="text-mystic-gold">Restrição Espiritual:</strong> DT 10+2xEscala+Esp. Alvo incapaz de usar energia (2T).</p>
               <p><strong className="text-mystic-gold">Confusão:</strong> Alvo usa atributos aleatórios.</p>
               <p><strong className="text-mystic-gold">Fúria:</strong> Ataca mais próximo, vantagem em Luta.</p>
               <p><strong className="text-mystic-gold">Crescer:</strong> Aumenta alvo não senciente (1m²).</p>
               <p><strong className="text-mystic-gold">Refração:</strong> Repele luz.</p>
               <p><strong className="text-mystic-gold">Distorção Espacial:</strong> Distorce efeitos espaciais (+2 EE).</p>
               <p><strong className="text-mystic-gold">Telecinese:</strong> Move objetos (5m).</p>
               <p><strong className="text-mystic-gold">Atrair:</strong> Puxa objeto via gravidade (10m).</p>
            </div>
         </div>

         <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
            <h4 className="text-stone-400 text-xs font-bold uppercase mb-4 border-b border-stone-700 pb-2">Modificadores</h4>
            <div className="space-y-3 text-xs text-stone-300 h-64 overflow-y-auto custom-scrollbar pr-2">
               <p><strong className="text-blue-300">Área de Efeito:</strong> Reduz 1 dado de dano. Duplica área ou torna esfera 5m.</p>
               <p><strong className="text-blue-300">Alcance:</strong> Duplica alcance ou fixa em 10m.</p>
               <p><strong className="text-blue-300">Amplificação:</strong> Dado sobe um nível (d4&rarr;d6) ou adiciona +1 dado.</p>
               <p><strong className="text-blue-300">DoT (3 Turnos):</strong> 1d6 por turno (Queimadura, Sangramento, etc).</p>
               <p><strong className="text-blue-300">Ricochetear:</strong> Salta p/ outro alvo. Dado diminui a cada salto.</p>
               <p><strong className="text-blue-300">Corrente:</strong> Auto-direciona (Custa 2 EE).</p>
               <p><strong className="text-blue-300">Pulsar:</strong> Gasta energia para aplicar efeito uma 2ª vez no acerto.</p>
               <p><strong className="text-blue-300">Canalização:</strong> Mantém forma por custo/turno.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Rituals;

import React from 'react';

const Guide: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20">
        <h2 className="text-2xl font-serif text-mystic-gold mb-2">Guia do Sistema</h2>
        <p className="text-stone-500 text-sm italic">"Conhecimento é a chave para a sobrevivência no mistério."</p>
      </div>

      {/* Intro Section */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Sobre o Sistema e o Universo</h3>
        <div className="space-y-4 text-sm text-stone-300 leading-relaxed text-justify">
          <p>
            Esse é um sistema baseado na obra <strong>"Lord of the Mysteries"</strong> do autor "Cuttlefish That Loves Diving", com o propósito de integrar os conceitos e elementos dessa obra em um sistema funcional com base em outros sistemas e jogos, como Call of Cthulhu, Ordem Paranormal e Monster Hunter, em um mundo onde pouquíssimas pessoas sabem sobre a existência de seres sobrenaturais e entidades que tentam o desejo humano.
          </p>
          <p>
            O mundo é, originalmente, dedicado a histórias de terror e/ou mistério, mas pode ser muito versátil em alguns pontos, especialmente durante as sequências altas.
          </p>
          <p>
            O sistema de níveis é dividido em <strong>Sequências Transcendentes</strong> (ou Níveis Sequenciais (NS)). Estas sequências se referem aos vinte e dois caminhos do divino, que são divididos, cada um, em nove níveis de poder de numeração decrescente, se iniciando na sequência 9 e então descendo até a 1.
          </p>
          <p>
            Para alcançar este estado que transcende a humanidade em si, é necessário juntar ingredientes especiais por quaisquer meios que sejam (roubar, comprar ou caçar criaturas e plantas especiais), então juntá-los e sintetizar uma poção especial que irá mudar a sua própria essência, seu corpo, mente e alma, tornando-se cada vez menos humano. Este, é o preço do poder.
          </p>
          <div className="bg-black/30 p-3 rounded border-l-2 border-mystic-gold italic text-stone-400">
            Estas características especiais não se criam ou se destroem, existindo permanentemente em um número fixo, limitando a quantidade de transcendentes que existem em um mesmo momento. “Na natureza nada se cria, nada se destrói, tudo se transforma”.
          </div>
          <p>
            Em suma, qualquer ação descuidada pode lhe matar imediatamente: Olhar diretamente para uma entidade perigosa, beber poções de forma inadequada, tocar objetos que não devia e por aí vai. Este jogo é, acima de tudo, um jogo de sobrevivência, em que a morte pode vir nos momentos mais improváveis.
          </p>
        </div>
      </div>

      {/* Creation Guide */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Guia de Criação</h3>
        <div className="space-y-4 text-sm text-stone-300 leading-relaxed text-justify">
          <p>
            Para uma melhor consistência e facilidade ao criar de seu personagem, siga as instruções abaixo para a sua criação, em ordem. As fichas e escolhas estão nas outras abas do Grimório. Boa sorte e divirta-se!
          </p>
          <p className="italic text-stone-500">
            Antes de começarmos, devo ressaltar de que não é obrigatoriamente necessário um personagem com altas capacidades ofensivas, visto que em primeiro momento, boa parte de vocês podem ser pessoas comuns. Além disso, personagens intelectuais ou espirituais também tem grande importância neste mundo.
          </p>

          <ol className="list-decimal pl-5 space-y-4 marker:text-mystic-gold">
            <li>
              <strong>Personificação:</strong> Em primeiro lugar, preencha a aba "Pessoal" para dar uma personalidade, direção e forma geral para você. Peço que deixem a questão linguística por último, visto que escolhê-la primeiro pode afetar a consistência da ficha devido a necessidade de perícias.
            </li>
            <li>
              <strong>Ficha Prática:</strong> Siga para as abas de "Origem", "Perícias" e "Grimório" (Atributos).
            </li>
            <li>
              <strong>Atributos Primários:</strong> Você inicia com todos os seus atributos em 0. Você pode alocar <strong>5 pontos</strong> de atributo como preferir.
              <ul className="list-disc pl-5 mt-1 text-xs text-stone-400">
                <li>Humano comum: Máximo de 3 em qualquer atributo.</li>
                <li>Beyonder (sem resquícios divinos): Máximo de 5.</li>
                <li>Limite temporário: Atributos podem ser aumentados temporariamente até 7.</li>
              </ul>
            </li>
            <li>
              <strong>Atributos Secundários:</strong> Calculados automaticamente na ficha, mas entenda a lógica:
              <ul className="list-disc pl-5 mt-1 text-xs text-stone-400 space-y-1">
                 <li><strong className="text-green-500">PV (Vida):</strong> Humano: 10 + Vigor. Avanço de Sequência: +3 base + (2 x Vigor).</li>
                 <li><strong className="text-blue-400">EE (Energia Espiritual):</strong> Mesma lógica do PV, baseada em Espiritualidade.</li>
                 <li><strong className="text-stone-300">DEF (Defesa):</strong> 10 + Destreza (Agilidade). Capacidade de evitar golpes.</li>
                 <li><strong className="text-stone-300">MOV (Movimentação):</strong> Humano: 8 + (2 x Agilidade). Beyonder: 4 x Agilidade (em metros).</li>
                 <li><strong className="text-purple-400">SAN (Sanidade):</strong> Base Humana: 50 + (10 x Espiritualidade). A cada avanço, é reduzida pela base do nível da poção + falha no teste menos a Espiritualidade.</li>
              </ul>
            </li>
            <li>
              <strong>Perícias:</strong> Base de pontos: 5 + Inteligência (Humano). A cada avanço: +2 base + Inteligência. Máximo de treino por nível (Ex: Humano max 1, Seq 9 max 2).
            </li>
            <li>
              <strong>Inventário:</strong> Você recebe <strong>6 Pontos de Inventário (PI)</strong>. Aumenta em 2 para cada sequência iniciada. Pode trocar 1 PI por 1 Libra de Ouro.
            </li>
          </ol>
          <div className="bg-mystic-900/50 p-3 rounded mt-4">
             <h4 className="text-mystic-gold text-xs font-bold uppercase mb-1">Avanço de Sequência</h4>
             <p className="text-xs text-stone-400">Após a sequência 9, a cada avanço, você recebe <strong>+1 ponto de atributo primário</strong> flexível para alocar onde preferir.</p>
          </div>
        </div>
      </div>

      {/* Initial Inventory */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Inventário Inicial & Preços (PI)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="space-y-3">
              <h4 className="text-stone-200 font-bold uppercase tracking-widest text-xs border-b border-stone-700 pb-1">Arsenal</h4>
              <ul className="text-sm text-stone-400 space-y-2">
                 <li className="flex justify-between"><span>Pequenas/Médias Armas (Metal)</span> <span className="text-mystic-gold">1 PI</span></li>
                 <li className="flex justify-between"><span>Grandes Armas (Metal)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>3x Munição (Revólver/Escopeta/Rifle)</span> <span className="text-mystic-gold">1 PI</span></li>
                 <li className="flex justify-between"><span>3x Aljavas de Flechas</span> <span className="text-mystic-gold">1 PI</span></li>
                 <li className="flex justify-between"><span>Armadura de Couro (Leve)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Regalia (Item Místico Grau 3)</span> <span className="text-mystic-gold">4 PI</span></li>
              </ul>
           </div>

           <div className="space-y-3">
              <h4 className="text-stone-200 font-bold uppercase tracking-widest text-xs border-b border-stone-700 pb-1">Livros</h4>
              <ul className="text-sm text-stone-400 space-y-2">
                 <li className="flex justify-between"><span>Guia da Flora de Loen</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Arqueologia Avançada (Roselle)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Dicionário Popular</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Loen Real (Fofocas - Atualizar Semanal)</span> <span className="text-mystic-gold">1 PI</span></li>
                 <li className="flex justify-between"><span>Livros Didáticos (+3 Perícia)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Lendas e Mitos (Roselle)</span> <span className="text-mystic-gold">2 PI</span></li>
              </ul>
           </div>

           <div className="space-y-3">
              <h4 className="text-stone-200 font-bold uppercase tracking-widest text-xs border-b border-stone-700 pb-1">Diversos</h4>
              <ul className="text-sm text-stone-400 space-y-2">
                 <li className="flex justify-between"><span>Dinamite (4D6 Impacto/Ígneo)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Kit de Armadilhas (5 cargas)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Kit de Falsificação (2 usos)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Kit Alquímico (10 pts materiais)</span> <span className="text-mystic-gold">3 PI</span></li>
                 <li className="flex justify-between"><span>Kit Médico (+5 Med, Cura 2D6)</span> <span className="text-mystic-gold">3 PI</span></li>
                 <li className="flex justify-between"><span>Kit de Sobrevivência (Ração/Cantil)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Materiais Ritualísticos (3 un)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between"><span>Gazua (+5 Crime, 6 cargas)</span> <span className="text-mystic-gold">1 PI</span></li>
                 <li className="flex justify-between"><span>Veneno Simples (2 cargas)</span> <span className="text-mystic-gold">2 PI</span></li>
                 <li className="flex justify-between text-left"><span className="leading-tight">Cogumelo Frank (Cura Milagrosa Duvidosa)</span> <span className="text-mystic-gold shrink-0">5 PI</span></li>
              </ul>
           </div>
        </div>
      </div>

      {/* Tests & Rests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
           <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Regras de Testes</h3>
           <p className="text-sm text-stone-300 mb-4">
             A maioria dos testes utiliza um D20. O cálculo base é: <br/>
             <strong className="text-mystic-gold">1D20 + Perícia + Atributo Relacionado</strong>
           </p>
           <div className="space-y-2 text-xs text-stone-400">
             <p><strong className="text-white">Habilidades de Sequência:</strong> 1D20 + Atributo + Nível Sequencial (Seq 9 = NS 1). Não usa perícia salvo especificação.</p>
             <div className="bg-mystic-900/50 p-2 rounded">
               <span className="block font-bold text-stone-300 mb-1">Dificuldade (DT)</span>
               <ul className="grid grid-cols-2 gap-2">
                 <li>Fácil: <span className="text-white">DT 10</span></li>
                 <li>Normal: <span className="text-white">DT 15</span></li>
                 <li>Difícil: <span className="text-white">DT 20</span></li>
                 <li>Improvável: <span className="text-white">DT 25</span></li>
               </ul>
             </div>
           </div>
        </div>

        <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
           <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Descansos & Alimentação</h3>
           <div className="space-y-4 text-sm text-stone-300">
             <div>
               <h4 className="font-bold text-mystic-gold text-xs uppercase mb-1">Descanso Curto</h4>
               <p className="text-xs text-stone-400">Recupera 1D6 de Vida ou Energia Espiritual. Máximo de 2 curtos antes de um longo.</p>
             </div>
             <div>
               <h4 className="font-bold text-mystic-gold text-xs uppercase mb-1">Descanso Longo</h4>
               <p className="text-xs text-stone-400">Recupera 2D6 para distribuir entre Vida ou EE. Requer 1 Suprimento por pessoa. 24h sem descanso longo = -2 testes; 48h = -5 testes.</p>
             </div>
             <div className="bg-mystic-900/50 p-2 rounded border-l-2 border-green-800">
               <h4 className="font-bold text-green-500 text-xs uppercase mb-1">Culinária</h4>
               <p className="text-xs text-stone-400 italic">Comida preparada por cozinheiro experiente em descanso longo recupera +1D6 de atributo por nível de perícia Culinária. (Custa +1 Suprimento por dado extra para o grupo).</p>
             </div>
           </div>
        </div>
      </div>

      {/* Conditions & Status */}
      <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800">
        <h3 className="text-mystic-gold font-serif text-xl mb-4 border-b border-mystic-gold/10 pb-2">Condições & Status</h3>
        
        <div className="space-y-6">
          
          {/* Physical */}
          <div>
             <h4 className="text-stone-200 font-bold uppercase tracking-widest text-xs mb-3 border-l-4 border-red-500 pl-2">Controle Físico</h4>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-stone-400">
                <li><strong className="text-white">Fraqueza:</strong> Desvantagem em testes de força e agilidade.</li>
                <li><strong className="text-white">Cansaço:</strong> Desvantagem em testes de vigor.</li>
                <li><strong className="text-white">Atordoado:</strong> Perde turno se falhar em Const+Vigor. Ataques contra têm vantagem.</li>
                <li><strong className="text-white">Prostrado:</strong> Ataques contra têm vantagem. Gasta movimento para levantar.</li>
                <li><strong className="text-white">Exaustão Física:</strong> Atributos físicos -1 e desvantagem em testes físicos.</li>
                <li><strong className="text-white">Congelamento Parcial:</strong> Const+Vigor (DT 15) ou perde movimento. Falha parcial reduz mov pela metade.</li>
                <li><strong className="text-white">Dormindo:</strong> Incapaz de agir. Acertos são críticos. Acorda com dano.</li>
                <li><strong className="text-white">Restringido:</strong> Imóvel. Ataques contra têm vantagem.</li>
                <li><strong className="text-white">Paralisado:</strong> Incapaz de agir, perde defesa de agilidade. Acertos são críticos.</li>
                <li><strong className="text-white">Surdo:</strong> Imune a habilidades auditivas. Incapaz de ouvir.</li>
             </ul>
          </div>

          {/* Mental */}
          <div>
             <h4 className="text-stone-200 font-bold uppercase tracking-widest text-xs mb-3 border-l-4 border-blue-500 pl-2">Controle Mental</h4>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-stone-400">
                <li><strong className="text-white">Desprevenido:</strong> Perde primeiro turno. Ataques contra têm vantagem.</li>
                <li><strong className="text-white">Confuso:</strong> Testes rolam com atributos aleatórios.</li>
                <li><strong className="text-white">Medo/Pavor:</strong> Incapaz de avançar contra causador ou reagir ofensivamente. Pavor: -1 INT e desvantagem geral.</li>
                <li><strong className="text-white">Calma:</strong> Purifica emoções, recupera 1/3 sanidade da cena, +3 resistência mental.</li>
                <li><strong className="text-white">Coragem:</strong> Purifica medo, +1 Defesa, +2 Ataque.</li>
                <li><strong className="text-white">Fúria:</strong> +5 Luta, -3 Defesa, Desvantagem Pontaria. Obrigatório atacar (mesmo que a si).</li>
                <li><strong className="text-white">Paixão:</strong> Desvantagem em resistência interpessoal.</li>
                <li><strong className="text-white">Melancolia:</strong> Desvantagem em tudo. Fraqueza a dano mental.</li>
                <li><strong className="text-white">Exaustão Mental:</strong> Desvantagem em testes de inteligência.</li>
             </ul>
          </div>

          {/* Spiritual */}
          <div>
             <h4 className="text-stone-200 font-bold uppercase tracking-widest text-xs mb-3 border-l-4 border-purple-500 pl-2">Controle Espiritual</h4>
             <ul className="text-sm text-stone-400 space-y-2">
                <li><strong className="text-white">Exaustão Espiritual:</strong> Zera Espiritualidade. Incapaz de usar energia. Desvantagem em testes físicos e espirituais.</li>
                <li><strong className="text-white">Supressão:</strong> Impedido de usar energia até passar em Vontade+Espiritualidade.</li>
             </ul>
          </div>

          {/* DoT */}
          <div>
             <h4 className="text-stone-200 font-bold uppercase tracking-widest text-xs mb-3 border-l-4 border-orange-500 pl-2">Dano Contínuo (DoT)</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-stone-400">
                <div><strong className="text-white">Combustão:</strong> 1d8 dano/turno.</div>
                <div><strong className="text-white">Laceração:</strong> Acumula marcas. A cada 5 marcas = Sangramento maior. Const+Vigor remove 2 marcas.</div>
                <div><strong className="text-white">Sangramento (L/M/G):</strong> 1d4 / 1d6 / 1d8 dano. Fraqueza a toxinas e eletricidade.</div>
                <div><strong className="text-white">Envenenamento (L/M/G):</strong> 1d4 / 1d6 / 1d8 dano. Desvantagem em Vigor.</div>
             </div>
          </div>

          {/* Madness */}
          <div className="bg-mystic-900/50 p-4 rounded border border-mystic-corruption/40 shadow-inner">
             <h4 className="text-mystic-corruption font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mystic-corruption animate-pulse"></span> Loucura & Corrupção
             </h4>
             <p className="text-xs text-stone-300 mb-4 leading-relaxed">
               A cada 4 de Loucura, você recebe uma “mania” leve ou agrava uma existente. Ao atingir 50% da Sanidade Máxima em Loucura, o personagem enlouquece (NPC). Se for transcendente, role 1d20: 5 ou menos resulta em mutação espontânea em monstro.
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <span className="text-[10px] text-stone-500 uppercase font-bold border-b border-stone-700 block mb-2">Manias Leves</span>
                   <ul className="space-y-2 text-xs text-stone-400">
                      <li><strong className="text-white">Cleptomania:</strong> Vontade+INT (DT 10) para não roubar itens.</li>
                      <li><strong className="text-white">Fobia:</strong> Vontade+ESP (DT 10) para não entrar em Medo.</li>
                      <li><strong className="text-white">Hábito de Sequência:</strong> Comportamento compulsivo ligado ao caminho.</li>
                   </ul>
                </div>
                <div>
                   <span className="text-[10px] text-stone-500 uppercase font-bold border-b border-stone-700 block mb-2">Manias Moderadas</span>
                   <ul className="space-y-2 text-xs text-stone-400">
                      <li><strong className="text-white">Síndrome do Pânico:</strong> Ao ver gatilho, Vontade+INT (DT 20). Falha: Fuga e desvantagem total. Sucesso: Paralisia 1 turno.</li>
                      <li><strong className="text-white">Alotriofagia:</strong> Vontade+INT (DT 15) para não comer objetos/seres. Falha: Desvantagem total até consumir.</li>
                   </ul>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Guide;

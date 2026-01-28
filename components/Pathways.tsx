import React, { useState, useEffect } from 'react';
import { Character, Ability } from '../types';

interface PowerInfo {
  name: string;
  description: string;
  cost: string;
}

interface SequenceInfo {
  level: number;
  name: string;
  abilities: PowerInfo[];
  traits: PowerInfo[];
}

interface PathwayData {
  id: string;
  arcana: string;
  name: string;
  image: string;
  portrait: string;
  symbol: string;
  quote: string;
  description: string;
  sequences: SequenceInfo[];
}

const PATHWAYS_DEFAULT: PathwayData[] = [
  {
    id: 'fool',
    arcana: '0 - O Tolo',
    name: 'O Tolo (The Fool)',
    image: 'https://i.imgur.com/JVS4UEa.jpeg',
    portrait: 'https://i.imgur.com/JVS4UEa.jpeg',
    symbol: 'https://i.imgur.com/RSEPNfM.jpeg',
    quote: 'O Louco que não pertence a esta era; O Governante Misterioso acima do nevoeiro cinzento.',
    description: 'O que lhes falta em capacidade de combate, é compensado em intuição mística. Eles são mestres em todos os tipos de adivinhação, incluindo astrologia, cartomancia, pêndulos e numerologia.',
    sequences: [
      {
        level: 9,
        name: 'Seer (Vidente)',
        abilities: [
          { name: 'Visão Espiritual', cost: '1 EE/min', description: 'Concentra energia espiritual nos seus olhos, permitindo enxergar energias e auras por um período de tempo.' }
        ],
        traits: [
          { name: 'Vidência', cost: '1 EE', description: 'Capacidade de interpretar sinais e mudanças no plano espiritual por meio de ferramentas e técnicas do misticismo. Deve realizar um teste de Simbolismo com Espiritualidade. Conhecimento sobre técnicas de adivinhação podem e devem ser adquiridos por você.' },
          { name: 'Intuição Paranormal', cost: '2 EE', description: 'Senso de perigo sobre-humano. +2 Intuição e Esquiva.' },
          { name: 'Afinidade Mística', cost: 'Passiva', description: '+1 Espiritualidade.' },
          { name: 'Misticismo Teórico', cost: 'Passiva', description: 'Recebe conhecimento de uma forma de ritual simples envolvendo incensos, que faz com que seres que descansem em sua área de efeito recebam o dobro da recuperação de energia espiritual.' }
        ]
      },
      {
        level: 8,
        name: 'Clown (Palhaço)',
        abilities: [
          { name: 'Origami', cost: '2 EE', description: 'Endurece e afia pequenos pedaços de papel, que causam sua Espiritualidade +2 de dano base. Eles ficam nesse estado por uma cena. Limitado a armas de pequeno porte.' }
        ],
        traits: [
          { name: 'Coordenação Cirquense', cost: 'Passiva', description: 'Enquanto não usar uma armadura, pode usar Intuição com Espiritualidade para testes de Acrobacia. Além disso, sua Esquiva é calculada com sua Espiritualidade e adicione sua espiritualidade à sua defesa. Por fim, jogue pontaria e luta (com armas pequenas) usando Espiritualidade.' },
          { name: 'Careta Exagerada', cost: 'Passiva', description: 'Vantagem em testes de enganação.' },
          { name: 'Toma lá, dá cá', cost: 'Passiva', description: '+1 Espiritualidade, -1 Vigor.' },
          { name: 'Agilidade do Palhaço', cost: 'Passiva', description: 'Você possui uma reação defensiva extra.' }
        ]
      },
      {
        level: 7,
        name: 'Magician (Mágico)',
        abilities: [
          { name: 'Transferência', cost: '3 EE', description: 'Transfere feridas de uma parte do corpo para outra(s), um dano crítico torna-se um dano normal. Pode ser usado em estado “morrendo” uma vez por descanso, para entrar em estado “desacordado”, exceto que o mestre julgue que não seria fisicamente possível.' },
          { name: 'Salto Flamejante', cost: '2/4 EE', description: 'Se teleporta para uma chama, na distância máxima de Movimentação x Nível. Pode sentir chamas à sua volta.' },
          { name: 'Bala de Ar', cost: '1 EE', description: 'Estalar os dedos ou produzir sons de armas dispara um projétil de ar condensado, causando 1D6 de dano perfurante, se o inimigo não conhecer sua habilidade, ou seja flanqueado, considere um acerto crítico (duplique o dano) e adicione a sua Espiritualidade ao dano. O projétil pode ser disparado de qualquer ponto a 5xEsp metros e tem alcance de 5xEsp metros.' },
          { name: 'Figurinha de Papel', cost: '1+5 EE', description: 'Previamente, pode preparar uma figurinha humana de papel e marcá-la com sua espiritualidade. Troque de lugar com esta figura, transformando-a em você. Caso use ao receber dano, este dano será transferido para figurinha. Pode ter no máximo 3 origamis deste tipo ao mesmo tempo.' },
          { name: 'Chamas Dançantes', cost: '0 EE', description: 'Manipula chamas já existentes até certo ponto, além disso, pode iniciar focos de incêndio em materiais inflamáveis e, neste caso, é considerada Ação Bônus. Área: 20 metros.' },
          { name: 'Fogos de Artifício', cost: '1 EE', description: 'Intensifica uma chama em um raio de até 40 metros, depois a lança em alta velocidade em um alvo em um raio de até 10 metros da chama. Causa 1D6 de dano. Caso o alvo falhe em um teste de resistência de Constituição com Vigor de DT 15 + Nível, causa queimaduras, implantando fraqueza a fogo no alvo por 6 turnos.' },
          { name: 'Ilusionismo Menor', cost: '1 EE/T', description: 'Cria ilusões com formas, cores, sons e cheiro. São limitadas ao equivalente de duas pessoas adultas. A DT de percepção será um teste de Prestidigitação com Espiritualidade +5.' },
          { name: 'Canudinho', cost: '1 EE/Hora', description: 'Cria um canudinho de ar, com até 10 metros.' },
          { name: 'Origami (Arma)', cost: '2 EE', description: 'Endurece e afia papel em qualquer forma e tamanho, transformando-o em vários tipos de armas, que causam 1D8 + 1,5xEsp de dano cortante. Pequenos pedaços podem ser endurecidos como ação livre, causando 1D4 + Esp de dano.' },
          { name: 'Fuga', cost: '1 EE', description: 'Torna seu corpo e ossos maleáveis, até certo ponto.' }
        ],
        traits: [
          { name: 'Coelho na Cartola', cost: '1 EE/Cena', description: 'Pode criar pequenas ilusões livremente ao custo de 1 EE por cena.' },
          { name: 'Por Trás das Cortinas', cost: 'Passiva', description: 'Pode usar a reserva espiritual de um ser voluntário para lançar feitiços.' },
          { name: 'Oz', cost: 'Passiva', description: 'Habilidades dessa sequência são consideradas Feitiços.' }
        ]
      },
      {
        level: 6,
        name: 'Faceless (Sem Rosto)',
        abilities: [
          { name: 'Comutação', cost: '2 EE', description: 'Dentro dos limites de função fisiológica, você pode alterar seu corpo à sua vontade, podendo mimetizar perfeitamente a aparência de alguém fisicamente.' }
        ],
        traits: [
          { name: 'Sem Rosto', cost: 'Passiva', description: 'Ao tomar essa poção, o hospedeiro perde por completo suas características faciais.' },
          { name: 'Alomorfia', cost: 'Passiva', description: 'Após tomar a aparência de alguém, você sempre a reconhecerá, não importa o quão disfarçada ou diferente esteja.' },
          { name: 'Premonição Sombria', cost: 'Passiva', description: 'Caso mate uma pessoa enquanto estiver com a aparência dela, recupere 10 EE e receba 1 Loucura.' },
          { name: 'Aprimoramentos', cost: 'Passiva', description: 'Bala de ar: +1D6 dano, uso como revólver. Fogos: +1D6 dano. Ilusionismo: Multidão de 10 pessoas. Transferência: Reduz dano recebido pela metade, uso em outros seres.' }
        ]
      },
      {
        level: 5,
        name: 'Marionettist (Marionetista)',
        abilities: [
          { name: 'Visão Espiritual – Cordão da Alma', cost: '1 EE/T', description: 'Agora, sua visão espiritual permite que você veja os barbantes que controlam o corpo espiritual dos seres vivos.' },
          { name: 'Tomar Controle', cost: '5 EE/T', description: 'Começa a tomar controle das cordas espirituais de um ser vivo. O alvo deve passar em um teste de resistência (DT 20 + Prestidigitação + 2x Diferença Nível). A cada falha, toma 1 de 4 cordas. Ao acumular 4 cordas, o alvo morre espiritualmente e seu corpo passa a estar sob seu controle.' }
        ],
        traits: [
          { name: 'Fantoches', cost: 'Passiva', description: 'Você possui Nível+1 Pontos de Títere. Controle consome Nível pontos. Em combate, perde Ação de Movimento para controlar. Marionetes mantêm perícias e habilidades, agem 1 ação+livre por turno. Raio 200m. Acessa sentidos e memórias.' },
          { name: 'Letargia', cost: 'Passiva', description: 'Progresso de controle: 1 Corda (Perde fala/ação livre), 2 Cordas (Perde movimento), 3 Cordas (Sem reação, apenas 1 ação/turno), 4 Cordas (Morte espiritual).' }
        ]
      }
    ]
  },
  {
    id: 'door',
    arcana: 'I - O Mago',
    name: 'O Mago (The Door)',
    image: 'https://i.imgur.com/wBsdEb6.jpeg',
    portrait: 'https://i.imgur.com/wBsdEb6.jpeg',
    symbol: 'https://i.imgur.com/nZILnx6.jpeg',
    quote: 'As estrelas estão sempre lá.',
    description: 'Foco em pequenos truques e magias, dando preferência à versatilidade e adaptabilidade.',
    sequences: [
      {
        level: 9,
        name: 'Apprentice (Aprendiz)',
        abilities: [
          { name: 'Porta', cost: '2 EE', description: 'Abre uma “Porta” em qualquer superfície. Apenas você pode usar a porta.' },
          { name: 'Visão Espiritual – Sem Fronteiras', cost: '1 EE/min', description: 'Permite observar energias e auras, além de enxergar através de estruturas simples, como madeira, ou aproximar sua visão em até 50 metros.' }
        ],
        traits: [
          { name: 'Afinidade espiritual', cost: 'Passiva', description: '+1 Espiritualidade.' },
          { name: 'Conversão de Emergência', cost: 'Passiva', description: 'Pode converter 2 pontos de vida em 1 energia espiritual.' },
          { name: 'Guia', cost: 'Passiva', description: 'Pode abrir qualquer porta não mágica.' },
          { name: 'Tese Mágica', cost: 'Passiva', description: 'Consegue discernir entre resquícios espirituais causados por eventos naturais ou por feitiçaria humana.' }
        ]
      },
      {
        level: 8,
        name: 'Trickmaster (Mestre de Truques)',
        abilities: [
          { name: 'Névoa Mágica', cost: '3/6 EE', description: 'Emana neblina mágica que aumenta defesas base em 5 por 1D6+1 turnos. Com 6 EE, escolhe quem afeta.' },
          { name: 'Brisa Do Sul', cost: '3 EE/T', description: 'Cria corrente de vento. Oponentes contra ela fazem Fortitude (Força) ou recebem 2D6+2 Gélido e recuam. Sucesso: 1D6+2 dano e metade movimento.' },
          { name: 'Flash de Luz', cost: '1 EE', description: 'Dispara flash. Como reação, inimigos perdem dois dados em ações dependentes de visão.' },
          { name: 'Tombo', cost: '1 EE', description: 'Remove atrito do chão. Alvos fazem Acrobacia ou caem e perdem metade movimento.' },
          { name: 'Resfriar', cost: '1 EE', description: 'Absorve calor, causando 1D6 gélido ao toque.' },
          { name: 'Toque Abrasador', cost: '1 EE', description: 'Emite calor, causando 1D6 ígneo ao toque.' },
          { name: 'Choque', cost: '2 EE', description: 'Dispara carga estática, 2D6+2 elétrico. Pode ricochetear para segundo alvo.' }
        ],
        traits: [
          { name: 'Arcanismo', cost: 'Passiva', description: 'Habilidades deste caminho são consideradas feitiços.' },
          { name: 'Reserva do Trapaceiro', cost: 'Passiva', description: 'Pode carregar reserva de até metade do EE máximo de forma independente.' },
          { name: 'Tomo da Elemental', cost: 'Passiva', description: 'Aprende 3 feitiços Elementais de 5° escala. Ofensivos ganham +1 dado. Utilitários custam metade da ação.' },
          { name: 'Truque', cost: 'Passiva', description: 'Adicione modificador de reflexo a rolagens e DTs de magias com traço Somático.' }
        ]
      },
      {
        level: 7,
        name: 'Astrologer (Astrólogo)',
        abilities: [
          { name: 'Sentir Cosmos', cost: '3 EE', description: 'Analisa a espiritualidade local, ponderando sobre o envolvimento do cosmo no ambiente.' }
        ],
        traits: [
          { name: 'Astrologia', cost: 'Passiva', description: 'Usando bola de cristal e estrelas, pode realizar adivinhações ou intervir nelas.' },
          { name: 'Trilhar Caminhos', cost: 'Passiva', description: 'Pode trazer outras pessoas com você pelas suas Portas.' },
          { name: 'Luz estelar', cost: 'Passiva', description: 'Durante a noite, sob as estrelas, feitiços custam 1 EE a menos.' }
        ]
      },
      {
        level: 6,
        name: 'Scribe (Escriba)',
        abilities: [
          { name: 'Transcrever', cost: '1 EE + TE', description: 'Transcreve feitiço/habilidade vista para a alma. Teste de Espiritualidade com Simbolismo/Arcanismo.' },
          { name: 'Queimar Registro', cost: '1 EE', description: 'Queima habilidade registrada, lançando-a imediatamente. Recupera a TE gasta.' }
        ],
        traits: [
          { name: 'Escritor Espiritual', cost: 'Passiva', description: 'Usa alma como papel. Possui Espiritualidade x Nível em "Tinta Espiritual" (TE).' }
        ]
      },
      {
        level: 5,
        name: 'Traveler (Viajante)',
        abilities: [
          { name: 'Porta do Viajante', cost: '3 EE', description: 'Abre uma porta para o mundo espiritual.' },
          { name: 'Lampejo', cost: '2 EE', description: 'Locomove-se no espaço instantaneamente. Distância 5xEspxNível.' }
        ],
        traits: [
          { name: 'Bússola Natural', cost: 'Passiva', description: 'Localiza-se instintivamente no mundo espiritual, nunca se perdendo.' },
          { name: 'Texto Original', cost: 'Passiva', description: 'Pode alterar ou adicionar componente a habilidades transcritas.' },
          { name: 'Referencial', cost: 'Passiva', description: 'Aprende dois componentes arcanos.' }
        ]
      }
    ]
  },
  {
    id: 'white-tower',
    arcana: 'II - Sumo Sacerdote',
    name: 'Sumo Sacerdote (White Tower)',
    image: 'https://i.imgur.com/4RWgMa2.jpeg',
    portrait: 'https://i.imgur.com/4RWgMa2.jpeg',
    symbol: 'https://i.imgur.com/9mBVO1F.jpeg',
    quote: 'O conhecimento é o maior poder.',
    description: 'Caminho que se concentra em decifrar as leis da física e do mundo material, guiando a humanidade desde a pré-história.',
    sequences: [
      {
        level: 9,
        name: 'Savant (Sábio)',
        abilities: [
          { name: 'Toque do Criador', cost: '2 EE', description: 'Seu próximo teste em uma perícia de criação nesta cena recebe vantagem (+3).' }
        ],
        traits: [
          { name: 'Criança de Da Vinci', cost: 'Passiva', description: '-1 Vigor. +1 Inteligência/Destreza, +1 Int/Agi. Ganha metade da INT como pontos de perícia de criação por nível.' },
          { name: 'Memória Fotográfica', cost: 'Passiva', description: 'Nunca esquece. +10 em testes de Atualidades.' },
          { name: 'Especialização', cost: 'Passiva', description: 'Escolha: Alquimista (Misturas eficientes), Ferreiro (Sem forja, bônus em itens), Místico (Efeitos extras em itens), Armadilheiro (Dano extra em armadilhas).' }
        ]
      },
      {
        level: 8,
        name: 'Archaeologist (Arqueólogo)',
        abilities: [
          { name: 'Roda do Tempo', cost: '1 EE', description: 'Compreende características de estrutura/objeto e relações históricas.' }
        ],
        traits: [
          { name: 'Explorador de Ruínas', cost: 'Passiva', description: 'Compreende história, senso de perigo em ruínas. Visualiza e desmonta armadilhas sem teste.' },
          { name: 'Especialista em Reconstrução', cost: 'Passiva', description: 'Perícias de criação não possuem limite de treino.' },
          { name: 'Arqueologia', cost: 'Passiva', description: 'Sente artefatos (100xEsp m). 1x/dia chance de encontrar material/carga.' },
          { name: 'Material de Estudo', cost: 'Passiva', description: 'Carrega 1 artefato extra ao estabilizá-los.' },
          { name: 'Condicionamento do Explorador', cost: 'Passiva', description: '+4 Movimentação. +2 Reflexo.' },
          { name: 'Ritos Perdidos', cost: 'Passiva', description: 'Pode aprender até dois rituais.' }
        ]
      },
      {
        level: 7,
        name: 'Appraiser (Avaliador)',
        abilities: [
          { name: 'Avaliar', cost: '2/3 EE', description: 'Determina características, habilidades, falhas de itens. Estima nível de força. (+3 EE) Deduz vulnerabilidades.' },
          { name: 'Selar', cost: '2 EE', description: 'Por 5 turnos, desativa artefato avaliado de nível igual ou menor.' }
        ],
        traits: [
          { name: 'Análise Estrutural', cost: 'Passiva', description: '+1 Metalurgia/Engenharia por artefato criado (max +8).' },
          { name: 'Olhar Afiado', cost: 'Passiva', description: 'Testes de Visão recebem +1 no teste e +1 no dado.' },
          { name: 'Auge do Desempenho', cost: 'Passiva', description: '+1 em inteligência ou destreza.' }
        ]
      },
      {
        level: 6,
        name: 'Artisan (Artesão)',
        abilities: [
          { name: 'Epifania', cost: '10 EE', description: 'Recebe +5 Metalurgia, Engenharia ou Alquimia por uma cena.' },
          { name: 'Modular – Amplificar', cost: '4 EE', description: 'Ativa efeito negativo aleatório ou revolta de artefato em 40m.' },
          { name: 'Habilidade Especial', cost: 'Variável', description: 'Escolha: Forja Astral (Invoca projeção de artefato), Sobrecarregar (Aumenta efeito/duração), Interferência (Cancela habilidade de artefato).' }
        ],
        traits: [
          { name: 'Sintetize Complexa', cost: 'Passiva', description: 'Define qtd de habilidades/efeitos de artefatos criados (1d3). Pode adicionar habilidade ou remover efeito.' },
          { name: 'Síntese Simples', cost: 'Passiva', description: 'Cria itens místicos temporários (3d6 dias).' },
          { name: 'Especialização Técnica', cost: 'Passiva', description: 'Escolha: Eng. Balística (Balas +dano), Arsenal Espiritual (+1 Artefato), Metalurgia Avançada (+3 Letalidade, anti-crítico).' },
          { name: 'Círculo Alquímico', cost: 'Passiva', description: 'Aprende 2 rituais de Inovação/Evolução.' }
        ]
      },
      {
        level: 5,
        name: 'Astronomer (Astrônomo)',
        abilities: [
          { name: 'Anã Vermelha – Fratura', cost: '2 EE', description: 'Destrói Artefato (Forja Estelar) causando dano cósmico massivo em área.' },
          { name: 'Modular – Intensificar Gravidade', cost: '5 EE/Estágio', description: '3 Estágios: Densidade (Lentidão/Desvantagem), Horizonte (Dano/Queda), Poço sem Fim (Dano massivo).' },
          { name: 'Modular – Campo invertido', cost: '4 EE', description: 'Cria área de gravidade reversa. Desvia projéteis e levita alvos.' },
          { name: 'Feixe de Fótons', cost: '2 EE/T', description: 'Feixe de luz concentrada, 3D6 Dano Cósmico. Funde metais.' }
        ],
        traits: [
          { name: 'Forja Estelar', cost: 'Passiva', description: 'Cria artefatos com efeitos cósmicos em locais especiais.' },
          { name: 'Afinidade Estelar', cost: 'Passiva', description: 'Recebe Redução Cósmica 4.' },
          { name: 'Guardião Cósmico', cost: 'Passiva', description: 'Sente alterações cósmicas a nível de cidades.' }
        ]
      }
    ]
  },
  {
    id: 'demoness',
    arcana: 'III - A Imperatriz',
    name: 'A Imperatriz (Demoness)',
    image: 'https://i.imgur.com/Puul17W.jpeg',
    portrait: 'https://i.imgur.com/Puul17W.jpeg',
    symbol: 'https://i.imgur.com/yBVYxMA.jpeg',
    quote: 'A dor nos faz sentir vivos.',
    description: 'Centrado em causar desastres, podendo usar maldições, influenciar pessoas e incitar crimes.',
    sequences: [
      {
        level: 9,
        name: 'Assassin (Assassino)',
        abilities: [
          { name: 'Modelamento Físico', cost: 'Var', description: 'Visão Aprimorada (1 EE/T): +3 Pontaria/Luta. Leveza (3 EE): +2 Furtividade, anula queda.' },
          { name: 'Overdose Adrenérgica', cost: '4 EE + 1D6 PV', description: 'Triplica Força e Agilidade por 2D4 turnos. Depois recebe desvantagem física e -5 Defesa.' },
          { name: 'Imergir', cost: '3 EE', description: 'Se mescla nas sombras, recebendo +3 em testes de Furtividade.' }
        ],
        traits: [
          { name: 'Suavidade Fatal', cost: 'Passiva', description: '+1 AGI/PRE/ESP/INT, +1 AGI/PRE/ESP.' },
          { name: 'Decisivo', cost: 'Passiva', description: 'O primeiro acerto em um alvo é sempre um crítico.' },
          { name: 'Debilitar', cost: 'Passiva', description: 'Ao acertar um crítico, inflige Sangramento por 3 Turnos.' },
          { name: 'Delicadeza', cost: 'Passiva', description: '-1 Vigor.' },
          { name: 'Sentidos Aprimorados', cost: 'Passiva', description: 'Recebe +1 em Percepção.' }
        ]
      },
      {
        level: 8,
        name: 'Instigator (Instigador)',
        abilities: [
          { name: 'Manipulação', cost: '3 EE', description: 'Afeta subconscientemente até 5 alvos com uma frase.' },
          { name: 'Persuasão Mortal', cost: '2 EE', description: 'Infunde voz com paralisia. Alvo falha CON vira Entorpecido.' }
        ],
        traits: [
          { name: 'Presença Fraca', cost: 'Passiva', description: 'Recebe -5 de Percepção contra você.' },
          { name: 'Submergir em Caos', cost: 'Passiva', description: 'Imune a ataques de oportunidade. Ataques de flanco são críticos automáticos.' },
          { name: 'Arauto da Desordem', cost: 'Passiva', description: 'Testes de resistência mental em raio de 20m têm desvantagem (-3).' },
          { name: 'Canalizador de emoções', cost: 'Passiva', description: 'Vantagem (+3) em testes de Enganação ao sentir emoções.' }
        ]
      },
      {
        level: 7,
        name: 'Witch (Bruxa)',
        abilities: [
          { name: 'Atração', cost: '3 EE', description: 'Recebe +5 em testes para influenciar pessoas pela cena.' },
          { name: 'Invisibilidade', cost: '3 EE/Cena', description: '+10 Furtividade. Distorce luz. Ações ofensivas cortam o efeito.' },
          { name: 'Chama Negra', cost: '4 EE', description: 'Invoca chama do abismo. 1D6 dano Degenerativo/turno até 10xNível dano total. Metade dano na sanidade.' },
          { name: 'Espelho, espelho meu', cost: '3 EE', description: 'Transfere dano/efeito para espelho (Reação). Entra em espelho (3 turnos).' }
        ],
        traits: [
          { name: 'Existe alguém mais bela do que eu?', cost: 'Passiva', description: 'Emana carisma paranormal. +3 testes interpessoais.' },
          { name: 'Esquerda do Criador', cost: 'Passiva', description: 'Homens sofrem mutação tornando-se mulheres.' },
          { name: 'Filha da Depravação', cost: 'Passiva', description: 'Loucura aumenta gosto por manipulação.' },
          { name: 'Tomo Profano', cost: 'Passiva', description: 'Aprende 3 feitiços 4° escala e 2 maldições.' },
          { name: 'Adivinhação Corrompida', cost: 'Passiva', description: 'Usa espelhos e varas com materiais espirituais.' },
          { name: 'Catalisador Mágico', cost: 'Passiva', description: 'Partes do corpo reduzem custo de habilidades/feitiços.' }
        ]
      },
      {
        level: 6,
        name: 'Pleasure (Prazer)',
        abilities: [
          { name: 'Manipulação de teias', cost: '1 EE', description: 'Cria fios de teia (1D12 Cortante). Até 20m.' },
          { name: 'Êxtase Demoníaco', cost: '4 EE', description: 'Reação em dano por teia: Alvo falha CON fica Desprevenido (prazer).' },
          { name: 'Casulo', cost: '6 EE', description: 'Gera casulo (40 PV). Recupera 1D8 vida/turno. Fraqueza sagrado/ígneo.' }
        ],
        traits: [
          { name: 'Aura do Desejo', cost: 'Passiva', description: 'Fascina quem permanece próximo.' },
          { name: 'Súcubos', cost: 'Passiva', description: 'Relações absorvem 1D12 vida/sanidade. Alvos fracos obedecem.' },
          { name: 'Reflexão da Alma', cost: 'Passiva', description: 'Lança maldições via espelho banhado em sangue.' },
          { name: 'Livro de Magia Negra', cost: 'Passiva', description: '4 feitiços 4° escala + 2 maldições.' },
          { name: 'Descendência Diabólica', cost: 'Passiva', description: 'Resistência Degenerativo. Fraqueza Ígneo, Solar, Purificante.' },
          { name: '[Censored]', cost: 'Passiva', description: 'Incapaz de receber dano de sufocamento.' }
        ]
      },
      {
        level: 5,
        name: 'Affliction (Aflição)',
        abilities: [
          { name: 'Epidemia', cost: '4+8 EE/T', description: 'Névoa endêmica 50m. Infecção progressiva em 6 turnos levando a dano massivo e morte.' },
          { name: 'Reflexo', cost: '2 EE', description: 'Viaja pelo Mundo Espelhado.' }
        ],
        traits: [
          { name: 'Adepta da Praga', cost: 'Passiva', description: 'Resistência total a dano degenerativo e doenças.' },
          { name: 'Manipulação de Cabelos', cost: 'Passiva', description: 'Cabelos como arma (3D6+ESP perfurante). Crítico aplica Chama Negra.' }
        ]
      }
    ]
  },
  {
    id: 'black-emperor',
    arcana: 'IV - O Imperador',
    name: 'O Imperador Negro (Black Emperor)',
    image: 'https://i.imgur.com/yMjFoIb.jpeg',
    portrait: 'https://i.imgur.com/yMjFoIb.jpeg',
    symbol: 'https://i.imgur.com/hQOYHYb.jpeg',
    quote: 'Eu sou a lei, e a lei é a fundação da ordem.',
    description: 'Mestres em manipular as regras a seu favor. São proficientes em distorcer a justiça e a ordem.',
    sequences: [
      {
        level: 9,
        name: 'Lawyer (Advogado)',
        abilities: [
          { name: 'Burlar', cost: '2 EE', description: 'Detecta falhas lógicas. +/- 5 bônus em testes com alvo.' },
          { name: 'Lavagem Cerebral', cost: '2 EE', description: 'Usa Espiritualidade para sociais com vantagem. Falha em resistência toma fala como verdade.' }
        ],
        traits: [
          { name: 'Especialista em Contratos', cost: 'Passiva', description: '+1 Inteligência/Espiritualidade.' },
          { name: 'Antecipar Defesa', cost: 'Passiva', description: 'Ação movimento para usar Espiritualidade como Defesa.' },
          { name: 'Eloquência', cost: 'Passiva', description: '+1 Educação, Diplomacia e Enganação.' }
        ]
      },
      {
        level: 8,
        name: 'Barbarian (Bárbaro)',
        abilities: [
          { name: 'Linchar', cost: '3 EE', description: 'Adiciona Inteligência à Força ou Agilidade por 1D4 turnos.' },
          { name: 'Restringir', cost: '3 EE', description: 'Alvo burlado falha Vontade ou é Restringido (sem EE).' }
        ],
        traits: [
          { name: 'Sob Pressão', cost: 'Passiva', description: '+2 Resistência Mental. +3 resistir efeitos mentais.' },
          { name: 'Brigão', cost: 'Passiva', description: 'Treinado em arma corpo a corpo e luta.' },
          { name: 'Quebra de Contrato', cost: 'Passiva', description: 'Ataques em alvos Burlar ignoram 3 Defesa.' }
        ]
      },
      {
        level: 7,
        name: 'Briber (Subornador)',
        abilities: [
          { name: 'Suborno', cost: '2 EE', description: 'Efeitos: Enfraquecer (-3 testes/-5 Def), Charme, Arrogância (Vulnerável), Conectar (Dano compartilhado).' },
          { name: 'Suborno - Distorção Mental', cost: '2 EE', description: 'Entrega suborno para indução mental.' }
        ],
        traits: [
          { name: 'Dominância Espiritual', cost: 'Passiva', description: '+1 Espiritualidade.' }
        ]
      },
      {
        level: 6,
        name: 'Baron of Corruption (Barão da Corrupção)',
        abilities: [
          { name: 'Distorção Superior', cost: '? EE', description: 'Distorce alvos, conceitos ou realidade. DT varia.' },
          { name: 'Corrosão', cost: '3 EE', description: 'Alvo falha Vontade, torna-se ganancioso, impulsivo e Desprevenido (3T).' }
        ],
        traits: [
          { name: 'Domínio Especial - Corrupção', cost: 'Passiva', description: 'Perícia Direito vira Corrupção (sem limite). Aplica distorções menores.' },
          { name: 'Progenitor das Falhas', cost: 'Passiva', description: 'Sente fraquezas de quem observa.' }
        ]
      },
      {
        level: 5,
        name: 'Mentor of Disorder (Mentor da Desordem)',
        abilities: [
          { name: 'Campo de Entropia', cost: '5 EE+', description: 'Raio 20m. Atributos aleatórios. Adicionais: Desacelerar, Caos Vetorial, Desordenar Espaço, Inconstância.' },
          { name: 'Desordenar', cost: '3 EE', description: 'Reação: Adiciona/reduz Corrupção em teste próximo. Muda trajetória.' }
        ],
        traits: [
          { name: 'Realeza', cost: 'Passiva', description: 'Seres mundanos obedecem.' },
          { name: 'Horizonte de Eventos', cost: 'Passiva', description: 'Isolamento da realidade e adivinhações.' },
          { name: 'Além do Véu', cost: 'Passiva', description: 'Corrupção sem testes no Campo de Entropia.' }
        ]
      }
    ]
  },
  {
    id: 'tyrant',
    arcana: 'V - O Papa',
    name: 'O Papa (Tyrant)',
    image: 'https://i.imgur.com/Qv2FOne.jpeg',
    portrait: 'https://i.imgur.com/Qv2FOne.jpeg',
    symbol: 'https://i.imgur.com/pNjhVKF.jpeg',
    quote: 'O relâmpago é a vontade do mar.',
    description: 'O caminho do Hierofante domina tanto os mares, quanto o clima. Seus usuários se especializam em água, ar e eletricidade.',
    sequences: [
      {
        level: 9,
        name: 'Sailor (Marinheiro)',
        abilities: [
          { name: 'Força do Vento', cost: '4 EE', description: 'Materializa escamas que dobram redução de dano por 2D4 turnos.' }
        ],
        traits: [
          { name: 'Anfíbio', cost: 'Passiva', description: 'Movimento livre na água. 10min submerso.' },
          { name: 'Linhagem Ancestral', cost: 'Passiva', description: '+1 Força. Força soma na EE.' },
          { name: 'Predador das Profundezas', cost: 'Passiva', description: 'Escamas dão RD Física. +2 Percepção na água. Vantagem contra agarrão.' },
          { name: 'Visão Noturna', cost: 'Passiva', description: 'Enxerga em escuridão parcial.' },
          { name: 'Navegante Experiente', cost: 'Passiva', description: 'Sem desvantagem em barcos ou clima extremo.' }
        ]
      },
      {
        level: 8,
        name: 'Folk of Rage (Tribal Furioso)',
        abilities: [
          { name: 'Fúria Incontrolável', cost: '2 EE+2 PV', description: 'Críticos automáticos, mas perde racionalidade.' }
        ],
        traits: [
          { name: 'Ímpeto', cost: 'Passiva', description: '+50% Força/Agilidade em ódio. Limites removidos.' },
          { name: 'Até a Morte', cost: 'Passiva', description: 'Imune mental (exceto calma). Exaustão ao zerar PV.' },
          { name: 'Metabolismo Acelerado', cost: 'Passiva', description: 'Resistência veneno. Álcool não afeta.' },
          { name: 'Fluidez', cost: 'Passiva', description: 'Em Fúria na água/chuva, recebe resistência espiritual.' }
        ]
      },
      {
        level: 7,
        name: 'Navigator (Navegador)',
        abilities: [
          { name: 'Criar Água', cost: '5 EE', description: 'Cria garoa em raio de 50m.' }
        ],
        traits: [
          { name: 'Navegação', cost: 'Passiva', description: 'Nunca se perde no mar.' },
          { name: 'Mergulhador', cost: 'Passiva', description: '1 hora submerso. Dobra velocidade na água.' },
          { name: 'Tomo das Águas', cost: 'Passiva', description: '3 feitiços 4° escala, 1 de 3°. Manipula água.' },
          { name: 'Truque do Navegador', cost: 'Passiva', description: 'Custo metade para feitiços tempestade na água/umidade.' },
          { name: 'Fôlego', cost: 'Passiva', description: '+4 Movimentação base.' }
        ]
      },
      {
        level: 6,
        name: 'Wind-blessed (Abençoado pelo Vento)',
        abilities: [
          { name: 'Voo', cost: '3 EE', description: 'Voa por 3 turnos. Movimentação x1.5.' },
          { name: 'Bolsão de Ar', cost: '1 EE', description: 'Amortece queda.' },
          { name: 'Lâmina de Vento', cost: '2 EE', description: 'Lâmina de ar (2D8+2 Cortante).' }
        ],
        traits: [
          { name: 'Tomo do Vento', cost: 'Passiva', description: '3 feitiços 4° vento, 2 de 3°. Habilidades viram feitiços.' },
          { name: 'Tufão', cost: 'Passiva', description: 'Força soma em feitiços de tempestade. -2 Vontade.' },
          { name: 'Aeromancia', cost: 'Passiva', description: 'Manipula atmosfera.' }
        ]
      },
      {
        level: 5,
        name: 'Ocean Songster (Cantor dos Mares)',
        abilities: [
          { name: 'Melodia Eletrizante', cost: '5 EE', description: '6D6 Elétrico em 20m. Atordoa.' },
          { name: 'Canção da Sereia', cost: '2 EE/T', description: 'Atrai inimigos (falha Vontade). Aliados +3 Luta.' },
          { name: 'Infusão Trovejante', cost: '4 EE', description: 'Arma causa +1 dado elétrico por 5 turnos.' }
        ],
        traits: [
          { name: 'Sangue dos Tritões', cost: 'Passiva', description: '2 Ações Livres. Comunica com marinhos.' },
          { name: 'Alma Artística', cost: 'Passiva', description: 'Surdos ouvem. Custo vocal reduzido.' },
          { name: 'Relâmpago da Purificação', cost: 'Passiva', description: 'Dano extra em malignos/mortos-vivos.' },
          { name: 'Tomo das Tempestades', cost: 'Passiva', description: 'Feitiços elétricos/água/vento (3° e 2° escala).' },
          { name: 'Estática Aprimorada', cost: 'Passiva', description: 'Mensagem via eletricidade.' },
          { name: 'Cantoria Pessoal', cost: 'Passiva', description: 'Habilidade autoral.' }
        ]
      }
    ]
  },
  {
    id: 'error',
    arcana: 'VI - Os Amantes',
    name: 'Os Amantes (The Error)',
    image: 'https://i.imgur.com/1KPi8sc.jpeg',
    portrait: 'https://i.imgur.com/1KPi8sc.jpeg',
    symbol: 'https://i.imgur.com/kR74tFj.jpeg',
    quote: 'A realidade tem falhas que podem ser exploradas.',
    description: 'Especialistas em roubos e mestres da enganação. Seus poderes têm como base o abuso do conceito de “roubo”.',
    sequences: [
      {
        level: 9,
        name: 'Marauder (Saqueador)',
        abilities: [
          { name: 'Roubar', cost: '1 EE', description: 'Rouba objetos (Crime + PRE). Raio PRE x 4m.' },
          { name: 'Avaliar', cost: '1 EE', description: 'Estima qualidade, valor e autenticidade.' }
        ],
        traits: [
          { name: 'Destreza Espiritual', cost: 'Passiva', description: '+1 PRE. EE baseada em Presença.' },
          { name: 'Mãos Ágeis', cost: 'Passiva', description: 'Treino em Reflexos sem limite.' },
          { name: 'Hábitos Noturnos', cost: 'Passiva', description: 'Visão em escuridão parcial.' },
          { name: 'Especialista em Roubos', cost: 'Passiva', description: 'Reflexo soma na DT de Roubo.' }
        ]
      },
      {
        level: 8,
        name: 'Swindler (Vigarista)',
        abilities: [
          { name: 'Ilusionismo', cost: '1 EE', description: 'Cria ilusões. Apenas você usa Reflexo para o teste.' }
        ],
        traits: [
          { name: 'Manipular', cost: 'Passiva', description: 'Vantagem Enganação/Diplomacia/Crime. Inimigo desvantagem mental.' },
          { name: 'Agilidade', cost: 'Passiva', description: 'Treina Reflexo.' },
          { name: 'Golpista', cost: 'Passiva', description: '+1 AGI, -1 ESP.' },
          { name: 'Mestre da Mentira', cost: 'Passiva', description: 'Pode criar livremente pequenas ilusões.' }
        ]
      },
      {
        level: 7,
        name: 'Cryptologist (Criptologista)',
        abilities: [
          { name: 'Crackear', cost: '1 EE', description: 'Decripta códigos, idiomas e nomes honoríficos.' }
        ],
        traits: [
          { name: 'Antivírus', cost: 'Passiva', description: 'Imune a ilusões e controles mentais.' },
          { name: 'Decriptar', cost: 'Passiva', description: 'Analisa veracidade de fatos. +2 Simbolismo.' },
          { name: 'Código Fonte', cost: 'Passiva', description: '+2 perícias místicas e +2 não combativas.' }
        ]
      },
      {
        level: 6,
        name: 'Prometheus (Prometeus)',
        abilities: [
          { name: 'Roubar (Conceitual)', cost: '2/4 EE', description: 'Rouba habilidades, distância ou posição. (3 habilidades máx).' }
        ],
        traits: [
          { name: 'Subtração', cost: 'Passiva', description: 'Alvo não pode usar habilidade roubada.' },
          { name: 'Alcance', cost: 'Passiva', description: 'Roubo raio 30m.' }
        ]
      },
      {
        level: 5,
        name: 'Dream Stealer (Ladrão de Sonhos)',
        abilities: [
          { name: 'Infundir Sonho', cost: '4 EE', description: 'Entra fisicamente nos sonhos.' }
        ],
        traits: [
          { name: 'Ladrão de Sonhos', cost: 'Passiva', description: 'Rouba pensamentos e intenções. Deve realizar ação roubada.' },
          { name: 'Monopólio do Conhecimento', cost: 'Passiva', description: 'Rouba conhecimento.' },
          { name: 'Destreza', cost: 'Passiva', description: 'Roubar como reação defensiva.' },
          { name: 'Espólios do Saqueador', cost: 'Passiva', description: 'Subespaço de inventário para furtos.' }
        ]
      }
    ]
  },
  {
    id: 'red-priest',
    arcana: 'VII - A Carruagem',
    name: 'A Carruagem (Red Priest)',
    image: 'https://i.imgur.com/mnatWgO.jpeg',
    portrait: 'https://i.imgur.com/mnatWgO.jpeg',
    symbol: 'https://i.imgur.com/OlrI93i.jpeg',
    quote: 'A guerra é a única cerimônia que importa.',
    description: 'Foco em causar destruição, manipular as massas e guerra.',
    sequences: [
      {
        level: 9,
        name: 'Hunter (Caçador)',
        abilities: [],
        traits: [
          { name: 'Caçar', cost: 'Passiva', description: '+2 Pontaria.' },
          { name: 'Aprimoramento Físico – Abate', cost: 'Passiva', description: '+1 Força/Agilidade, +1 dano à distância.' },
          { name: 'Aprimoramento Físico – Perseguição', cost: 'Passiva', description: '+1 Força/Agilidade, recupera vida em combate.' },
          { name: 'Rastreamento', cost: 'Passiva', description: '+3 Sobrevivência.' },
          { name: 'Emboscar', cost: 'Passiva', description: 'Armadilhas causam +1 dado de dano.' },
          { name: 'Combatente de longo alcance', cost: 'Passiva', description: '-2 Vigor, +3 testes Agilidade (combate), +3 movimento.' }
        ]
      },
      {
        level: 8,
        name: 'Provoker (Provocador)',
        abilities: [
          { name: 'Provocar', cost: '2 EE', description: 'Aplica perícia Provocar em 3 alvos. DT -5.' }
        ],
        traits: [
          { name: 'Karma', cost: 'Passiva', description: 'Vantagem em provocação.' },
          { name: 'Em Fuga', cost: 'Passiva', description: '+4 Movimentação fugindo, -2 resistência física.' },
          { name: 'Fofoca', cost: 'Passiva', description: '+3 obter informações.' },
          { name: 'Perícia Especial – Provocação', cost: 'Passiva', description: 'Intimidar vira Provocar. Alvos focam em você.' },
          { name: 'Visão de Túnel', cost: 'Passiva', description: 'Dano mútuo +1D6. Alvo perde 1 INT e desvantagem mental.' }
        ]
      },
      {
        level: 7,
        name: 'Pyromaniac (Piromaníaco)',
        abilities: [
          { name: 'Bola de Fogo', cost: '2 EE', description: '2D6 Ígneo. Pode usar chama existente.' },
          { name: 'Corvos Chamuscados', cost: '2 EE/un', description: 'Corvos de fogo (1D6 cada). Teleguiado.' },
          { name: 'Lança de Apolo', cost: '4-8 EE', description: 'Carrega calor. Dano massivo (4D5+).' },
          { name: 'Muro Flamejante', cost: '3/6 EE', description: 'Barreira de fogo 5 turnos.' },
          { name: 'Manto de Chamas', cost: '1 EE/T', description: 'Resistência total a fogo.' },
          { name: 'Armamento Incandescente', cost: '3 EE', description: 'Cria arma de fogo.' }
        ],
        traits: [
          { name: 'Mago das Chamas', cost: 'Passiva', description: 'Habilidades são feitiços.' },
          { name: 'Tomo Flamejante', cost: 'Passiva', description: '3 feitiços 4° escala Fogo.' },
          { name: 'Módulos de Chamas', cost: 'Passiva', description: 'Compressão, Dispersão, Ignição Tardia.' }
        ]
      },
      {
        level: 6,
        name: 'Conspirator (Conspirador)',
        abilities: [
          { name: 'Mestre das Fraudes', cost: '3 EE', description: 'Vantagem e +3 para enganar/provocar grupos.' },
          { name: 'Tornar Ataque', cost: '5 EE', description: 'Teleporta para local de impacto de ataque longo.' }
        ],
        traits: [
          { name: 'Manipular as massas', cost: 'Passiva', description: '+2 Enganação/Provocação. Provocar afeta 5.' },
          { name: 'Causar o Caos', cost: 'Passiva', description: 'Pode redirecionar ódio do Provocar.' },
          { name: 'Experiência', cost: 'Passiva', description: '+2 investigar fraude.' },
          { name: 'Reunir Informações', cost: 'Passiva', description: '+5 Atualidades.' }
        ]
      },
      {
        level: 5,
        name: 'Reaper (Ceifador)',
        abilities: [
          { name: 'Ponto Fraco', cost: '3 EE', description: 'Dano x1.5. Descobre vulnerabilidade.' },
          { name: 'Executar', cost: '8 EE', description: 'Dano x3 em ponto fraco. Ignora defesas.' },
          { name: 'Abatedouro', cost: 'Var', description: 'Divide projétil/habilidade.' },
          { name: 'Lampejo Flamejante', cost: '3 EE', description: 'Teleporta para chama.' },
          { name: 'Encarnação do Enxofre', cost: '10 EE', description: 'Dobra efetividade de fogo. Toma dano por turno.' }
        ],
        traits: []
      }
    ]
  },
  {
    id: 'visionary',
    arcana: 'VIII - A Justiça',
    name: 'A Justiça (The Visionary)',
    image: 'https://i.imgur.com/njOZHWk.jpeg',
    portrait: 'https://i.imgur.com/njOZHWk.jpeg',
    symbol: 'https://i.imgur.com/WjQlWgP.jpeg',
    quote: 'A mente humana é um livro aberto.',
    description: 'Experts em manipulação mental. Podem ler mentes, discernir emoções e hipnotizar.',
    sequences: [
      {
        level: 9,
        name: 'Spectator (Espectador)',
        abilities: [],
        traits: [
          { name: 'Mente e Alma', cost: 'Passiva', description: '+1 Inteligência. Adiciona Inteligência à EE.' },
          { name: 'Perfil de Base', cost: 'Passiva', description: 'Dobra proficiência após observar alvo.' },
          { name: 'Assimilar', cost: 'Passiva', description: '-5 Enganação contra você.' },
          { name: 'Visão Privilegiada', cost: 'Passiva', description: 'Detalhes a 50m. +2 Pontaria.' },
          { name: 'Espectador', cost: 'Passiva', description: 'Dificilmente notado.' }
        ]
      },
      {
        level: 8,
        name: 'Telepathist (Telepata)',
        abilities: [
          { name: 'Ler Mente', cost: '2 EE', description: 'Lê pensamentos superficiais.' },
          { name: 'Induzir', cost: '3 EE', description: 'Altera uma palavra no pensamento.' },
          { name: 'Telepatia', cost: '2 EE', description: 'Comunicação mental.' },
          { name: 'Bala Psíquica', cost: '2 EE', description: '2D6 dano Mental.' }
        ],
        traits: [
          { name: 'Mente Resiliente', cost: 'Passiva', description: '+5 SAN, Res Mental 3.' },
          { name: 'Autopreservação', cost: 'Passiva', description: 'Sente pensamentos negativos.' },
          { name: 'Perfurar Consciência', cost: 'Passiva', description: 'Dano massivo causa Demência.' }
        ]
      },
      {
        level: 7,
        name: 'Psychologist (Psicólogo)',
        abilities: [
          { name: 'Vontade Dracônica', cost: '3 EE', description: 'Inflige Pavor por 3 turnos.' },
          { name: 'Caos em Massa', cost: '8 EE', description: 'Confusão mental em área.' },
          { name: 'Frenesi', cost: '4 EE', description: 'Alvo ataca próximos.' },
          { name: 'Aplacar', cost: '4 EE', description: 'Acalma e desacorda.' }
        ],
        traits: [
          { name: 'Consciente Coletivo', cost: 'Passiva', description: 'Acesso via rituais.' },
          { name: 'Instinto do Predador', cost: 'Passiva', description: 'Sentidos aprimorados.' },
          { name: 'Autocontrole', cost: 'Passiva', description: 'Resistência total a controle mental.' }
        ]
      },
      {
        level: 6,
        name: 'Hypnotist (Hipnólogo)',
        abilities: [
          { name: 'Hipnose de Batalha', cost: '4 EE', description: 'Coloca em transe e comanda ação.' },
          { name: 'Invisibilidade Psicológica', cost: '3 EE/m', description: 'Diverge atenção, tornando-se imperceptível.' }
        ],
        traits: [
          { name: 'Hipnotismo', cost: 'Passiva', description: 'Indução via objetos.' },
          { name: 'Realeza das Raças', cost: 'Passiva', description: 'Escamas ilusórias (RD Mental/Física).' },
          { name: 'Acalmar Espírito', cost: 'Passiva', description: 'Remove Loucura (1D6).' }
        ]
      },
      {
        level: 5,
        name: 'Dreamwalker (Caminhante dos Sonhos)',
        abilities: [
          { name: 'Travessia dos Sonhos', cost: '4 EE', description: 'Entra e viaja por sonhos.' }
        ],
        traits: [
          { name: 'Mestre da imaginação', cost: 'Passiva', description: 'Guia sonhos.' },
          { name: 'Etéreo', cost: 'Passiva', description: 'Imune em sonhos. SAN é PV.' },
          { name: 'Trauma Profundo', cost: 'Passiva', description: 'Dano dobra em desacordados.' },
          { name: 'Corpo e Mente', cost: 'Passiva', description: 'Dano no sonho vira físico ao acordar.' },
          { name: 'Semiconsciente', cost: 'Passiva', description: 'Sente real dentro do sonho.' },
          { name: 'Olhar Dracônico', cost: 'Passiva', description: 'Ler Mente permanente.' }
        ]
      }
    ]
  },
  {
    id: 'hermit',
    arcana: 'IX - O Eremita',
    name: 'O Eremita (The Hermit)',
    image: 'https://i.imgur.com/aD5xckN.jpeg',
    portrait: 'https://i.imgur.com/aD5xckN.jpeg',
    symbol: 'https://i.imgur.com/UbmnArf.jpeg',
    quote: 'O mistério é a sombra projetada pelo conhecimento.',
    description: 'Especialistas no misticismo. Seus domínios envolvem o conhecimento do oculto.',
    sequences: [
      {
        level: 9,
        name: 'Mystery Pryer (Espreitador de Mistérios)',
        abilities: [
          { name: 'Visão Espiritual – espreitar', cost: '2 EE', description: 'Vê energias. Pode "Espreitar" segredos do mundo espiritual.' }
        ],
        traits: [
          { name: 'Toque do Oculto', cost: 'Passiva', description: '+2 ESP. +2 EE/seq.' },
          { name: 'Físico Desafortunado', cost: 'Passiva', description: '-1 atributo físico.' },
          { name: 'Invasão de Conhecimento', cost: 'Passiva', description: 'Escuta murmúrios.' },
          { name: 'Feitiçaria Antiga', cost: 'Passiva', description: 'Aprende 3 rituais.' },
          { name: 'Adivinhação', cost: 'Passiva', description: 'Usa instrumentos.' },
          { name: 'Olhos de Espreitar Mistérios', cost: 'Passiva', description: 'Vê o oculto naturalmente.' }
        ]
      },
      {
        level: 8,
        name: 'Combat Student (Estudante do Combate)',
        abilities: [
          { name: 'Por um Fio', cost: '3 EE', description: 'Reação: +5 Defesa.' }
        ],
        traits: [
          { name: 'Espreitar', cost: 'Passiva', description: 'Usa em segredos físicos.' },
          { name: 'Enxergar', cost: 'Passiva', description: 'Espreita oponente. +3 Luta/Pontaria. Treino Esquiva.' },
          { name: 'Visão Privilegiada', cost: 'Passiva', description: 'Usa ESP para combater.' }
        ]
      },
      {
        level: 7,
        name: 'Warlock (Feiticeiro)',
        abilities: [],
        traits: [
          { name: 'Foco Absoluto', cost: 'Passiva', description: 'Vantagem Concentração.' },
          { name: 'Estudo Arcano', cost: 'Passiva', description: 'Aprende componentes elementais. Habilidades viram magia.' },
          { name: 'Forças Naturais', cost: 'Passiva', description: 'Crie 4 feitiços.' },
          { name: 'Místico', cost: 'Passiva', description: 'Escolha: Fragmentar Consciência, Conversão de Energia ou Conjuração Dupla.' },
          { name: 'Carta de Feitiços', cost: 'Passiva', description: 'Cria 5 feitiços 4° escala.' }
        ]
      },
      {
        level: 6,
        name: 'Scroll Professor (Professor de Pergaminhos)',
        abilities: [
          { name: 'Escrever', cost: '2 EE+', description: 'Cria pergaminho de magia (Ação Bônus ativação).' },
          { name: 'Runa Arcana', cost: '2 EE+', description: 'Cria runas.' }
        ],
        traits: [
          { name: 'Gatilho', cost: 'Passiva', description: 'Aprende componentes de Gatilho.' },
          { name: 'Escritura Avançada', cost: 'Passiva', description: 'Runa permanente ligada à alma.' },
          { name: 'Tese Arcana', cost: 'Passiva', description: 'Cria 3 feitiços 4° e 1 de 3°.' }
        ]
      },
      {
        level: 5,
        name: 'Constellation Master (Mestre de Constelações)',
        abilities: [
          { name: 'Via Láctea', cost: '20 EE', description: 'Invoca estrelas. Protege contra divinação.' },
          { name: 'Supernova', cost: 'X Estrelas', description: 'Colisão de estrelas. Dano Cósmico.' },
          { name: 'Gaiola Estelar', cost: '1 Estrela', description: 'Prende alvo e impede movimento.' },
          { name: 'Luminofilia', cost: 'X Estrelas', description: 'Teleporte como luz.' },
          { name: 'Segregação Cósmica', cost: '8 Estrelas', description: 'Isola área.' },
          { name: 'Consumir', cost: '1 Estrela', description: 'Recupera PV.' },
          { name: 'Ímpeto Cósmico', cost: '1/2 Estrelas', description: 'Acelera lançamento de feitiço.' }
        ],
        traits: [
          { name: 'Benção dos Astros', cost: 'Passiva', description: 'Redução Espiritual sob estrelas.' },
          { name: 'Livro de Feitiços', cost: 'Passiva', description: 'Mais feitiços.' },
          { name: 'Espreitar Segredos', cost: 'Passiva', description: 'Vê através de tudo.' }
        ]
      }
    ]
  },
  {
    id: 'wheel-of-fortune',
    arcana: 'X - Roda da Fortuna',
    name: 'Roda da Fortuna (Wheel of Fortune)',
    image: 'https://i.imgur.com/QjlRZ96.jpeg',
    portrait: 'https://i.imgur.com/QjlRZ96.jpeg',
    symbol: 'https://i.imgur.com/geKYuye.jpeg',
    quote: 'A sorte é uma variável que eu controlo.',
    description: 'Adeptos na manipulação do destino, sorte e probabilidade.',
    sequences: [
      {
        level: 9,
        name: 'Monster (Monstro)',
        abilities: [],
        traits: [
          { name: 'Sexto Sentido', cost: 'Passiva', description: '+4 Intuição. Vê coisas ocultas. Visões.' },
          { name: 'Protegido do destino', cost: 'Passiva', description: 'Evita críticos. Primeiro golpe letal erra.' },
          { name: 'Mediunidade', cost: 'Passiva', description: 'Ao tocar, vê passado ou futuro.' },
          { name: 'Corpo Espiritual', cost: 'Passiva', description: '+2 ESP, -1 Físico. +2 EE/Nvl.' }
        ]
      },
      {
        level: 8,
        name: 'Robot (Robô)',
        abilities: [
          { name: 'Espiar Destino', cost: '4 EE', description: 'Adivinhação direta sem instrumentos.' }
        ],
        traits: [
          { name: 'Numerologia', cost: 'Passiva', description: '+3 Matemática/Pontaria.' },
          { name: 'Prever trajetória', cost: 'Passiva', description: '+3 Defesa projéteis. Esquiva balas.' },
          { name: 'Precisão Robótica', cost: 'Passiva', description: '+1 Letalidade, +3 Pontaria.' },
          { name: 'Percepção Atemporal', cost: 'Passiva', description: 'Nunca desprevenido.' },
          { name: 'Autopreservação', cost: 'Passiva', description: 'Fecha olhos para perigo.' },
          { name: 'Contra-adivinhação', cost: '2 EE', description: 'Deflete adivinhação.' }
        ]
      },
      {
        level: 7,
        name: 'Lucky One (Sortudo)',
        abilities: [
          { name: 'Divina Comédia', cost: '1 Sorte', description: 'Refaz teste de alvo em 30m.' }
        ],
        traits: [
          { name: 'Sorte do Dia', cost: 'Passiva', description: 'Joga D4 diário. Soma em todos os testes.' },
          { name: 'A Prova de Falhas', cost: 'Passiva', description: 'Rerola resultado 1.' },
          { name: 'Trajetória Impossível', cost: 'Passiva', description: '+1 Letalidade. Crítico +1 dado.' },
          { name: 'Desenvolvimento Cômico', cost: 'Passiva', description: 'Gasta Sorte em adivinhação.' },
          { name: 'Gravidade do Acaso', cost: 'Passiva', description: 'Críticos maximizados.' },
          { name: 'Simples Sorte', cost: 'Passiva', description: 'Vantagem sorte pura.' }
        ]
      },
      {
        level: 6,
        name: 'Calamity Priest (Arauto da Catástrofe)',
        abilities: [
          { name: 'Catástrofe', cost: 'X Sorte', description: 'Causa infortúnio e penalidade em área.' },
          { name: 'Tempestade Psíquica', cost: '5 EE', description: 'Dano mental igual Infortúnio Acumulado.' }
        ],
        traits: [
          { name: 'Calamidade', cost: 'Passiva', description: 'Atrai e prevê desastres.' },
          { name: 'Destino Inconstante', cost: 'Passiva', description: 'Guarda D20s para substituir.' },
          { name: 'Improvável', cost: 'Passiva', description: 'Gasta Sorte para evento impossível.' },
          { name: 'Maré de Azar', cost: 'Passiva', description: 'Sorte pode virar penalidade.' },
          { name: 'Emanador do Infortúnio', cost: 'Passiva', description: 'Inimigos falham mais.' },
          { name: 'Infortúnio Acumulado', cost: 'Passiva', description: 'Acumula falhas para usar depois.' }
        ]
      },
      {
        level: 5,
        name: 'Winner (Ganhador)',
        abilities: [
          { name: 'Manipular os Dados', cost: '2 EE', description: 'Invalida rolagem próxima.' },
          { name: 'Atribuir – Sorte', cost: '5 EE', description: 'Dá bônus sorte a alvo.' },
          { name: 'Atribuir – Azar', cost: '6 EE', description: 'Dá penalidade sorte a alvo.' },
          { name: 'Espiar Destino (Up)', cost: '4 EE', description: 'Mediunidade ilimitada.' },
          { name: 'Fluxo da Fortuna', cost: '5 Sorte', description: 'Causa evento impossível.' }
        ],
        traits: [
          { name: 'Complexa Sorte', cost: 'Passiva', description: 'Sorte fixa 6. Ganha +1/hora.' },
          { name: 'Definir Finalidade', cost: 'Passiva', description: 'Define resultado de dado.' },
          { name: 'Fio do Destino', cost: 'Passiva', description: 'Vê cores do destino.' },
          { name: 'Cassino de Possibilidades', cost: 'Passiva', description: '+1 acumulativo por dado rolado no turno.' },
          { name: 'Roda da Fortuna', cost: 'Passiva', description: 'Garante sucesso em sorte.' }
        ]
      }
    ]
  },
  {
    id: 'twilight-giant',
    arcana: 'XI - A Força',
    name: 'A Força (Twilight Giant)',
    image: 'https://i.imgur.com/SlKitaY.jpeg',
    portrait: 'https://i.imgur.com/SlKitaY.jpeg',
    symbol: 'https://i.imgur.com/hljZ3gZ.jpeg',
    quote: 'O crepúsculo é o silêncio final.',
    description: 'Possui diversas habilidades físicas relacionadas ao combate, tanto ofensivas quanto defensivas.',
    sequences: [
      {
        level: 9,
        name: 'Warrior (Guerreiro)',
        abilities: [
          { name: 'Benção de Aumir', cost: '2 EE', description: '+1 status físico. Pode ganhar ação extra.' }
        ],
        traits: [
          { name: 'Descendente dos Gigantes', cost: 'Passiva', description: '-1 ESP, +1 FOR/AGI/VIG x2.' },
          { name: 'Lutador Experiente', cost: 'Passiva', description: '+3 Luta. Treina arma. Sem desvantagem terreno/clima.' },
          { name: 'Mestre de campo', cost: 'Passiva', description: 'Move aliados no campo.' },
          { name: 'Especialização – Poder Bruto', cost: 'Passiva', description: 'Usa maior status físico para armas.' }
        ]
      },
      {
        level: 8,
        name: 'Pugilist (Pugilista)',
        abilities: [
          { name: 'Impacto Colossal', cost: '3 EE', description: 'Dobra dano concussão. Usa Vigor.' }
        ],
        traits: [
          { name: 'Briga de Rua', cost: 'Passiva', description: '+3 Luta/Esquiva/Bloqueio. Reação extra com 1 EE.' },
          { name: 'Autodefesa', cost: 'Passiva', description: 'Ataques desarmados têm vantagem (+3).' },
          { name: 'Resistência Paranormal', cost: 'Passiva', description: 'Resistência a dano Espiritual +3.' },
          { name: 'Constituição', cost: 'Passiva', description: '+3 em testes de Constituição.' },
          { name: 'Muralha', cost: 'Passiva', description: '+2 RD Físico por inimigo focado em você.' }
        ]
      },
      {
        level: 7,
        name: 'Weapon Master (Mestre de Armas)',
        abilities: [
          { name: 'Herdeiro dos Antigos', cost: '3 EE', description: '+1 Defesa por equipamento.' },
          { name: 'Visão Espiritual', cost: '2 EE', description: 'Vê energias e auras.' }
        ],
        traits: [
          { name: 'Proficiência Bélica', cost: 'Passiva', description: 'Treinado em todas armas. +1 perícia por arma já treinada.' },
          { name: 'Gladiador Rúnico', cost: 'Passiva', description: '+1 artefato. +3 testes com artefatos.' },
          { name: 'Mestre de Batalha', cost: 'Passiva', description: '+1 Defesa por inimigo próximo.' },
          { name: 'Experiência de Combate', cost: 'Passiva', description: 'Escolha um estilo de combate.' },
          { name: 'Aprimoramento Espiritual', cost: 'Passiva', description: 'Aprende um ritual.' }
        ]
      },
      {
        level: 6,
        name: 'Dawn Paladin (Paladino do Alvorecer)',
        abilities: [
          { name: 'Luz da Manhã', cost: '4 EE', description: 'Dispersa ilusões, afasta mortos.' },
          { name: 'Armadura do Amanhecer', cost: '5 EE', description: 'RD 5 global (até 40 acumulado).' },
          { name: 'Arma da Alvorada', cost: '10 EE', description: 'Arma de luz 4D6+.' },
          { name: 'Arsenal Luminoso', cost: '1 EE', description: 'Sintetiza armas de luz 1D8.' },
          { name: 'Fragmentar', cost: '10 EE', description: 'Explosão de luz 6D10.' }
        ],
        traits: [
          { name: 'Guerreiro da Purificação', cost: 'Passiva', description: 'Vantagem vs maligno.' },
          { name: 'Corpo Reforçado', cost: 'Passiva', description: '+4 PV.' }
        ]
      },
      {
        level: 5,
        name: 'Guardian (Guardião)',
        abilities: [
          { name: 'Barreira Absoluta', cost: '1 EE/T', description: 'Postura defensiva. Defesa +50%. Tank.' }
        ],
        traits: [
          { name: 'Constituição 2', cost: 'Passiva', description: '+1 Const, +2 Vida/Nvl.' },
          { name: 'Paladino', cost: 'Passiva', description: 'Resistência Frio/Degenerativo.' },
          { name: 'Proteção da Luz', cost: 'Passiva', description: 'Reflete dano solar em malignos.' },
          { name: 'Aura do Guardião', cost: 'Passiva', description: '+1 Defesa para aliados.' }
        ]
      }
    ]
  },
  {
    id: 'hanged-man',
    arcana: 'XII - O Enforcado',
    name: 'O Enforcado (The Hanged Man)',
    image: 'https://i.imgur.com/ZDflJP7.jpeg',
    portrait: 'https://i.imgur.com/ZDflJP7.jpeg',
    symbol: 'https://i.imgur.com/mNtWrjL.jpeg',
    quote: 'O sacrifício é o caminho para a divindade.',
    description: 'Sequência diretamente ligada a forças primitivas e ocultas. É a representação da degradação humana.',
    sequences: [
      {
        level: 9,
        name: 'Secrets Supplicant (Suplicante de Segredos)',
        abilities: [
          { name: 'Visão Espiritual - Suplicante', cost: '1 EE', description: 'Visão espiritual sensível. Pode ativar sozinha.' }
        ],
        traits: [
          { name: 'Murmúrios do Caído', cost: 'Passiva', description: 'Ouve vozes.' },
          { name: 'Maldição – Corrupção', cost: 'Passiva', description: '+2 ESP. -1 SAN/Lv. -1 resistência SAN.' },
          { name: 'Cordeiro', cost: 'Passiva', description: 'Bônus rituais. Aprende 3 rituais.' },
          { name: 'Cultista', cost: 'Passiva', description: 'Rituais rápidos e baratos.' },
          { name: 'Sem dor, sem ganhos', cost: 'Passiva', description: '+1 ritual por ponto de perícia.' }
        ]
      },
      {
        level: 8,
        name: 'Listener (Ouvinte)',
        abilities: [
          { name: 'Putrefazer', cost: '1 EE', description: 'Absorve dano degenerativo como cura.' }
        ],
        traits: [
          { name: 'Maldição – Corrupção Superior', cost: 'Passiva', description: '-1 SAN/Lv. Ouve murmúrios claros.' },
          { name: 'Acolhido dos Abominados', cost: 'Passiva', description: '3 bençãos/maldições de entidades.' },
          { name: 'Espírito Apodrecido', cost: 'Passiva', description: 'Reflete metade ataque mental como degenerativo.' },
          { name: 'Dádiva do Ouvinte', cost: 'Passiva', description: 'Escuta pensamentos sobre você em 10m.' },
          { name: 'Corpo Aberto', cost: 'Passiva', description: 'Sente autoridades.' }
        ]
      },
      {
        level: 7,
        name: 'Shadow Ascetic (Asceta das Sombras)',
        abilities: [
          { name: 'Submergir na Escuridão', cost: '2 EE', description: 'Torna-se imperceptível nas sombras.' },
          { name: 'Servo das Sombras', cost: '3 EE', description: 'Invoca sombra para restringir alvos.' },
          { name: 'Aprisionamento Sombrio', cost: '3 EE', description: 'Sombra prende área. Dano degenerativo.' }
        ],
        traits: [
          { name: 'Tomo das Sombras', cost: 'Passiva', description: '4 feitiços sombra. Manipula sombras.' },
          { name: 'Agraciar Prole', cost: 'Passiva', description: 'Servo usa seus feitiços.' }
        ]
      },
      {
        level: 6,
        name: 'Rose Bishop (Bispo Carmesim)',
        abilities: [
          { name: 'Este é o meu corpo', cost: '1 RC', description: 'Molda carne. Aloja em estômago.' },
          { name: 'Este é o meu sangue', cost: '3 RC', description: 'Integra em sangue hospedeiro.' },
          { name: 'Carne Pútrida', cost: 'X RC', description: 'Explode carne (Dano Degenerativo).' },
          { name: 'Manto Encouraçado', cost: '2 RC', description: 'Armadura de carne.' }
        ],
        traits: [
          { name: 'Esculpir a Carne', cost: 'Passiva', description: 'Converte PV em Reserva de Carne (RC). Fraqueza sagrado.' },
          { name: 'Reserva de Carne', cost: 'Passiva', description: 'Armazena 4xNível RC. Absorve mortos.' },
          { name: 'Receba com Tuas mãos', cost: 'Passiva', description: 'Regenera com RC.' },
          { name: 'Feitiçaria Proibida', cost: 'Passiva', description: 'Usa RC pra magia (Custa SAN).' },
          { name: 'Tomo de Sangue', cost: 'Passiva', description: '4 feitiços sangue.' },
          { name: 'Compulsão', cost: 'Passiva', description: 'Desejo por sangue humano.' }
        ]
      },
      {
        level: 5,
        name: 'Shepherd (Pastor)',
        abilities: [
          { name: 'Tomai e Comei', cost: '4 EE', description: 'Devora corpo/alma. Ganha PV/SAN.' },
          { name: 'Pastorear', cost: '1 EE', description: 'Usa habilidades de cordeiro.' },
          { name: 'Consumir Existência', cost: 'Padrão', description: 'Consome cordeiro por SAN/EE.' }
        ],
        traits: [
          { name: 'O Senhor é meu Pastor', cost: 'Passiva', description: 'Hospeda 4 almas (Cordeiros).' },
          { name: 'Nada me Faltará', cost: 'Passiva', description: 'Mantém habilidades de cordeiros.' },
          { name: 'Seja feita a sua Vontade', cost: 'Passiva', description: 'Concentração independente. Vê memórias.' },
          { name: 'Crucificado', cost: 'Passiva', description: 'Escuta lamentações.' }
        ]
      }
    ]
  },
  {
    id: 'death',
    arcana: 'XIII - A Morte',
    name: 'A Morte (Death)',
    image: 'https://i.imgur.com/PLCsP2z.jpeg',
    portrait: 'https://i.imgur.com/PLCsP2z.jpeg',
    symbol: 'https://i.imgur.com/l0TFn6C.jpeg',
    quote: 'A morte é apenas um novo começo.',
    description: 'Domina autoridades sobre a morte e os espíritos. São resistentes ao frio e à degeneração.',
    sequences: [
      {
        level: 9,
        name: 'Corpse Collector (Coletor de Cadáveres)',
        abilities: [
          { name: 'Visão Espiritual – Necrópsia', cost: '1 EE', description: 'Vê fraquezas de mortos. Bônus necrópsia.' }
        ],
        traits: [
          { name: 'Mortificação', cost: 'Passiva', description: 'Resistência Frio/Degenerativo/Físico. +1 ESP. Fraqueza Sagrado.' },
          { name: 'Cura Alterada', cost: 'Passiva', description: 'Cura sagrada fere. Degenerativo cura.' },
          { name: 'Domínio Sobre a Vida', cost: 'Passiva', description: '+LV pontos de vida.' }
        ]
      },
      {
        level: 8,
        name: 'Gravedigger (Coveiro)',
        abilities: [
          { name: 'Olhar da Morte', cost: '1 EE', description: 'Info sobre morto-vivo.' },
          { name: 'Vitalização Artificial', cost: '5 EE', description: 'Cria Zumbi Menor.' }
        ],
        traits: [
          { name: 'Hábitos Noturnos', cost: 'Passiva', description: '+5 Furtividade noite.' },
          { name: 'Afinidade Mórbida', cost: 'Passiva', description: 'Comunica com espíritos. Bônus vs mortos.' },
          { name: 'Na Fronteira', cost: 'Passiva', description: 'Vê espíritos. Resistência Espiritual.' },
          { name: 'Ritos dos Mortos', cost: 'Passiva', description: 'Aprende 2 rituais.' }
        ]
      },
      {
        level: 7,
        name: 'Spirit Medium (Medium)',
        abilities: [
          { name: 'Presença Autoritária', cost: '2 EE', description: 'Espíritos respondem perguntas.' }
        ],
        traits: [
          { name: 'Emprestar Poder', cost: 'Passiva', description: 'Bônus rituais. Aprende 2 rituais.' },
          { name: 'Conexão Mental', cost: 'Passiva', description: 'Comunica com mortos.' },
          { name: 'Mortificação – Singular', cost: 'Passiva', description: '3 pactos com espíritos.' },
          { name: 'Ritos Espirituais', cost: 'Passiva', description: 'Ritual separar alma.' }
        ]
      },
      {
        level: 6,
        name: 'Spirit Guide (Guia Espiritual)',
        abilities: [
          { name: 'Necromancia – Cadáver', cost: '3 EE', description: 'Zumbifica corpos.' },
          { name: 'Transfusão Vital', cost: '2 EE', description: 'Transfere PV.' },
          { name: 'Língua dos Caídos', cost: '3 EE', description: 'Ordem a criatura da morte.' },
          { name: 'Purificar', cost: '5 EE', description: 'Dano em espíritos.' }
        ],
        traits: [
          { name: 'Guia', cost: 'Passiva', description: 'Reverência de mortos.' },
          { name: 'Autoridade Crescente', cost: 'Passiva', description: '+1 limite Necromancia.' },
          { name: 'Mensageiro', cost: 'Passiva', description: 'Espírito mensageiro.' }
        ]
      },
      {
        level: 5,
        name: 'Gatekeeper (Guardião do Portão)',
        abilities: [
          { name: 'Porta do Submundo', cost: '6 EE', description: 'Abre portão. Suga/Arrasta alvos. Comandante dos Mortos.' },
          { name: 'Necromancia – Espírito', cost: '5 EE', description: 'Domina espíritos.' }
        ],
        traits: [
          { name: 'Templo Abominável', cost: 'Passiva', description: 'Abriga espíritos.' },
          { name: 'Corpo Aberto', cost: 'Passiva', description: 'Vulnerável possessão.' }
        ]
      }
    ]
  },
  {
    id: 'chained',
    arcana: 'XIV - Temperança',
    name: 'Temperança (The Chained)',
    image: 'https://i.imgur.com/dPOHvDZ.jpeg',
    portrait: 'https://i.imgur.com/dPOHvDZ.jpeg',
    symbol: 'https://i.imgur.com/Rc63rqZ.jpeg',
    quote: 'Desejo é uma corrente que deve ser quebrada.',
    description: 'Aqueles que lutam contra o próprio desejo, suprimindo-o, ou tornando-se escravos dele. Mutações e maldições.',
    sequences: [
      {
        level: 9,
        name: 'Prisoner (Prisioneiro)',
        abilities: [
          { name: 'Aprisionamento Voluntário', cost: '2 EE', description: 'Abraça a apatia para esconder intenções.' }
        ],
        traits: [
          { name: 'Improviso do Cativo', cost: 'Passiva', description: 'Treino em Crime. Arromba fechaduras.' },
          { name: 'Aprimoramento Físico', cost: 'Passiva', description: '+2 Atributos.' },
          { name: 'Maldição do Prisioneiro – Apatia', cost: 'Passiva', description: '-2 testes sociais, -1 Espiritualidade.' },
          { name: 'Maldição do Acorrentado – Libertação', cost: 'Passiva', description: 'Gera Pontos de Bestialidade (PB). 10 PB = Libertação (Ataca todos).' }
        ]
      },
      {
        level: 8,
        name: 'Lunatic (Lunático)',
        abilities: [
          { name: 'Surto Psicótico', cost: '4 EE', description: 'Zera INT, instinto assume. +RD, Luta.' },
          { name: 'Sobrecarga', cost: 'SAN/PV', description: 'Dano massivo físico.' }
        ],
        traits: [
          { name: 'Insanidade Própria', cost: 'Passiva', description: 'Vantagem mental. Distúrbio.' },
          { name: 'Fúria Berserker', cost: 'Passiva', description: '+1 Atributo / -1 INT acumulativo.' },
          { name: 'Maldição do Lunático - Insanidade', cost: 'Passiva', description: 'Acessos de loucura. Vantagem Intimidação.' }
        ]
      },
      {
        level: 7,
        name: 'Werewolf (Lobisomem)',
        abilities: [
          { name: 'Licantropia Parcial', cost: '2 PB', description: 'Muta parte (Cabeça, Dorso, Braços, Mãos, Pernas).' },
          { name: 'Metamorfose', cost: '5 PB', description: 'Vira lobo. Frenesi. Fraqueza prata.' }
        ],
        traits: [
          { name: 'Maldição do Licantropo – Predador', cost: 'Passiva', description: 'Lua cheia: Fome de carne humana.' },
          { name: 'Amizade Lupina', cost: 'Passiva', description: 'Lobos amigos.' }
        ]
      },
      {
        level: 6,
        name: 'Zombie (Zumbi)',
        abilities: [
          { name: 'Frigidez', cost: '2 EE', description: 'Dano gélido em ataques.' },
          { name: 'Maestria Pútrida', cost: '1 PB', description: 'Lama degenerativa 9m.' },
          { name: 'Comandante da Horda', cost: '1 PB', description: 'Controla zumbis.' }
        ],
        traits: [
          { name: 'Zumbificação', cost: 'Passiva', description: 'Mudança permanente.' },
          { name: 'Semi-Imortal', cost: 'Passiva', description: 'Só morre sem cérebro.' },
          { name: 'Recuperação Acelerada', cost: 'Passiva', description: 'Dobro recuperação.' },
          { name: 'Necrótico', cost: 'Passiva', description: 'Cura sagrada fere.' },
          { name: 'Canibalismo', cost: 'Passiva', description: 'Come carne p/ curar.' },
          { name: 'Rigor Mortis', cost: 'Passiva', description: 'RD Física. Res Frio/Deg.' },
          { name: 'Maldição do Zumbi – Voracidade', cost: 'Passiva', description: 'Fome carne humana.' },
          { name: 'Virulência', cost: 'Passiva', description: 'Infecta alvos.' },
          { name: 'Tomo do Desmorto', cost: 'Passiva', description: 'Feitiços morte.' }
        ]
      },
      {
        level: 5,
        name: 'Wraith (Espectro)',
        abilities: [
          { name: 'Mutação – Espectro', cost: '3 PB', description: 'Voo, Intangibilidade, Visão Noturna. Sanidade vira PV.' },
          { name: 'Possessão', cost: 'Conc', description: 'Controla corpo alvo.' },
          { name: 'Viagem Projetada', cost: '2 EE', description: 'Mundo espelhado.' },
          { name: 'Grito Espectral', cost: '6 EE', description: 'Dano mental/gélido área.' },
          { name: 'Invisibilidade', cost: '2 EE', description: 'Fica invisível.' }
        ],
        traits: [
          { name: 'Tomo Espectral', cost: 'Passiva', description: 'Feitiços morte.' },
          { name: 'Maldição Sequencial – Devorador de Almas', cost: 'Passiva', description: 'Fome almas lua cheia.' }
        ]
      }
    ]
  },
  {
    id: 'abyss',
    arcana: 'XV - O Diabo',
    name: 'O Diabo (The Abyss)',
    image: 'https://i.imgur.com/MErzaaO.jpeg',
    portrait: 'https://i.imgur.com/MErzaaO.jpeg',
    symbol: 'https://i.imgur.com/fwLcDZt.jpeg',
    quote: 'A corrupção é a verdadeira face do cosmos.',
    description: 'Possuem habilidades demoníacas, profanação e corrompem desejos.',
    sequences: [
      {
        level: 9,
        name: 'Criminal (Criminoso)',
        abilities: [
          { name: 'Herdar Pecado', cost: '2 EE', description: 'Recebe benefício baseado em pecado (Ira, Avareza, Gula, etc).' }
        ],
        traits: [
          { name: 'Aprimoramento Físico – Excesso de Violência', cost: 'Passiva', description: '+1 For/Agi/Vig. +3 Percepção.' },
          { name: 'Versatilidade', cost: 'Passiva', description: 'Usa todas armas.' },
          { name: 'Maligno', cost: 'Passiva', description: 'Tendência crime.' }
        ]
      },
      {
        level: 8,
        name: 'Fallen Angel (Anjo Caído)',
        abilities: [
          { name: 'Benção Diabólica', cost: '?', description: '2 feitiços demoníacos.' }
        ],
        traits: [
          { name: 'Sucumbir', cost: 'Passiva', description: 'Desejos dão poder temp.' },
          { name: 'Aspecto Infernal', cost: 'Passiva', description: 'Mutação demoníaca (Manto, Garras, Escamas, etc).' },
          { name: 'Falha no Contrato', cost: 'Passiva', description: 'Ignora custo pacto.' },
          { name: 'Conhecimento Profano', cost: 'Passiva', description: 'Invoca demônio.' },
          { name: 'Filho do Abismo', cost: 'Passiva', description: 'Vantagem vs Bem.' }
        ]
      },
      {
        level: 7,
        name: 'Serial Killer (Serial Killer)',
        abilities: [
          { name: 'Sede de Sangue', cost: '2 EE', description: 'Ataque extra após primeiro acerto.' }
        ],
        traits: [
          { name: 'Especialista em Matança', cost: 'Passiva', description: 'Max dano letal.' },
          { name: 'Projeção Abissal', cost: 'Passiva', description: 'Invoca demônio superior.' },
          { name: 'Maestria Xamânica', cost: 'Passiva', description: '3 rituais.' },
          { name: 'Morte em Cadeia', cost: 'Passiva', description: '+Dano por morte.' },
          { name: 'Traição a Sangue Frio', cost: 'Passiva', description: 'Surpresa em aliados.' }
        ]
      },
      {
        level: 6,
        name: 'Devil (Demônio)',
        abilities: [
          { name: 'Fogo Infernal', cost: 'Var', description: 'Esfera, Lâmina, Vapor.' },
          { name: 'Língua Profana', cost: 'Var', description: 'Desacelerar, Corromper, Morte.' }
        ],
        traits: [
          { name: 'Premonição', cost: 'Passiva', description: 'Esquiva letal.' },
          { name: 'Metamorfose', cost: 'Passiva', description: 'Sombrio, Espectro, Legião.' },
          { name: 'Arte Diabólica', cost: 'Passiva', description: 'Sede aplica em fogo.' }
        ]
      },
      {
        level: 5,
        name: 'Apostle of Desire (Apóstolo do Desejo)',
        abilities: [
          { name: 'Plantar Semente', cost: '1 EE', description: 'Planta emoção que detona.' },
          { name: 'Estimular Emoções', cost: '3 EE', description: 'Força emoção.' },
          { name: 'Explosão Sensorial', cost: '3 EE', description: 'Dano mental em emocionado.' },
          { name: 'Tomar Desejo', cost: '3 EE', description: 'Absorve emoção.' },
          { name: 'Poço dos Desejos', cost: '5 EE', description: 'Poça emoções negativas.' }
        ],
        traits: [
          { name: 'A Maçã', cost: 'Passiva', description: 'Queima aspecto, comanda.' }
        ]
      }
    ]
  },
  {
    id: 'paragon',
    arcana: 'XVI - A Torre',
    name: 'A Torre (The Paragon)',
    image: 'https://i.imgur.com/F61QbIs.jpeg',
    portrait: 'https://i.imgur.com/F61QbIs.jpeg',
    symbol: 'https://i.imgur.com/xQD0U9H.jpeg',
    quote: 'O vapor nunca deve parar.',
    description: 'Busca incansável pela sabedoria. Une místico e científico.',
    sequences: [
      {
        level: 9,
        name: 'Savant/Reader (Leitor)',
        abilities: [
          { name: 'Rato de Biblioteca', cost: '1 EE', description: 'Aumenta treino perícias.' }
        ],
        traits: [
          { name: 'Ateniense', cost: 'Passiva', description: '+1 INT.' },
          { name: 'Teoria Mágica', cost: 'Passiva', description: '2 Rituais.' },
          { name: 'Entusiasta', cost: 'Passiva', description: 'Ganha perícia lendo.' },
          { name: 'Acadêmico', cost: 'Passiva', description: '+3 testes acadêmicos.' },
          { name: 'Faro de Informações', cost: 'Passiva', description: 'Sente info.' }
        ]
      },
      {
        level: 8,
        name: 'Archaeologist/Reason Scholar (Acadêmico da Razão)',
        abilities: [
          { name: 'Mimetismo', cost: '2 EE', description: 'Copia estilo luta.' }
        ],
        traits: [
          { name: 'Processo Lógico', cost: 'Passiva', description: 'Vantagem Percepção/Investigação.' },
          { name: 'Intuição Paranormal', cost: 'Passiva', description: 'Aprende feitiço visto.' },
          { name: 'Tese de Ocultismo', cost: 'Passiva', description: '2 Rituais.' },
          { name: 'Capacidade de Aprendizado', cost: 'Passiva', description: '5 pontos perícia.' },
          { name: 'Prodígio', cost: 'Passiva', description: 'Usa destreinado.' }
        ]
      },
      {
        level: 7,
        name: 'Appraiser/Detective (Detetive)',
        abilities: [
          { name: 'Autodefesa', cost: '2 EE', description: 'Proficiência arma.' }
        ],
        traits: [
          { name: 'Artes Marciais', cost: 'Passiva', description: 'Mimetismo composto.' },
          { name: 'Eficiente', cost: 'Passiva', description: 'Metade materiais.' },
          { name: 'Olhar Afiado', cost: 'Passiva', description: '+2 Investigação.' },
          { name: 'Condicionamento Físico', cost: 'Passiva', description: '+Status.' },
          { name: 'Conhecimentos Gerais', cost: 'Passiva', description: '+3 perícias.' }
        ]
      },
      {
        level: 6,
        name: 'Artisan/Polymath (Polimata)',
        abilities: [],
        traits: [
          { name: 'Cálculo Avançado', cost: 'Passiva', description: '+3 Matemática.' },
          { name: 'Masterizar', cost: 'Passiva', description: 'Estuda habilidade.' },
          { name: 'Mestre da Transcendência', cost: 'Passiva', description: 'Mimetiza habilidade estudada.' },
          { name: 'Estudo Exaustivo', cost: 'Passiva', description: 'Melhora itens.' },
          { name: 'Preparo', cost: 'Passiva', description: 'Defesa vs masterizado.' }
        ]
      },
      {
        level: 5,
        name: 'Astronomer/Mystic Magistrate (Magistrado Místico)',
        abilities: [
          { name: 'Livro Místico', cost: 'Conc', description: 'Modifica habilidade.' }
        ],
        traits: [
          { name: 'Sistema de Compensação', cost: 'Passiva', description: 'Compensação vira extra.' },
          { name: 'Afinidade Mágica', cost: 'Passiva', description: 'Ritual com sangue.' },
          { name: 'Penitência', cost: 'Passiva', description: 'Sangue material.' },
          { name: 'Ritualismo Aplicado', cost: 'Passiva', description: 'Dano aumenta dado.' },
          { name: 'Favor', cost: 'Passiva', description: 'Menos custo.' },
          { name: 'Repertório de Feitiços', cost: 'Passiva', description: 'Cria feitiços.' }
        ]
      }
    ]
  },
  {
    id: 'darkness',
    arcana: 'XVII - A Estrela',
    name: 'A Estrela (The Darkness)',
    image: 'https://i.imgur.com/1fe8Uiz.jpeg',
    portrait: 'https://i.imgur.com/1fe8Uiz.jpeg',
    symbol: 'https://i.imgur.com/tXywxLh.jpeg',
    quote: 'A Noite Eterna nos protege.',
    description: 'Relacionados à noite, escuridão, sonhos e calmaria.',
    sequences: [
      {
        level: 9,
        name: 'Sleepless (Sem Sono)',
        abilities: [],
        traits: [
          { name: 'Insônia', cost: 'Passiva', description: '2h sono.' },
          { name: 'Tenebrisvidere', cost: 'Passiva', description: 'Vê escuro total.' },
          { name: 'Fotofobia', cost: 'Passiva', description: '-1 dia.' },
          { name: 'Nictofilia', cost: 'Passiva', description: '+1 noite.' }
        ]
      },
      {
        level: 8,
        name: 'Midnight Poet (Poeta da Meia Noite)',
        abilities: [
          { name: 'Canção de Ninar', cost: '4 EE', description: 'Sono.' },
          { name: 'Tranquilizar', cost: '2 EE', description: 'Acalma.' },
          { name: 'Terror Noturno', cost: '3 EE', description: 'Pavor.' },
          { name: 'Delírio', cost: '2 EE', description: 'Infunde emoções.' }
        ],
        traits: [
          { name: 'Galanteador', cost: 'Passiva', description: '+Social noite.' },
          { name: 'Serenata', cost: 'Passiva', description: '+DT vocal.' }
        ]
      },
      {
        level: 7,
        name: 'Nightmare (Pesadelo)',
        abilities: [
          { name: 'Invadir', cost: '1 EE', description: 'Entra sonho.' },
          { name: 'Projeção Astral', cost: '2 EE', description: 'Separa alma.' },
          { name: 'Lapso de Consciência', cost: '2 EE', description: 'Arrasta para sonho.' },
          { name: 'Pesadelo Vivo', cost: '2 EE', description: 'Tentáculos negros.' }
        ],
        traits: [
          { name: 'Hipnomancia', cost: 'Passiva', description: 'Manipula sonhos.' },
          { name: 'Distúrbio do Sono', cost: 'Passiva', description: 'Não dorme.' },
          { name: 'Bicho Papão', cost: 'Passiva', description: 'Dano em medo.' },
          { name: 'Na Calada da Noite', cost: 'Passiva', description: 'Sem verbal.' }
        ]
      },
      {
        level: 6,
        name: 'Soul Assurer (Assegurador da Alma)',
        abilities: [
          { name: 'Tranquilizar Espírito', cost: '4 EE', description: 'Espíritos hibernam.' },
          { name: 'Agitar Alma', cost: '2 EE', description: 'Intensifica emoções.' }
        ],
        traits: [
          { name: 'Xamanismo', cost: 'Passiva', description: '3 rituais.' },
          { name: 'Especialista – Morte', cost: 'Passiva', description: 'Vantagem vs morte.' },
          { name: 'Aura Acolhedora', cost: 'Passiva', description: 'Aliados morte.' },
          { name: 'Tomo Espiritual', cost: 'Passiva', description: '2 feitiços morte.' }
        ]
      },
      {
        level: 5,
        name: 'Spirit Warlock (Feiticeiro Espiritual)',
        abilities: [
          { name: 'Selar', cost: '3 EE/T', description: 'Sela espírito.' },
          { name: 'Abrigar Espírito', cost: '2 EE', description: 'Guarda espírito.' },
          { name: 'Canalizar Espírito', cost: '1 EE', description: 'Usa espírito.' }
        ],
        traits: [
          { name: 'Refúgio Espiritual', cost: 'Passiva', description: '4 espíritos.' },
          { name: 'Apreciador dos Puros', cost: 'Passiva', description: 'Espíritos naturais.' },
          { name: 'Integração', cost: 'Passiva', description: 'Ganha habilidade.' }
        ]
      }
    ]
  },
  {
    id: 'moon',
    arcana: 'XVIII - A Lua',
    name: 'A Lua (The Moon)',
    image: 'https://i.imgur.com/62nLkpc.jpeg',
    portrait: 'https://i.imgur.com/62nLkpc.jpeg',
    symbol: 'https://i.imgur.com/Lo7rIRL.jpeg',
    quote: 'Sob a luz carmesim, a vida floresce.',
    description: 'Cura, poções e dominação de feras.',
    sequences: [
      {
        level: 9,
        name: 'Apothecary (Boticário)',
        abilities: [
          { name: 'Visão espiritual – Diagnóstico', cost: '1 EE', description: 'Vê saúde.' },
          { name: 'Experimentar', cost: '1 EE', description: 'Analisa ingrediente.' }
        ],
        traits: [
          { name: 'Alquimista', cost: 'Passiva', description: 'Poções melhores.' },
          { name: 'Aspecto do Luar', cost: 'Passiva', description: '+1 ESP/VIG.' },
          { name: 'Sangue Nobre', cost: 'Passiva', description: 'Sangue cura.' }
        ]
      },
      {
        level: 8,
        name: 'Beast Tamer (Domador de Bestas)',
        abilities: [
          { name: 'Domar', cost: '2 EE', description: 'Toca alma animal.' },
          { name: 'Dividir Sentidos', cost: '1 EE', description: 'Toma consciência.' },
          { name: 'Tomar Vitalidade', cost: '3 EE', description: 'Absorve vida.' }
        ],
        traits: [
          { name: 'Tocar Alma', cost: 'Passiva', description: 'Comunica.' },
          { name: 'Predador', cost: 'Passiva', description: 'Intimida.' }
        ]
      },
      {
        level: 7,
        name: 'Vampire (Vampiro)',
        abilities: [
          { name: 'Asas Negras (Trevas)', cost: '5 EE', description: 'Voo.' },
          { name: 'Grilhões do Abismo', cost: '3 EE', description: 'Prende.' },
          { name: 'Sanguessuga Espiritual', cost: '4 EE', description: 'Rouba vida.' },
          { name: 'Garras Corrosivas', cost: '3 EE', description: 'Corrosão.' },
          { name: 'Camuflar', cost: '2 EE', description: 'Sombra.' },
          { name: 'Empalar', cost: '8 EE', description: 'Estaca.' },
          { name: 'Hemorragia Forçada (Sangue)', cost: '8 EE', description: 'Sangramento.' },
          { name: 'Bala de Sangue', cost: '4 PV', description: 'Tiro.' },
          { name: 'Sobrecarregar Organismo', cost: '10 EE', description: 'Cura.' },
          { name: 'Ceifador Carmesim', cost: '20 PV', description: 'Explosão sangue.' },
          { name: 'Contaminação', cost: '4 PV', description: 'Dano degenerativo.' },
          { name: 'Sintetizar', cost: '3 PV', description: 'Arma sangue.' }
        ],
        traits: [
          { name: 'Longevidade', cost: 'Passiva', description: '300 anos.' },
          { name: 'Raça (Vampiro)', cost: 'Passiva', description: 'Stats vampiro.' },
          { name: 'Metabolismo Acelerado', cost: 'Passiva', description: 'Regen noite.' },
          { name: 'Filho da Lua', cost: 'Passiva', description: 'Sol queima.' },
          { name: 'Nictomancia/Hemomancia', cost: 'Passiva', description: 'Feitiços.' },
          { name: 'Tomo de Sangue/Sombras', cost: 'Passiva', description: '3 feitiços.' },
          { name: 'Servo de Sangue', cost: 'Passiva', description: 'Crias.' }
        ]
      },
      {
        level: 6,
        name: 'Potions Professor (Professor de Poções)',
        abilities: [
          { name: 'Visão Espiritual – Discernimento', cost: '3 EE', description: 'Estuda ingredientes.' },
          { name: 'Memória Celular', cost: '3 EE', description: 'Emula poção.' }
        ],
        traits: [
          { name: 'Mestre das Misturas', cost: 'Passiva', description: 'Combina poções.' },
          { name: 'Enciclopédia Alquímica', cost: 'Passiva', description: 'Menos efeito negativo.' },
          { name: 'Narco-dependente', cost: 'Passiva', description: 'Duração dobrada.' },
          { name: 'Conhecimento Hereditário', cost: 'Passiva', description: 'Receitas.' }
        ]
      },
      {
        level: 5,
        name: 'Scarlet Scholar (Acadêmico Escarlate)',
        abilities: [
          { name: 'Meia Noite', cost: '8 EE', description: 'Lua cheia.' },
          { name: 'Amanhecer', cost: '3 EE', description: 'Remove lua.' },
          { name: 'Luminescência', cost: '3 EE', description: 'Teleporte.' },
          { name: 'Carne Carmesim', cost: '4 EE', description: 'Nega dano.' }
        ],
        traits: [
          { name: 'Afinidade Terebre', cost: 'Passiva', description: 'Resistência sonho.' },
          { name: 'Bênção do Luar', cost: 'Passiva', description: '+5 stats lua.' },
          { name: 'Mestre', cost: 'Passiva', description: '+Crias.' },
          { name: 'Diluição de Efeito', cost: 'Passiva', description: 'Poção dura cena.' }
        ]
      }
    ]
  },
  {
    id: 'sun',
    arcana: 'XIX - O Sol',
    name: 'O Sol (The Sun)',
    image: 'https://i.imgur.com/wKQiJNk.jpeg',
    portrait: 'https://i.imgur.com/wKQiJNk.jpeg',
    symbol: 'https://i.imgur.com/DrXAaJW.jpeg',
    quote: 'Louvado seja o Sol!',
    description: 'Luz, purificação e contratos.',
    sequences: [
      {
        level: 9,
        name: 'Bard (Bardo)',
        abilities: [
          { name: 'Reverberação da Alma', cost: '3 EE', description: 'Buff/Debuff com música.' },
          { name: 'Inspiração', cost: '4 EE', description: '+1 Atributos.' }
        ],
        traits: [
          { name: 'Afinidade Espiritual', cost: 'Passiva', description: '+1 ESP.' },
          { name: 'Artista', cost: 'Passiva', description: 'Instrumento.' }
        ]
      },
      {
        level: 8,
        name: 'Light Supplicant (Suplicante de Luz)',
        abilities: [
          { name: 'Invocação Sacra', cost: '?', description: '2 Feitiços 5°.' },
          { name: 'Descender', cost: '10 EE', description: 'Dano solar.' },
          { name: 'Luz Cegante', cost: '2 EE', description: 'Cega.' }
        ],
        traits: [
          { name: 'Status Especial - Fé', cost: 'Passiva', description: 'ESP vira Fé.' },
          { name: 'Graça da Luz', cost: 'Passiva', description: 'Vê no escuro.' },
          { name: 'Orquestra', cost: 'Passiva', description: 'Bônus instrumento.' }
        ]
      },
      {
        level: 7,
        name: 'Solar Priest (Sacerdote Solar)',
        abilities: [
          { name: 'Água Benta', cost: 'Ritual', description: 'Cria água benta.' },
          { name: 'Aro Solar', cost: '4 EE', description: 'Buff área.' },
          { name: 'Exorcismo', cost: '2 EE', description: 'Dano espíritos.' },
          { name: 'Voto Sagrado', cost: '5 EE', description: 'Power up, dano rebote.' }
        ],
        traits: [
          { name: 'Vitalidade Aconchegante', cost: 'Passiva', description: 'Imune doença.' }
        ]
      },
      {
        level: 6,
        name: 'Notary (Notário)',
        abilities: [
          { name: 'Notarização', cost: 'Var', description: 'Autentificar, Amplificar, Nulificar.' }
        ],
        traits: [
          { name: 'Contrato', cost: 'Passiva', description: 'Cria contratos espirituais.' },
          { name: 'Imunidade a horror', cost: 'Passiva', description: 'Imune medo.' }
        ]
      },
      {
        level: 5,
        name: 'Light Prior (Prior da Luz)',
        abilities: [
          { name: 'Bênçãos', cost: '?', description: '3 Feitiços.' },
          { name: 'Descender Divindade', cost: '15 EE', description: 'Dano área.' },
          { name: 'Abençoar', cost: 'Ritual', description: 'Buff arma.' }
        ],
        traits: [
          { name: 'Perdição dos Mortos', cost: 'Passiva', description: 'Mortos fogem.' },
          { name: 'Iluminado', cost: 'Passiva', description: '+2 sol.' }
        ]
      }
    ]
  },
  {
    id: 'justiciar',
    arcana: 'XX - O Julgamento',
    name: 'O Julgamento (Justiciar)',
    image: 'https://i.imgur.com/KUQ1Bdj.jpeg',
    portrait: 'https://i.imgur.com/KUQ1Bdj.jpeg',
    symbol: 'https://i.imgur.com/zWWPbTA.jpeg',
    quote: 'A ordem deve prevalecer.',
    description: 'Leis, punição e ordem.',
    sequences: [
      {
        level: 9,
        name: 'Arbiter (Árbitro)',
        abilities: [
          { name: 'Cartão Vermelho', cost: '2+ EE', description: 'Devolve metade do dano.' }
        ],
        traits: [
          { name: 'Adaptabilidade', cost: 'Passiva', description: 'Reação extra.' },
          { name: 'Autoridade Intrínseca', cost: 'Passiva', description: 'Liderança.' },
          { name: 'Troca Justa', cost: 'Passiva', description: '+INT/ESP -FIS.' }
        ]
      },
      {
        level: 8,
        name: 'Sheriff (Xerife)',
        abilities: [
          { name: 'Identificar', cost: '3 EE', description: 'Sente anormalidades.' },
          { name: 'Rastrear', cost: '3 EE', description: 'Investigação.' }
        ],
        traits: [
          { name: 'Defensor da Ordem', cost: 'Passiva', description: '+Dano caos.' },
          { name: 'Recompensa per Capita', cost: 'Passiva', description: 'Identifica.' },
          { name: 'Territorial', cost: 'Passiva', description: 'Bônus área.' },
          { name: 'Aplicar a Lei', cost: 'Passiva', description: 'Protege aliado.' }
        ]
      },
      {
        level: 7,
        name: 'Interrogator (Interrogador)',
        abilities: [
          { name: 'Perfuração Psíquica', cost: '1 EE', description: 'Dano mental. Quebra Vontade.' },
          { name: 'Punição', cost: 'Comp', description: 'Dano por acúmulo.' },
          { name: 'Açoite Mental', cost: '3 EE', description: 'Entorpecido.' }
        ],
        traits: [
          { name: 'Perspicaz', cost: 'Passiva', description: 'Reação extra.' },
          { name: 'Perdição do Caos', cost: 'Passiva', description: 'Vantagem caos.' },
          { name: 'Perseguidor da Insanidade', cost: 'Passiva', description: 'Bônus vs loucos.' }
        ]
      },
      {
        level: 6,
        name: 'Judge (Juiz)',
        abilities: [
          { name: 'Veredito', cost: 'Var', description: 'Prisão, Liberdade, Açoitar, Confinar, Exilar, Morte.' },
          { name: 'Decreto de Proibição', cost: '3 EE', description: 'Proíbe ação.' }
        ],
        traits: [
          { name: 'Perícia Única – Autoridade', cost: 'Passiva', description: 'Vontade vira Autoridade.' }
        ]
      },
      {
        level: 5,
        name: 'Disciplinary Paladin (Paladino Disciplinar)',
        abilities: [
          { name: 'Aplicar Punição', cost: '2 EE', description: 'Teleporte para punir.' }
        ],
        traits: [
          { name: 'Amplificação de Autoridade', cost: 'Passiva', description: 'Ordem absoluta.' },
          { name: 'Agravante', cost: 'Passiva', description: 'Punição imediata.' },
          { name: 'Defensor do Véu', cost: 'Passiva', description: 'Anti-anulação.' }
        ]
      }
    ]
  },
  {
    id: 'mother',
    arcana: 'XXI - O Mundo',
    name: 'O Mundo (The Mother)',
    image: 'https://i.imgur.com/oWLp0gZ.jpeg',
    portrait: 'https://i.imgur.com/oWLp0gZ.jpeg',
    symbol: 'https://i.imgur.com/E8iEw0O.jpeg',
    quote: 'A terra provê tudo o que precisamos.',
    description: 'Ligados à natureza e à terra. Conhecimento instintivo sobre seres vivos.',
    sequences: [
      {
        level: 9,
        name: 'Planter (Cultivador)',
        abilities: [
          { name: 'Força da natureza', cost: '3 EE', description: '+Força.' },
          { name: 'Absorver Vida', cost: '2 EE', description: 'Drena planta.' },
          { name: 'Visão Espiritual', cost: '1 EE', description: 'Auras.' }
        ],
        traits: [
          { name: 'Natureba', cost: 'Passiva', description: '+Bio/Alq.' },
          { name: 'Afinidade Climática', cost: 'Passiva', description: 'Prevê clima.' }
        ]
      },
      {
        level: 8,
        name: 'Doctor (Médico)',
        abilities: [
          { name: 'Curar – Corpo', cost: '1+ EE', description: 'Cura física.' },
          { name: 'Curar – Alma', cost: '1+ EE', description: 'Cura mental.' },
          { name: 'Campo de Vitalidade', cost: '3 EE', description: 'Regen área.' }
        ],
        traits: [
          { name: 'Análise', cost: 'Passiva', description: 'Diagnóstico.' },
          { name: 'Limite da Medicina', cost: 'Passiva', description: '2x/dia.' },
          { name: 'Aura Curativa', cost: 'Passiva', description: 'Descanso.' },
          { name: 'Bem Estar', cost: 'Passiva', description: 'Doenças.' },
          { name: 'Cirurgião', cost: 'Passiva', description: 'Membros.' },
          { name: 'Procedimento Espiritual', cost: 'Passiva', description: 'Alma.' }
        ]
      },
      {
        level: 7,
        name: 'Harvest Priest (Sacerdote da Colheita)',
        abilities: [
          { name: 'Dádiva da Vida', cost: '20 EE', description: 'Crescimento área.' },
          { name: 'Catalisar Sementes', cost: '1 EE', description: 'Semente dia.' },
          { name: 'Crescimento Espontâneo', cost: '3 EE', description: 'Semente instant.' },
          { name: 'Manipulação da Vida Inferior', cost: '3 EE', description: 'Insetos/plantas.' }
        ],
        traits: [
          { name: 'Instinto do Fiel', cost: 'Passiva', description: '+Biologia.' },
          { name: 'Dedos Prósperos', cost: 'Passiva', description: 'Colheita.' },
          { name: 'Ritos Climáticos', cost: 'Passiva', description: '3 rituais.' },
          { name: 'Estudioso da Vida', cost: 'Passiva', description: 'Cura tudo.' }
        ]
      },
      {
        level: 6,
        name: 'Biologist (Biólogo)',
        abilities: [
          { name: 'Biomancia', cost: 'Var', description: 'Híbridos.' }
        ],
        traits: [
          { name: 'Curiosidade Blasfêmica - Genética', cost: 'Passiva', description: 'Genética.' },
          { name: 'Estudo Transcendente', cost: 'Passiva', description: 'Materiais.' },
          { name: 'Cirurgião Enlouquecido', cost: 'Passiva', description: 'Unir membros.' },
          { name: 'Zoologia', cost: 'Passiva', description: 'Bônus raça.' }
        ]
      },
      {
        level: 5,
        name: 'Druid (Druida)',
        abilities: [
          { name: 'Plantar Raízes', cost: '4 EE', description: 'Absorve solo.' },
          { name: 'Metamorfose', cost: '7 EE', description: 'Vira besta.' },
          { name: 'Acolher', cost: '4 EE', description: 'Entra solo.' },
          { name: 'Vinhas Sencientes', cost: '5 EE', description: 'Tentáculos.' }
        ],
        traits: [
          { name: 'Anatomia Narcótica', cost: 'Passiva', description: 'Drogas corpo.' },
          { name: 'Criança da Natureza', cost: 'Passiva', description: 'Transfere mente.' },
          { name: 'Drenar', cost: 'Passiva', description: 'Absorve mais.' },
          { name: 'Bioquímica', cost: 'Passiva', description: 'Drogas quimera.' }
        ]
      }
    ]
  }
];

interface PathwaysProps {
  activeCharacter: Character;
  updateCharacter: (c: Character) => void;
}

const Pathways: React.FC<PathwaysProps> = ({ activeCharacter, updateCharacter }) => {
  const [pathways, setPathways] = useState<PathwayData[]>(() => {
    const saved = localStorage.getItem('lom-pathways-data');
    return saved ? JSON.parse(saved) : PATHWAYS_DEFAULT;
  });
  const [selectedId, setSelectedId] = useState(pathways[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('lom-pathways-data', JSON.stringify(pathways));
  }, [pathways]);

  const current = pathways.find(p => p.id === selectedId) || pathways[0];

  const filtered = pathways.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.arcana.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMatchingPathway = current.name.toLowerCase().includes(activeCharacter.pathway.toLowerCase());

  const handleUpdatePathwayName = (name: string) => {
    setPathways(prev => prev.map(p => p.id === selectedId ? { ...p, name } : p));
  };

  const handleUpdateSequenceName = (level: number, name: string) => {
    setPathways(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      return {
        ...p,
        sequences: p.sequences.map(s => s.level === level ? { ...s, name } : s)
      };
    }));
  };

  const handleUpdatePower = (level: number, type: 'abilities' | 'traits', index: number, field: keyof PowerInfo, value: string) => {
    setPathways(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      return {
        ...p,
        sequences: p.sequences.map(s => {
          if (s.level !== level) return s;
          const list = [...s[type]];
          list[index] = { ...list[index], [field]: value };
          return { ...s, [type]: list };
        })
      };
    }));
  };

  const handleAddPower = (type: 'ability' | 'trait', power: PowerInfo) => {
    if (!isMatchingPathway) {
      alert(`Você pertence ao caminho ${activeCharacter.pathway}. Não pode adicionar poderes de ${current.name}.`);
      return;
    }

    if (type === 'ability') {
      if (activeCharacter.abilities.some(a => a.name === power.name)) return;
      const newAbility: Ability = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
        name: power.name,
        description: power.description,
        cost: power.cost
      };
      updateCharacter({ ...activeCharacter, abilities: [...activeCharacter.abilities, newAbility] });
    } else {
      if (activeCharacter.traits.some(t => t.name === power.name)) return;
      const newTrait: Ability = {
        id: 't' + Date.now().toString() + Math.random().toString(36).substring(2, 7),
        name: power.name,
        description: power.description,
        cost: power.cost
      };
      updateCharacter({ ...activeCharacter, traits: [...activeCharacter.traits, newTrait] });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn h-[calc(100vh-140px)]">
      <div className="lg:w-80 flex flex-col bg-mystic-900/50 border border-mystic-gold/20 rounded-lg overflow-hidden shrink-0 shadow-2xl">
        <div className="p-4 border-b border-mystic-gold/10 space-y-2">
          <input 
            type="text" 
            placeholder="Buscar Caminho..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-mystic-800 border border-stone-700 rounded-full px-4 py-2 text-xs text-stone-300 focus:border-mystic-gold outline-none"
          />
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full py-2 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${isEditing ? 'bg-mystic-gold text-mystic-900' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:text-white'}`}
          >
            {isEditing ? "Salvar Edições" : "Editar Registros"}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left p-4 transition-all border-b border-stone-800/50 group flex items-center gap-3 ${
                selectedId === p.id ? 'bg-mystic-gold/10 border-l-4 border-l-mystic-gold' : 'hover:bg-white/5 border-l-4 border-l-transparent'
              }`}
            >
              <img src={p.symbol} alt="" className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
              <div>
                <span className="block text-[9px] text-stone-500 uppercase tracking-tighter mb-0.5 font-mono">{p.arcana}</span>
                <span className={`font-serif text-xs ${selectedId === p.id ? 'text-mystic-gold' : 'text-stone-300 group-hover:text-white'}`}>{p.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-mystic-800 border border-mystic-gold/20 rounded-lg overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-10">
           <img src={current.image} alt="" className="w-full h-full object-cover blur-[4px]" />
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-8">
          <div className="border-b border-mystic-gold/20 pb-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-48 h-72 shrink-0 border-4 border-mystic-gold/30 rounded shadow-2xl overflow-hidden bg-black flex-shrink-0">
               <img src={current.portrait} alt={current.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-mystic-gold font-mono text-sm uppercase tracking-widest block mb-2">{current.arcana}</span>
              {isEditing ? (
                <input 
                  value={current.name}
                  onChange={(e) => handleUpdatePathwayName(e.target.value)}
                  className="text-4xl font-serif text-white mb-2 bg-transparent border-b border-stone-600 focus:border-mystic-gold outline-none w-full"
                />
              ) : (
                <h2 className="text-4xl font-serif text-white mb-2">{current.name}</h2>
              )}
              {isMatchingPathway ? (
                <span className="inline-block bg-mystic-gold/20 text-mystic-gold border border-mystic-gold/30 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest mb-4">Seu Caminho</span>
              ) : (
                <span className="inline-block bg-stone-900/50 text-stone-500 border border-stone-800 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest mb-4">Caminho Diferente</span>
              )}
              <p className="text-mystic-gold italic font-serif text-lg leading-relaxed max-w-2xl mb-4">"{current.quote}"</p>
              <p className="text-stone-400 text-sm leading-relaxed max-w-3xl">{current.description}</p>
            </div>
          </div>

          <div className="space-y-10">
             {current.sequences.map((seq) => (
               <div key={seq.level} className="bg-mystic-900/40 backdrop-blur-md border border-stone-700 rounded-lg overflow-hidden shadow-xl">
                  <div className="bg-stone-900/60 p-4 border-b border-mystic-gold/10 flex justify-between items-center">
                     <div className="flex items-center gap-4 w-full">
                        <span className="w-10 h-10 rounded-full bg-mystic-gold/10 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold font-bold font-serif shadow-[0_0_10px_rgba(197,160,89,0.2)] flex-shrink-0">
                          {seq.level}
                        </span>
                        {isEditing ? (
                          <input 
                            value={seq.name}
                            onChange={(e) => handleUpdateSequenceName(seq.level, e.target.value)}
                            className="text-xl font-serif text-stone-100 bg-transparent border-b border-stone-600 focus:border-mystic-gold outline-none flex-1"
                          />
                        ) : (
                          <h3 className="text-xl font-serif text-stone-100">{seq.name}</h3>
                        )}
                     </div>
                     {!isEditing && <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono whitespace-nowrap ml-4">Sequência {seq.level}</span>}
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h4 className="text-mystic-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-mystic-gold rounded-full shadow-[0_0_5px_rgba(197,160,89,1)]"></span> Habilidades Ativas
                        </h4>
                        <div className="space-y-2">
                           {seq.abilities.length > 0 ? seq.abilities.map((ab, i) => {
                             const alreadyHas = activeCharacter.abilities.some(a => a.name === ab.name);
                             return (
                               <div key={i} className="bg-black/30 p-3 rounded border border-stone-800 hover:border-mystic-gold/30 transition-all flex flex-col gap-2 group/item">
                                  <div className="flex justify-between items-center">
                                    {isEditing ? (
                                      <input 
                                        value={ab.name}
                                        onChange={(e) => handleUpdatePower(seq.level, 'abilities', i, 'name', e.target.value)}
                                        className="text-sm text-stone-200 font-bold font-serif bg-transparent border-b border-stone-600 focus:border-mystic-gold outline-none w-full mr-2"
                                      />
                                    ) : (
                                      <p className="text-sm text-stone-200 font-bold font-serif">{ab.name}</p>
                                    )}
                                    {!isEditing && isMatchingPathway && (
                                      <button 
                                        onClick={() => handleAddPower('ability', ab)}
                                        disabled={alreadyHas}
                                        className={`text-[9px] px-2 py-1 rounded transition-all uppercase font-bold tracking-tighter flex-shrink-0 ${
                                          alreadyHas 
                                            ? 'bg-stone-800 text-stone-600 border border-stone-700 cursor-default' 
                                            : 'bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/30 hover:bg-mystic-gold hover:text-mystic-900'
                                        }`}
                                      >
                                        {alreadyHas ? 'Na Ficha' : '+ Adicionar'}
                                      </button>
                                    )}
                                  </div>
                                  {isEditing ? (
                                    <textarea 
                                      value={ab.description}
                                      onChange={(e) => handleUpdatePower(seq.level, 'abilities', i, 'description', e.target.value)}
                                      className="text-xs text-stone-400 leading-relaxed italic bg-transparent border border-stone-700 focus:border-mystic-gold outline-none w-full p-2 rounded resize-y"
                                      rows={3}
                                    />
                                  ) : (
                                    <p className="text-xs text-stone-400 leading-relaxed italic">{ab.description}</p>
                                  )}
                                  <span className="text-[9px] text-blue-400 uppercase font-mono">{ab.cost}</span>
                               </div>
                             );
                           }) : (
                             <p className="text-xs text-stone-600 italic">Nenhuma habilidade ativa registrada.</p>
                           )}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-stone-500 rounded-full"></span> Traços Passivos
                        </h4>
                        <div className="space-y-2">
                           {seq.traits.length > 0 ? seq.traits.map((tr, i) => {
                             const alreadyHas = activeCharacter.traits.some(t => t.name === tr.name);
                             return (
                               <div key={i} className="bg-mystic-800/20 p-3 rounded border-l-2 border-stone-700 transition-all flex flex-col gap-2 group/item">
                                  <div className="flex justify-between items-center">
                                    {isEditing ? (
                                      <input 
                                        value={tr.name}
                                        onChange={(e) => handleUpdatePower(seq.level, 'traits', i, 'name', e.target.value)}
                                        className="text-sm text-stone-300 font-bold font-serif bg-transparent border-b border-stone-600 focus:border-mystic-gold outline-none w-full mr-2"
                                      />
                                    ) : (
                                      <p className="text-sm text-stone-300 font-bold font-serif">{tr.name}</p>
                                    )}
                                    {!isEditing && isMatchingPathway && (
                                      <button 
                                        onClick={() => handleAddPower('trait', tr)}
                                        disabled={alreadyHas}
                                        className={`text-[9px] px-2 py-1 rounded transition-all uppercase font-bold tracking-tighter flex-shrink-0 ${
                                          alreadyHas 
                                            ? 'bg-stone-800 text-stone-600 border border-stone-700 cursor-default' 
                                            : 'bg-stone-700/50 text-stone-300 border border-stone-600 hover:bg-stone-100 hover:text-mystic-900'
                                        }`}
                                      >
                                        {alreadyHas ? 'Na Ficha' : '+ Adicionar'}
                                      </button>
                                    )}
                                  </div>
                                  {isEditing ? (
                                    <textarea 
                                      value={tr.description}
                                      onChange={(e) => handleUpdatePower(seq.level, 'traits', i, 'description', e.target.value)}
                                      className="text-xs text-stone-400 leading-relaxed italic bg-transparent border border-stone-700 focus:border-mystic-gold outline-none w-full p-2 rounded resize-y"
                                      rows={3}
                                    />
                                  ) : (
                                    <p className="text-xs text-stone-400 leading-relaxed italic">{tr.description}</p>
                                  )}
                               </div>
                             );
                           }) : (
                             <p className="text-xs text-stone-600 italic">Nenhum traço passivo registrado.</p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
          <div className="pt-10 text-center opacity-30">
            <p className="text-[10px] font-mono uppercase tracking-widest">Fim dos Registros Planetários.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pathways;
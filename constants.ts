
import { Character, Pathway } from './types';

export const PATHWAY_LIST = Object.values(Pathway);

export const PATHWAY_QUOTES: Record<string, string> = {
  [Pathway.Fool]: "O Louco que não pertence a esta era; O Governante Misterioso acima do nevoeiro cinzento; O Rei do Amarelo e Preto que detém a boa sorte.",
  [Pathway.Door]: "As estrelas estão sempre lá.",
  [Pathway.Error]: "Interessante...",
  [Pathway.Visionary]: "É um desenvolvimento razoável.",
  [Pathway.HangedMan]: "Ouvir os segredos do abismo é o começo da verdadeira fé.",
  [Pathway.Sun]: "Louvado seja o Sol!",
  [Pathway.Tyrant]: "O relâmpago é a vontade do mar.",
  [Pathway.WhiteTower]: "O conhecimento é o maior poder, mas também o fardo mais pesado.",
  [Pathway.Darkness]: "A Noite Eterna é o lar final de todas as coisas.",
  [Pathway.Death]: "A morte é a única certeza em um mundo de incertezas.",
  [Pathway.TwilightGiant]: "O crepúsculo é o fim do dia e o início do silêncio eterno.",
  [Pathway.RedPriest]: "A guerra é a cerimônia definitiva do destino.",
  [Pathway.Demoness]: "A dor é a única coisa que nos faz sentir vivos no fim do mundo.",
  [Pathway.Hermit]: "O mistério é a sombra projetada pelo conhecimento.",
  [Pathway.Paragon]: "O vapor da civilização nunca deve parar de subir.",
  [Pathway.BlackEmperor]: "Eu sou a lei, e a lei é a fundação da ordem.",
  [Pathway.Justiciar]: "A ordem deve ser mantida, custe o que custar.",
  [Pathway.WheelOfFortune]: "O destino é um rio que flui, e você não pode nadar contra a correnteza.",
  [Pathway.Moon]: "Sob a lua carmesim, encontramos nossa verdadeira natureza.",
  [Pathway.Mother]: "A terra sustenta a todos, mas também reclama o que lhe pertence.",
  [Pathway.Chained]: "Controle o desejo, ou seja controlado por ele. A temperança é a chave.",
  [Pathway.Abyss]: "A corrupção é a natureza fundamental do cosmos."
};

export const SKILLS_DEFINITION: Record<string, keyof Character['attributes']> = {
  "Acrobacia": "agility",
  "Luta": "strength",
  "Pontaria": "agility",
  "Bloqueio": "spirit",
  "Reflexos": "agility",
  "Rituais": "mysticism",
  "Simbolismo": "mysticism",
  "Intuição": "intelligence",
  "Psicologia": "intelligence",
  "Educação": "intelligence",
  "Medicina": "intelligence",
  "Alquimia": "intelligence",
  "Artesanato": "agility",
  "Culinária": "presence",
  "Diplomacia": "presence",
  "Intimidação": "presence",
  "Enganação": "presence",
  "Investigação": "intelligence",
  "Percepção": "intelligence",
  "Furtividade": "agility",
  "Crime": "agility",
  "Constituição": "spirit",
  "Vontade": "presence",
  "Sobrevivência": "intelligence",
  "Adestramento": "presence",
  "Atletismo": "strength",
  "Atualidades": "intelligence",
  "Religião": "presence",
  "Criptozoologia": "intelligence"
};

export const INITIAL_CHARACTER: Character = {
  id: "initial-char-id",
  name: "Novo Beyonder",
  pathway: Pathway.Fool,
  sequence: 9,
  attributeLabels: {
    strength: 'Força',
    agility: 'Agilidade',
    intelligence: 'Inteligência',
    spirit: 'Vigor',
    mysticism: 'Espiritualidade',
    presence: 'Presença'
  },
  attributes: {
    strength: 0,
    agility: 0,
    intelligence: 0,
    spirit: 0,
    mysticism: 0,
    presence: 0
  },
  stats: {
    hp: 10,
    maxHp: 10,
    spirituality: 10,
    maxSpirituality: 10,
    sanity: 10,
    maxSanity: 10
  },
  backstory: "",
  abilities: [],
  traits: [],
  talents: [],
  skills: {},
  inventory: [],
  personal: {
    about: "",
    age: "",
    originCountry: "",
    currentCountry: "",
    originCity: "",
    currentCity: "",
    nativeLanguage: "",
    spokenLanguages: "",
    profession: "",
    relatives: "",
    friends: "",
    addendums: "",
    regret: "",
    fear: "",
    lossOfControl: "",
    improvement: "",
    hobby: "",
    disgust: "",
    pride: "",
    secret: "",
    familyAndHome: "",
    importantPeople: "",
    rumors: "",
    rumorsTruth: "",
    desire: "",
    soulArtifact: {
      name: "",
      abilities: "",
      disadvantage: "",
      sealingMethod: ""
    }
  },
  notes: ""
};

export const SEQUENCE_NAMES: Record<string, string[]> = {
  [Pathway.Fool]: ["Attendant of Mysteries", "Miracle Invoker", "Scholar of Yore", "Bizarro Sorcerer", "Marionettist", "Magician", "Clown", "Seer"],
};


export enum Pathway {
  Fool = "The Fool",
  Door = "The Door",
  Error = "The Error",
  Visionary = "The Visionary",
  HangedMan = "The Hanged Man",
  Sun = "The Sun",
  Tyrant = "The Tyrant",
  WhiteTower = "The White Tower",
  Darkness = "The Darkness",
  Death = "Death",
  TwilightGiant = "The Twilight Giant",
  RedPriest = "Red Priest",
  Demoness = "Demoness",
  Hermit = "The Hermit",
  Paragon = "The Paragon",
  BlackEmperor = "Black Emperor",
  Justiciar = "Justiciar",
  WheelOfFortune = "Wheel of Fortune",
  Moon = "The Moon",
  Mother = "The Mother",
  Chained = "The Chained",
  Abyss = "The Abyss"
}

export interface UserProfile {
  username: string;
  tag: string; // 5 digit number
  password?: string;
  friends: { name: string; tag: string }[];
  avatar?: string; // Base64 string of the profile image
}

export interface Attribute {
  name: string;
  value: number;
}

export interface SkillEntry {
  trained: number;
  extra: number;
  notes?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  isSealedArtifact: boolean;
  grade?: string; // 0, 1, 2, 3
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cost: string; // e.g., "10 Spirituality"
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  type: 'Genérico' | 'Especial' | 'Combate' | 'Mundano';
}

export interface SoulArtifact {
  name: string;
  abilities: string;
  disadvantage: string;
  sealingMethod: string;
}

export interface PersonalInfo {
  about: string;
  age: string;
  originCountry: string;
  currentCountry: string;
  originCity: string;
  currentCity: string;
  nativeLanguage: string;
  spokenLanguages: string;
  profession: string;
  relatives: string;
  friends: string;
  addendums: string;
  // Questionnaire
  regret: string;
  fear: string;
  lossOfControl: string;
  improvement: string;
  hobby: string;
  disgust: string;
  pride: string;
  secret: string;
  familyAndHome: string;
  importantPeople: string;
  rumors: string;
  rumorsTruth: string;
  desire: string;
  // Artifact
  soulArtifact: SoulArtifact;
}

export interface Character {
  id: string;
  name: string;
  pathway: Pathway | string;
  sequence: number; // 9 to 0
  origin?: string;
  originChoice?: string; // Specific sub-choice (e.g., "Pistoleiro")
  attributeLabels?: Record<string, string>;
  attributes: {
    strength: number;
    agility: number;
    intelligence: number;
    spirit: number;
    mysticism: number;
    presence: number;
  };
  stats: {
    hp: number;
    maxHp: number;
    spirituality: number;
    maxSpirituality: number;
    sanity: number; // 100 - Corruption
    maxSanity: number;
  };
  backstory: string;
  abilities: Ability[];
  traits: Ability[];
  talents: Talent[];
  skillLabels?: Record<string, string>; // Renamed skills mapping
  skills: Record<string, SkillEntry>;
  inventory: Item[];
  personal: PersonalInfo;
  notes: string;
}

export type RollResult = {
  total: number;
  dice: number[];
  modifier: number;
  isSuccess?: boolean;
  crit?: 'success' | 'fail' | null;
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

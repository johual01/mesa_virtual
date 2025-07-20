export enum CharacterState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  DEAD = 'DEAD',
  NON_PLAYER = 'NON_PLAYER'
}

export enum System {
  DND5E = 'DND5E',
  PERSONAD20 = 'PERSONAD20'
}

export interface Character {
  _id: string;
  name: string;
  player: string;
  system: System;
  backstory: {
    history: string;
    personality: string;
    appearance: string;
    traits: string;
    defects: string;
    ideals: string;
    dreams: string;
    bonds: string;
    trauma: string;
  };
  characterData?: string;
  state: CharacterState;
  pictureRoute?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterSummary {
  _id: string;
  name: string;
  system: System;
  state: CharacterState;
  pictureRoute?: string;
  campaign?: {
    _id: string;
    name: string;
  };
}

export interface CreateCharacterData {
  name: string;
  system: System;
  state: CharacterState;
  backstory: {
    history: string;
    personality: string;
    appearance: string;
    traits: string;
    defects: string;
    ideals: string;
    dreams: string;
    bonds: string;
    trauma: string;
  };
  pictureRoute?: string;
  campaignId?: string;
}

export interface CharacterCreateInfo {
  elements: string[];
  states: string[];
  secondaryAbilities: string[];
  campaigns: Array<{
    _id: string;
    name: string;
  }>;
  classes: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
}

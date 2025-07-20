export enum CampaignState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export interface Campaign {
  _id: string;
  name: string;
  owner: User;
  players: User[];
  characters: Character[];
  image?: string;
  description?: string;
  notes?: Note[];
  publicEntries?: Note[];
  history: History[];
  state: CampaignState;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSummary {
  _id: string;
  name: string;
  image?: string;
}

export interface CreateCampaignData {
  name: string;
  description: string;
  image?: string;
  notes?: string[];
  publicEntries?: string[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Character {
  _id: string;
  name: string;
  player: User;
  system: string;
  state: string;
  pictureRoute?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  isPublic: boolean;
  author: User;
  createdAt: string;
}

export interface History {
  _id: string;
  event: string;
  description: string;
  user: User;
  origin: string;
  referenceType: string;
  reference: string;
  createdAt: string;
}

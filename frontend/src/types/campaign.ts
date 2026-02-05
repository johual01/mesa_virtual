export enum CampaignState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export interface User {
  _id: string;
  username: string;
  email?: string;
  joinDate?: Date;
  pictureRoute?: string;
}

export interface Character {
  _id: string;
  name: string;
  system: string;
  state: string;
  pictureRoute?: string;
}

export interface Note {
  _id: string;
  title: string;
  text: string;
  owner: string;
  state: 'ACTIVE' | 'DELETED';
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

export interface Campaign {
  _id: string;
  name: string;
  owner: User;
  players: User[];
  characters: string[];
  image?: string;
  description?: string;
  publicEntries?: Note[];
  notes?: Note[];
  history: string[];
  state: CampaignState;
}

export interface CampaignSummary {
  _id: string;
  name: string;
  image?: string;
}

export interface CreateCampaignData {
  name: string;
  description: string;
  image?: File;
  notes?: string[];
  publicEntries?: string[];
}

// Tipos de respuesta de servicios
export interface GetCampaignsResponse {
  campaigns: CampaignSummary[];
}

export interface GetCampaignResponse {
  campaign: Campaign;
}

export interface CampaignMutationResponse {
  message: string;
  campaign: Campaign;
}

export interface RegisterMutationResponse {
  message: string;
  note: Note;
}

export interface AddRegisterData {
  title: string;
  text: string;
  campaignId: string;
  isPrivate?: boolean;
}

export interface UpdateRegisterData {
  title: string;
  text: string;
  campaignId: string;
  isPrivate?: boolean;
}

export interface RemoveFromCampaignData {
  playerId: string;
  campaignId: string;
}

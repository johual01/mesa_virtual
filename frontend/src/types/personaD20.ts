export interface PersonaD20Class {
  _id: string;
  name: string;
  description: string;
  source: string;
}

export interface PersonaD20ClassesResponse {
  classes: PersonaD20Class[];
}

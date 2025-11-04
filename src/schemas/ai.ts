export type AIDiet = 'omnivore'|'vegan'|'vegetarian'|'keto'|'mediterranean';
export type AIGoal = 'weight_loss'|'muscle_gain'|'low_sodium'|'diabetes_friendly'|'budget';

export interface AIProfile {
  user_id: string;
  diet: AIDiet;
  allergies: string[];
  dislikes: string[];
  goals: AIGoal[];
  calories_target?: number | null;
  language: 'es'|'en';
}

export type ChatRole = 'user'|'assistant';
export interface AIMsg { role: ChatRole; content: string; }

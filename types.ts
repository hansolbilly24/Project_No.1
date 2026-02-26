
export interface FoodAnalysis {
  name: string;
  description: string;
  ingredients: string[];
  seasonings: string[];
  extraInfo: string;
}

export interface AnalysisResponse {
  items: FoodAnalysis[];
}

export type AppState = 'IDLE' | 'CAPTURING' | 'LOADING' | 'RESULT' | 'ERROR';

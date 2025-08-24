export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  isActive: boolean;
  timeRemaining: number;
  isPaused: boolean;
}

export interface ExerciseFormData {
  name: string;
  description: string;
  duration: number;
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubjectId = 'maths' | 'physique-chimie';

export type ChapterId =
  // Maths
  | 'calcul-numerique'
  | 'calcul-literal'
  | 'equations'
  | 'fonctions'
  | 'statistiques'
  | 'probabilites'
  | 'pythagore'
  | 'thales'
  | 'trigonometrie'
  | 'aires-volumes'
  | 'puissances'
  // Physique-chimie
  | 'electricite'
  | 'mouvement'
  | 'forces'
  | 'energie'
  | 'reactions-chimiques';

export interface Chapter {
  id: ChapterId;
  title: string;
  subject: SubjectId;
  description: string;
  summary: string[];
  tips: string[];
  formulas: { label: string; formula: string; explanation: string }[];
  difficulty: 1 | 2 | 3; // 1: Apprenti, 2: Expert, 3: Champion
}

export type ExerciseLevel = 1 | 2 | 3 | 4; // 1: Découverte, 2: Application, 3: Approfondissement, 4: Brevet

export interface Exercise {
  id: string;
  level: ExerciseLevel;
  type: 'qcm' | 'vrai-faux' | 'gap-fill' | 'numeric';
  question: string;
  options?: string[]; // for qcm or vrai-faux
  correctAnswer: string | number; // Exact string or match index
  tolerance?: number; // for numeric answers
  explanation: string;
  hint: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt?: string;
  requirement: string;
}

export interface UserStats {
  points: number;
  streak: number;
  level: string; // 'Débutant' | 'Apprenti' | 'Confirmé' | 'Expert' | 'Champion'
  completedExercises: Record<string, boolean>; // exId -> correct
  lastActiveDate?: string;
  studyTimeSeconds: number; // calculated simulated or real
  badges: string[]; // Badge ids
  history: {
    chapterId: string;
    pointsGained: number;
    timestamp: string;
    level: ExerciseLevel;
    success: boolean;
  }[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  type: string;
  requirement: string;
}


export enum Emotion {
  LONELY = 'Lonely',
  GRIEVING = 'Grieving',
  ANXIOUS = 'Anxious',
  OVERWHELMED = 'Overwhelmed',
  CALM = 'Calm',
  HOPEFUL = 'Hopeful',
  NEUTRAL = 'Neutral'
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  emotion?: Emotion;
}

export interface ChatSession {
  id: string;
  title: string;
  lastTimestamp: number;
  lastEmotion?: Emotion;
}

export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  age: string;
  language: 'English' | 'Hindi' | 'Telugu';
  avatarUrl?: string;
  voiceSampleUrl?: string;
  hasConsented: boolean;
}

export type ViewState = 'landing' | 'login' | 'signup' | 'consent' | 'avatar-setup' | 'chat' | 'voice-call' | 'video-call';

export interface EmotionMetrics {
  textSentiment: Emotion;
  voicePitch?: number;
  faceExpression?: Emotion;
}

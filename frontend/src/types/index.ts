export interface TranslationResponse {
  id: string;
  sourceLanguage: 'en' | 'hi' | 'isl';
  input: string;
  gloss: string[];
  outputType: 'en' | 'hi' | 'isl';
  signs: string[];
  translatedText?: string;
  confidence: number;
}

export interface ConversationMessage {
  id: string;
  sender: 'userA' | 'userB'; // userA = Hearing (Text/Speech), userB = Deaf (ISL)
  type: 'text' | 'isl';
  content: string;
  gloss?: string[];
  timestamp: number;
}

export type CameraState = 'idle' | 'requesting' | 'active' | 'detecting' | 'processing' | 'error' | 'unavailable';
export type SpeechState = 'idle' | 'requesting' | 'listening' | 'processing' | 'error';

// --- Text-to-Sign API Types ---

export interface SignData {
  id: string;
  label: string;
  video_url?: string;
}

export interface TextToSignResponse {
  success: boolean;
  input_text: string;
  normalized_text: string;
  gloss: string[];
  signs: SignData[];
  unsupported_words: string[];
}

export interface TextToSignError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// MOCK SERVICE ONLY - DO NOT USE FOR REAL AI RESULTS
import { TranslationResponse, ConversationMessage } from '@/types';

export const mockTranslateTextToISL = async (text: string): Promise<TranslationResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(),
        sourceLanguage: 'en',
        input: text,
        gloss: text.toUpperCase().split(' ').filter(w => w.length > 0), // naive mock
        outputType: 'isl',
        signs: text.toUpperCase().split(' ').filter(w => w.length > 0),
        confidence: 0.95
      });
    }, 1500); // simulate network latency
  });
};

export const mockTranslateISLToText = async (detectedSigns: string[]): Promise<TranslationResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(),
        sourceLanguage: 'isl',
        input: detectedSigns.join(' '),
        gloss: detectedSigns,
        outputType: 'en',
        signs: detectedSigns,
        translatedText: detectedSigns.join(' ').toLowerCase(), // naive mock
        confidence: 0.88
      });
    }, 1000);
  });
};

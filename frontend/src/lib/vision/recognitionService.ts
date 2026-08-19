import { TranslationResponse } from '@/types';

// Abstract interface that both Mock and Real services will satisfy
export interface RecognitionService {
  recognizeSign(landmarks: number[]): Promise<{ sign: string; confidence: number }>;
  translateToText(signs: string[]): Promise<TranslationResponse>;
}

export class RealRecognitionService implements RecognitionService {
  private threshold = 0.85; // To be tuned via validation

  async recognizeSign(landmarks: number[]): Promise<{ sign: string; confidence: number }> {
    // Phase 2A implementation target:
    // Once TF.js model is loaded, we would run:
    // const tensor = tf.tensor1d(landmarks).expandDims(0);
    // const prediction = await model.predict(tensor);
    // return { sign, confidence };
    
    // For now, throw not implemented until model is bound
    throw new Error('Real recognition model not yet loaded in browser.');
  }

  async translateToText(signs: string[]): Promise<TranslationResponse> {
    // This will hit the FastAPI backend
    try {
      const res = await fetch('http://localhost:8000/api/v1/translate/isl-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signs })
      });
      if (!res.ok) throw new Error('Backend translation failed');
      return await res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

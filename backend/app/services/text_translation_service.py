"""Text Translation Service — Converts text input to ISL sign sequences.

Pipeline:
    Input Text → Normalize → Tokenize → Dictionary Lookup → Sign Sequence

This is an MVP rule-based implementation. The gloss layer does NOT perform
linguistic ISL grammar transformation (e.g., SVO → SOV). It preserves
input word order and maps known vocabulary to signs. This layer is isolated
so it can later be replaced by a proper ISL NLP/gloss model.
"""
import re
from dataclasses import dataclass
from typing import List
from app.services.sign_dictionary import SignDictionary, SignEntry, sign_dictionary

@dataclass
class TranslationResult:
    input_text: str
    normalized_text: str
    gloss: List[str]
    signs: List[SignEntry]
    unsupported_words: List[str]

class TextNormalizer:
    def normalize(self, text: str) -> str:
        text = text.strip()
        text = text.lower()
        # Remove punctuation (keep alphanumeric and spaces)
        text = re.sub(r'[^\w\s]', '', text)
        # Collapse multiple spaces to single space
        text = re.sub(r'\s+', ' ', text)
        return text

class TextTranslationService:
    def __init__(self, dictionary: SignDictionary):
        self.dictionary = dictionary
        self.normalizer = TextNormalizer()

    def translate(self, text: str) -> TranslationResult:
        normalized_text = self.normalizer.normalize(text)
        
        if not normalized_text:
            raise ValueError("Input text cannot be empty.")
            
        tokens = normalized_text.split(' ')
        
        gloss = []
        signs = []
        unsupported_words = []
        
        for token in tokens:
            if not token:
                continue
            sign = self.dictionary.lookup_by_word(token)
            if sign:
                signs.append(sign)
                gloss.append(sign.gloss)
            else:
                unsupported_words.append(token)
                
        return TranslationResult(
            input_text=text,
            normalized_text=normalized_text,
            gloss=gloss,
            signs=signs,
            unsupported_words=unsupported_words
        )

text_translation_service = TextTranslationService(sign_dictionary)

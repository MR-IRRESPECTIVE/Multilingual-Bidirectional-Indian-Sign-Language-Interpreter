"""Text Translation Service - Converts text input to ISL sign sequences.

This module implements the SignKit text processing algorithm natively in Python.
Pipeline:
    Input Text -> SignKit Heuristic Processor -> Sign Dictionary Lookup -> Sign Sequence
"""
import re
from dataclasses import dataclass
from typing import List, Any
from app.services.sign_dictionary import SignDictionary, SignEntry, sign_dictionary

@dataclass
class TranslationResult:
    input_text: str
    normalized_text: str
    gloss: List[str]
    signs: List[SignEntry]
    unsupported_words: List[str]
    gloss_tokens: List[Any]  # Keep for compatibility, though not strictly used in new system

STOP_WORDS = {
    'A', 'AN', 'THE', 'IS', 'AM', 'ARE', 'WAS', 'WERE', 'BE', 'BEEN', 'BEING',
    'HAS', 'HAVE', 'HAD', 'DO', 'DOES', 'DID', 'SHALL', 'WILL', 'SHOULD', 'WOULD',
    'MAY', 'MIGHT', 'MUST', 'CAN', 'COULD', 'TO', 'OF', 'IN', 'FOR', 'WITH', 'ON', 'AT',
    'BY', 'FROM', 'UP', 'DOWN', 'INTO', 'OVER', 'THROUGH', 'DURING', 'INCLUDING', 'UNTIL',
    'AGAINST', 'AMONG', 'THROUGHOUT', 'DESPITE', 'TOWARDS', 'UPON', 'CONCERNING', 'ABOUT'
}

PRONOUNS = {'I', 'YOU', 'HE', 'SHE', 'IT', 'WE', 'THEY', 'ME', 'HIM', 'HER', 'US', 'THEM'}

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
        
        if not text.strip():
            raise ValueError("Input text cannot be empty.")
            
        # SignKit NLP Algorithm
        cleaned = re.sub(r'[.,/#!$%^&*;:{}=\-_`~()?]', '', text.upper())
        words = [w for w in cleaned.split() if w]
        
        # Merge "THANK YOU" before filtering
        # SignKit tokenizer actually splits "THANK YOU", but handles it as "THANKYOU" or falls back.
        # We can implement a smarter pass to preserve common phrases in the dictionary.
        # A simple lookahead for "THANK" + "YOU":
        merged_words = []
        i = 0
        while i < len(words):
            if i + 1 < len(words) and words[i] == 'THANK' and words[i+1] == 'YOU':
                merged_words.append('THANK YOU')
                i += 2
            else:
                merged_words.append(words[i])
                i += 1
                
        words = merged_words
        
        filtered = []
        for w in words:
            if w in STOP_WORDS:
                # Keep stop words like 'A' if the user is explicitly typing individual letters
                if all(len(x) == 1 for x in words):
                    filtered.append(w)
            else:
                filtered.append(w)
                
        # Simple SOV rearrangement for 3-word sentences
        if len(filtered) >= 3 and filtered[0] in PRONOUNS:
            subject = filtered[0]
            verb = filtered[1]
            rest = filtered[2:]
            filtered = [subject] + rest + [verb]
            
        # Deduplication of identical consecutive words
        final_words = []
        for i in range(len(filtered)):
            if i == 0 or filtered[i] != filtered[i - 1]:
                final_words.append(filtered[i])
        
        gloss = []
        signs = []
        unsupported_words = []
        
        for w in final_words:
            sign = self.dictionary.lookup_by_word(w)
            if sign:
                signs.append(sign)
                gloss.append(sign.gloss)
            else:
                unsupported_words.append(w)
                gloss.append(w)
                
        return TranslationResult(
            input_text=text,
            normalized_text=normalized_text,
            gloss=gloss,
            signs=signs,
            unsupported_words=unsupported_words,
            gloss_tokens=[]
        )

text_translation_service = TextTranslationService(sign_dictionary)

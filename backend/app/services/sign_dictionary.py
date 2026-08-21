"""Sign Dictionary Service — Single source of truth for ISL sign metadata.

This module provides a dictionary abstraction for looking up ISL signs.
It has been updated to reflect the full SignKit 3D Avatar vocabulary.
"""
from dataclasses import dataclass
from typing import List, Optional, Dict

@dataclass
class SignEntry:
    id: str
    label: str
    gloss: str
    aliases: List[str]

class SignDictionary:
    def lookup_by_word(self, word: str) -> Optional[SignEntry]:
        raise NotImplementedError

    def lookup_by_id(self, sign_id: str) -> Optional[SignEntry]:
        raise NotImplementedError

    def get_all_signs(self) -> List[SignEntry]:
        raise NotImplementedError

class StaticSignDictionary(SignDictionary):
    def __init__(self):
        # SignKit vocabulary list
        words = [
            'TIME', 'HOME', 'PERSON', 'YOU', 'DOCTOR', 'SCHOOL', 'THINK',
            'HELLO', 'PLEASE', 'THANKYOU', 'SORRY', 'WHAT', 'YOUR', 'NAME',
            'YES', 'NO', 'GOOD', 'BAD', 'EAT', 'DRINK',
            'MOTHER', 'FATHER', 'BROTHER', 'SISTER',
            'I', 'ME', 'MY', 'HE', 'SHE', 'IT', 'WE', 'THEY',
            'COME', 'GO', 'STOP', 'WAIT', 'HELP',
            'SEE', 'LOOK', 'WATCH', 'HEAR',
            'HAPPY', 'SAD', 'ANGRY', 'LOVE', 'LIKE', 'WANT',
            'MORNING', 'NIGHT', 'DAY', 'WEEK', 'MONTH', 'YEAR',
            'HOUSE', 'FRIEND', 'WORK', 'PLAY', 'LEARN',
            'BOOK', 'READ', 'WRITE',
            'FOOD', 'WATER', 'MILK'
        ]
        
        # Numbers and alphabets for fingerspelling fallback are also supported by SignKit,
        # but we handle them differently (as letter-by-letter).
        # We can add 0-9 and A-Z to the alias map as well if needed.
        
        self._signs: List[SignEntry] = []
        for w in words:
            # Special case variations
            aliases = [w.lower()]
            if w == 'THANKYOU':
                aliases.append('thank you')
                aliases.append('thanks')
            if w == 'HELLO':
                aliases.append('hi')
                
            self._signs.append(
                SignEntry(id=w.lower(), label=w, gloss=w, aliases=aliases)
            )
            
        self._alias_map: Dict[str, SignEntry] = {}
        for sign in self._signs:
            for alias in sign.aliases:
                self._alias_map[alias] = sign

    def lookup_by_word(self, word: str) -> Optional[SignEntry]:
        return self._alias_map.get(word.lower())

    def lookup_by_id(self, sign_id: str) -> Optional[SignEntry]:
        for sign in self._signs:
            if sign.id == sign_id:
                return sign
        return None

    def get_all_signs(self) -> List[SignEntry]:
        return self._signs

sign_dictionary = StaticSignDictionary()

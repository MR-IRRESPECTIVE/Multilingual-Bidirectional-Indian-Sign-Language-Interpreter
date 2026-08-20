"""Sign Dictionary Service — Single source of truth for ISL sign metadata.

This module provides a dictionary abstraction for looking up ISL signs.
The current implementation uses static in-memory data. It can later be
replaced by a database-backed implementation without changing the interface.
"""
from dataclasses import dataclass
from typing import List, Optional, Dict

@dataclass
class SignEntry:
    id: str
    label: str
    gloss: str
    video: str
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
        self._signs: List[SignEntry] = [
            SignEntry(id="hello", label="Hello", gloss="HELLO", video="/signs/hello.mp4", aliases=["hello", "hi"]),
            SignEntry(id="sorry", label="Sorry", gloss="SORRY", video="/signs/sorry.mp4", aliases=["sorry"]),
            SignEntry(id="eat_food", label="Eat / Food", gloss="EAT", video="/signs/eat_food.mp4", aliases=["eat", "food"]),
            SignEntry(id="indian", label="Indian", gloss="INDIAN", video="/signs/indian.mp4", aliases=["indian", "india"]),
            SignEntry(id="namaste", label="Namaste", gloss="NAMASTE", video="/signs/namaste.mp4", aliases=["namaste"]),
            SignEntry(id="thank_you", label="Thank You", gloss="THANK_YOU", video="/signs/thank_you.mp4", aliases=["thank", "thanks", "thank you"]),
            SignEntry(id="love", label="Love", gloss="LOVE", video="/signs/love.mp4", aliases=["love"]),
            SignEntry(id="good", label="Good", gloss="GOOD", video="/signs/good.mp4", aliases=["good", "great", "nice"]),
            SignEntry(id="yes", label="Yes", gloss="YES", video="/signs/yes.mp4", aliases=["yes", "yeah", "yep"]),
            SignEntry(id="no", label="No", gloss="NO", video="/signs/no.mp4", aliases=["no", "nope", "nah"]),
        ]
        
        self._alias_map: Dict[str, SignEntry] = {}
        for sign in self._signs:
            for alias in sign.aliases:
                self._alias_map[alias.lower()] = sign

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

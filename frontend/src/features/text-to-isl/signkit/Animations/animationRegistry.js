import * as words from './words';
import * as alphabets from './alphabets';
import * as numbers from './numbers';

/**
 * Registry for all available animations.
 * Provides a unified interface to retrieve animations by keyword.
 */
class AnimationRegistry {
    constructor() {
        this.cache = new Map();
        this.initialize();
    }

    initialize() {
        // Load words
        const wordList = words.wordList || [];
        wordList.forEach(word => {
            if (words[word]) {
                const key = word.toUpperCase();
                this.cache.set(key, words[word]);

                // Add common variations
                if (key === "THANKYOU") this.cache.set("THANK YOU", words[word]);
                if (key === "HELLO") this.cache.set("HI", words[word]);
            }
        });

        // Load alphabets explicitly to avoid bundler dynamic access issues
        const alphabetsMap = {
            'A': alphabets.A, 'B': alphabets.B, 'C': alphabets.C, 'D': alphabets.D,
            'E': alphabets.E, 'F': alphabets.F, 'G': alphabets.G, 'H': alphabets.H,
            'I': alphabets.I, 'J': alphabets.J, 'K': alphabets.K, 'L': alphabets.L,
            'M': alphabets.M, 'N': alphabets.N, 'O': alphabets.O, 'P': alphabets.P,
            'Q': alphabets.Q, 'R': alphabets.R, 'S': alphabets.S, 'T': alphabets.T,
            'U': alphabets.U, 'V': alphabets.V, 'W': alphabets.W, 'X': alphabets.X,
            'Y': alphabets.Y, 'Z': alphabets.Z
        };
        Object.keys(alphabetsMap).forEach(letter => {
            if (alphabetsMap[letter]) {
                this.cache.set(letter, alphabetsMap[letter]);
            }
        });

        // Load numbers explicitly to avoid bundler dynamic access issues
        const numberMap = {
            "0": numbers.Zero, "1": numbers.One, "2": numbers.Two, "3": numbers.Three, 
            "4": numbers.Four, "5": numbers.Five, "6": numbers.Six, "7": numbers.Seven, 
            "8": numbers.Eight, "9": numbers.Nine
        };
        Object.keys(numberMap).forEach(num => {
            if (numberMap[num]) {
                this.cache.set(num, numberMap[num]);
            }
        });

    }

    /**
     * Get animation function for a word or character.
     * @param {string} key - The word or character to look up.
     * @returns {Function|null} - The animation function or null if not found.
     */
    getAnimation(key) {
        if (!key) return null;
        const upperKey = key.toUpperCase().trim();
        return this.cache.get(upperKey) || null;
    }

    /**
     * Check if an animation exists.
     * @param {string} key 
     * @returns {boolean}
     */
    hasAnimation(key) {
        if (!key) return false;
        return this.cache.has(key.toUpperCase().trim());
    }

    /**
     * Returns all registered word keys.
     */
    getRegisteredWords() {
        return words.wordList || [];
    }
}

const registry = new AnimationRegistry();
export default registry;

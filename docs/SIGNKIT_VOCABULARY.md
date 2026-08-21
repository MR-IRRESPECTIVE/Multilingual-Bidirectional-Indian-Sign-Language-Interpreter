# SignKit Vocabulary Audit

Total number of signs: ~55 specific words + 26 alphabet characters + 10 numbers (0-9).

## Words Supported
- Pronouns: I, ME, HE, SHE, IT, WE, THEY, MY, YOU, YOUR
- Question words: WHAT
- Nouns: PERSON, DOCTOR, SCHOOL, HOME, HOUSE, BOOK, FOOD, WATER, MILK, MOTHER, FATHER, BROTHER, SISTER, FRIEND
- Adjectives/Feelings: GOOD, BAD, HAPPY, SAD, ANGRY, LOVE, LIKE
- Actions: THINK, EAT, DRINK, COME, GO, STOP, WAIT, HELP, SEE, LOOK, WATCH, HEAR, WANT, WORK, PLAY, LEARN, READ, WRITE
- Greetings/Manners: HELLO, PLEASE, THANK YOU (mapped to THANKYOU), SORRY, YES, NO
- Time: TIME, MORNING, NIGHT, DAY, WEEK, MONTH, YEAR

## Sentence Support
Supports basic SOV translations via a simple JavaScript heuristic (moves verb to the end if a pronoun is present in a 3-word sentence, drops stopwords). No real NLP grammar handling.

## Unsupported Word Behavior
If a word is not found in the vocabulary list, it falls back to fingerspelling the word letter-by-letter.

## Missing Animations (based on 7 test sentences)
1. "Hello" -> HELLO (All supported)
2. "Thank you" -> THANKYOU (Bug in client split might cause it to fallback to fingerspelling T-H-A-N-K, but THANKYOU is supported)
3. "I want water" -> I, WATER, WANT (All supported)
4. "I am going home" -> I, HOME, GOING (GOING is not supported, fingerspelled G-O-I-N-G. GO is supported but no lemmatization is present)
5. "Where is the hospital?" -> WHERE, HOSPITAL (Neither supported. Fingerspelled W-H-E-R-E H-O-S-P-I-T-A-L)
6. "I need help" -> I, HELP, NEED (NEED is not supported. Fingerspelled N-E-E-D)
7. "What is your name?" -> WHAT, YOUR, NAME (All supported)

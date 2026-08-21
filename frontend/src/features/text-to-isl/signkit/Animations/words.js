// 1. Import the word data
import { TIME } from './Words/TIME';
import { HOME } from './Words/HOME';
import { PERSON } from './Words/PERSON';
import { YOU } from './Words/YOU';
import { DOCTOR } from './Words/DOCTOR';
import { SCHOOL } from './Words/SCHOOL';
import { THINK } from './Words/THINK';
import { HELLO } from './Words/HELLO';
import { PLEASE } from './Words/PLEASE';
import { THANKYOU } from './Words/THANKYOU';
import { SORRY } from './Words/SORRY';
import { WHAT } from './Words/WHAT';
import { YOUR } from './Words/YOUR';
import { NAME } from './Words/NAME';
import { UNKNOWN_WORD } from './Words/UNKNOWN_WORD';

// New Generic/Basic
import { GENERIC } from './Words/GENERIC';

// New Specific Categories
import { YES } from './Words/YES';
import { NO } from './Words/NO';
import { GOOD } from './Words/GOOD';
import { BAD } from './Words/BAD';
import { EAT } from './Words/EAT';

import { DRINK, WATER, MILK, FOOD } from './Words/FOOD_DRINK';
import { MOTHER, FATHER, BROTHER, SISTER } from './Words/FAMILY';
import { POINT_SELF, POINT_OUT, POINT_SWEEP, MY, FRIEND } from './Words/PRONOUNS';
import { LOVE, HAPPY, SAD, WANT, ANGRY, LIKE } from './Words/FEELINGS';
import { STOP, COME, GO, HELP, SEE, WATCH, HEAR, WAIT } from './Words/ACTIONS';
import { MORNING, NIGHT, BOOK, HOUSE } from './Words/MISC';
import { WORK, PLAY, LEARN, READ, WRITE } from './Words/SCHOOL_WORK';
import { DAY, WEEK, MONTH, YEAR } from './Words/EACH_TIME';


// 2. Add the strings to the wordList so the search/logic can find them
var wordList = [
    'TIME', 'HOME', 'PERSON', 'YOU', 'DOCTOR', 'SCHOOL', 'THINK',
    'HELLO', 'PLEASE', 'THANKYOU', 'SORRY', 'WHAT', 'YOUR', 'NAME',
    'UNKNOWN_WORD',
    // New 50 Words
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
];

// 3. Export variables (Mapping words to animations)

// --- MAPPINGS ---

const I = POINT_SELF;
const ME = POINT_SELF;
// MY is now specific

const HE = POINT_OUT;
const SHE = POINT_OUT;
const IT = POINT_OUT;

const WE = POINT_SWEEP;
const THEY = POINT_SWEEP; // Using same sweep for plural (Context based usually, but physically similar)

export {
    // Original
    TIME, HOME, PERSON, YOU, DOCTOR, SCHOOL, THINK,
    HELLO, PLEASE, THANKYOU, SORRY, WHAT, YOUR, NAME,
    UNKNOWN_WORD,

    // New Implementations
    YES, NO, GOOD, BAD, EAT,
    MOTHER, FATHER, BROTHER, SISTER,
    POINT_SELF, POINT_OUT, POINT_SWEEP, MY, FRIEND,
    LOVE, HAPPY, SAD, WANT, ANGRY, LIKE,
    STOP, COME, GO, HELP, SEE, WATCH, HEAR, WAIT,
    MORNING, NIGHT, BOOK, HOUSE,
    WORK, PLAY, LEARN, READ, WRITE,
    DAY, WEEK, MONTH, YEAR,
    DRINK, WATER, MILK, FOOD,

    // Mapped Exports (Aliases)
    I, ME, HE, SHE, IT, WE, THEY,

    // List
    wordList,

    // Export GENERIC for potential external usage
    GENERIC
}
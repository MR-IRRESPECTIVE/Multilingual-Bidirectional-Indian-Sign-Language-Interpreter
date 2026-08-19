# ISL MVP Sign Specification

This document defines the physical gesture requirements for the 10 target classes in our MVP vocabulary. All definitions are strictly based on Indian Sign Language (ISL) as standardized by the Indian Sign Language Research and Training Centre (ISLRTC).

## Summary of Findings [VERIFIED]

Our ISL research reveals a critical characteristic of our chosen vocabulary: **8 out of 10 signs are strictly DYNAMIC**. They require temporal motion (trajectory) to be understood and cannot be classified from a single static video frame.

| # | Sign Name | Hands | Pose Type | Duration | Recognition Mode | Reference Source |
|---|-----------|-------|-----------|----------|-------------------|------------------|
| 1 | **Hello** | 1 | Dynamic | 1.0–1.5s | Temporal Sequence | ISLRTC Dictionary / Sign Learn App |
| 2 | **Sorry** | 1 | Dynamic | 1.2–2.0s | Temporal Sequence | ISLRTC Dictionary / ISH Shiksha |
| 3 | **Eat / Food** | 1 | Dynamic | 1.0–1.8s | Temporal Sequence | ISLRTC Dictionary / FDMSE Portal |
| 4 | **Indian** | 1 | Dynamic | 1.0–1.5s | Temporal Sequence | ISLRTC Dictionary / CADRRE Series |
| 5 | **Namaste** | 2 | **Static** | 1.0–2.0s | Single Frame | ISLRTC Dictionary / SignAcademy |
| 6 | **Thank You** | 1 | Dynamic | 1.0–1.5s | Temporal Sequence | ISLRTC Dictionary / Basic Module |
| 7 | **Love** | 2 | Dyn→Static | 1.2–2.0s | Temporal / Static | ISLRTC Dictionary / FDMSE Portal |
| 8 | **Good** | 1 | Dynamic | 1.0–1.5s | Temporal Sequence | ISLRTC Dictionary / Sign Learn App |
| 9 | **Yes** | 1 | Dynamic | 1.0–1.5s | Temporal Sequence | ISLRTC Dictionary / INCLUDE Dataset |
| 10 | **No** | 1 | Dynamic | 1.0–1.5s | Temporal Sequence | ISLRTC Dictionary / INCLUDE Dataset |

---

## Detailed Sign Specifications

### 1. Hello
*   **Intended meaning:** Greeting.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.0 - 1.5s.
*   **Frame requirement:** Temporal Sequence. The oscillatory lateral motion of the open palm (facing outward) near the temple/shoulder must be tracked.
*   **Ambiguity:** High ambiguity with "Goodbye" or "Stop" (if held static).
*   **Reference:** ISLRTC Dictionary (Category: Greetings and Salutations).

### 2. Sorry
*   **Intended meaning:** Apology.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.2 - 2.0s.
*   **Frame requirement:** Temporal Sequence. The closed fist ('A' handshape) over the chest/heart rotates in a circular rubbing motion.
*   **Ambiguity:** Ambiguous with "Mine" or "Heart" if captured as a single frame. *Note: Holding the earlobes is a cultural gesture, NOT standard linguistic ISL for "Sorry".*
*   **Reference:** ISLRTC Standard ISL Dictionary (Sign code: SORRY / क्षमा).

### 3. Eat / Food
*   **Intended meaning:** The verb eat, or noun food.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.0 - 1.8s.
*   **Frame requirement:** Temporal Sequence. Flattened "O" handshape moves toward mouth (repetitive tap for noun, single motion for verb).
*   **Ambiguity:** "Drink", "Fruit", or just touching the mouth.
*   **Reference:** ISLRTC Dictionary (Category: Food & Beverages).

### 4. Indian / India
*   **Intended meaning:** Nationality / Country.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.0 - 1.5s.
*   **Frame requirement:** Temporal Sequence. Index finger moves to center of forehead (tilak placement), often followed by a downward sweep (person marker).
*   **Ambiguity:** "Bindi", "Hindu", "Think", "Father".
*   **Reference:** ISLRTC Official Dictionary (Category: Countries & Nationalities).

### 5. Namaste
*   **Intended meaning:** Traditional greeting.
*   **Hands required:** 2.
*   **Static/Dynamic:** Static.
*   **Duration:** 1.0 - 2.0s hold.
*   **Frame requirement:** Single Frame. Palms together at mid-chest.
*   **Ambiguity:** "Pray" or "Temple".
*   **Reference:** ISLRTC Official Dictionary (Category: Greetings / Indian Culture).

### 6. Thank You
*   **Intended meaning:** Gratitude.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.0 - 1.5s.
*   **Frame requirement:** Temporal Sequence. Flat open hand touches chin/lower lip and sweeps outward/downward towards recipient.
*   **Ambiguity:** High ambiguity with "Good", "Welcome", and "True".
*   **Reference:** ISLRTC Basic Communication Skills Course.

### 7. Love
*   **Intended meaning:** Affection.
*   **Hands required:** 2.
*   **Static/Dynamic:** Dynamic to Static Hold.
*   **Duration:** ~1.2 - 2.0s.
*   **Frame requirement:** Temporal Sequence (preferred) or Static Frame (peak hold). Arms cross over chest mimicking self-embrace.
*   **Ambiguity:** "Hug" or "Protect/Block".
*   **Reference:** ISLRTC Official Dictionary.

### 8. Good
*   **Intended meaning:** Positive adjective.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.0 - 1.5s.
*   **Frame requirement:** Temporal Sequence. Flat hand touches chin and moves forward/downward (similar to Thank You, distinguished by trajectory/affect).
*   **Ambiguity:** "Thank You", "Fine", "Correct".
*   **Reference:** ISLRTC Official Dictionary.

### 9. Yes
*   **Intended meaning:** Affirmation.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.0 - 1.5s.
*   **Frame requirement:** Temporal Sequence. Fist ('S' handshape) at chest/shoulder level nods downward repeatedly at the wrist.
*   **Ambiguity:** The letter 'S', 'A', or "Hammer".
*   **Reference:** ISLRTC Official Dictionary (Category: Affirmations & Negations).

### 10. No
*   **Intended meaning:** Negation.
*   **Hands required:** 1 (dominant).
*   **Static/Dynamic:** Dynamic.
*   **Duration:** ~1.0 - 1.5s.
*   **Frame requirement:** Temporal Sequence. Dominant hand oscillates horizontally side-to-side.
*   **Ambiguity:** "Don't Want", "Stop".
*   **Reference:** ISLRTC Official Dictionary (Category: Affirmations & Negations).

---
> [!IMPORTANT]  
> All future dataset collection must strictly adhere to the motions defined by the ISLRTC dictionary. Do not substitute American Sign Language (ASL) variants.

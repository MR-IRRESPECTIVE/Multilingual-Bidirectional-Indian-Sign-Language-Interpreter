# Master ISL Vocabulary — All Projects

This document inventories every ISL sign that exists across all our previous and current projects.

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Has trained model output neuron AND committed dataset |
| 🟡 | Has trained model output neuron but dataset NOT committed to repo |
| 📁 | Has dataset only (no reliable trained model) |
| ❌ | Referenced in labels but no model or data |
| **VERIFIED SAME** | Same physical sign in both projects |
| **POSSIBLY SAME** | Likely same, needs visual confirmation |
| **UNKNOWN** | Different label convention, cannot confirm |

---

## Section 1 — ISL Words / Phrases

| Sign | Current BiLSTM | Atharv Model (5).keras | Atharv Dataset | Overlap Status |
|---|---|---|---|---|
| Hello | ✅ (idx 0) | 🟡 (idx 8) | ✅ 2,426 samples | **POSSIBLY SAME** — both use MediaPipe hand landmarks |
| Sorry | ✅ (idx 1) | 🟡 (idx 9) | ✅ 2,163 samples | **POSSIBLY SAME** |
| Eat / Food | ✅ (idx 2) | 🟡 (idx 29) | ❌ no committed data | **POSSIBLY SAME** |
| Indian | ✅ (idx 3) | ❌ not in model | — | N/A |
| Namaste | ✅ (idx 4) | ❌ not in model | — | N/A |
| Thank You | ✅ (idx 5) | ❌ not in model | — | N/A |
| Love | ✅ (idx 6) | ❌ not in model | — | N/A |
| Good | ✅ (idx 7) | ❌ not in model | — | N/A |
| Yes | ✅ (idx 8) | ❌ not in model | — | N/A |
| No | ✅ (idx 9) | ❌ not in model | — | N/A |
| Hearing | ❌ | ❌ (label CSV only, idx 31) | — | N/A |
| House | ❌ | ❌ (label CSV only, idx 35) | — | N/A |
| Practice | ❌ | ❌ (label CSV only, idx 36) | — | N/A |

> **Words exclusive to our BiLSTM (no legacy equivalent):** Indian, Namaste, Thank You, Love, Good, Yes, No

---

## Section 2 — Alphabet Letters

| Letter | Current BiLSTM | Atharv (5).keras | Atharv Data | Maitree Model | Maitree Data | Dhadwal SqueezeNet | Dhadwal Data |
|---|---|---|---|---|---|---|---|
| A | ❌ | 🟡 (idx 10) | ❌ | ✅ (idx 9) | ✅ 4,264 | ❌ | ❌ |
| B | ❌ | 🟡 (idx 11) | ❌ | ✅ (idx 10) | ✅ 2,206 | ❌ | ❌ |
| C | ❌ | 🟡 (idx 12) | ❌ | ✅ (idx 11) | ✅ 1,199 | ❌ | ❌ |
| D | ❌ | 🟡 (idx 13) | ❌ | 🟡 (idx 12) | ❌ | ❌ | ❌ |
| E | ❌ | 🟡 (idx 14) | ❌ | 🟡 (idx 13) | ❌ | ❌ | ❌ |
| F | ❌ | 🟡 (idx 15) | ❌ | 🟡 (idx 14) | ❌ | ❌ | ❌ |
| G | ❌ | 🟡 (idx 16) | ❌ | 🟡 (idx 15) | ❌ | ✅ (idx 0) | (no weights) |
| H | ❌ | 🟡 (idx 17) | ❌ | 🟡 (idx 16) | ❌ | ❌ | ❌ |
| I | ❌ | 🟡 (idx 18) | ❌ | 🟡 (idx 17) | ❌ | ✅ (idx 1) | (no weights) |
| J | ❌ | 🟡 (idx 19) | ❌ | 🟡 (idx 18) | ❌ | ❌ | ❌ |
| K | ❌ | 🟡 (idx 20) | ❌ | 🟡 (idx 19) | ❌ | ✅ (idx 2) | (no weights) |
| L | ❌ | 🟡 (idx 21) | ❌ | 🟡 (idx 20) | ❌ | ❌ | ❌ |
| M | ❌ | ❌ | ❌ | 🟡 (idx 21) | ❌ | ❌ | ❌ |
| N | ❌ | ❌ | ❌ | 🟡 (idx 22) | ❌ | ❌ | ❌ |
| O | ❌ | ❌ | ❌ | 🟡 (idx 23) | ❌ | ✅ (idx 3) | (no weights) |
| P | ❌ | 🟡 (idx 22) | ❌ | 🟡 (idx 24) | ❌ | ✅ (idx 4) | (no weights) |
| Q | ❌ | ❌ | ❌ | 🟡 (idx 25) | ❌ | ❌ | ❌ |
| R | ❌ | ❌ | ❌ | 🟡 (idx 26) | ❌ | ❌ | ❌ |
| S | ❌ | 🟡 (idx 23) | ❌ | 🟡 (idx 27) | ❌ | ✅ (idx 5) | (no weights) |
| T | ❌ | 🟡 (idx 24) | ❌ | 🟡 (idx 28) | ❌ | ❌ | ❌ |
| U | ❌ | 🟡 (idx 25) | ❌ | 🟡 (idx 29) | ❌ | ✅ (idx 6) | (no weights) |
| V | ❌ | ❌ | ❌ | 🟡 (idx 30) | ❌ | ✅ (idx 7) | (no weights) |
| W | ❌ | ❌ | ❌ | 🟡 (idx 31) | ❌ | ❌ | ❌ |
| X | ❌ | 🟡 (idx 26) | ❌ | 🟡 (idx 32) | ❌ | ✅ (idx 8) | (no weights) |
| Y | ❌ | 🟡 (idx 27) | ❌ | 🟡 (idx 33) | ❌ | ✅ (idx 9) | (no weights) |
| Z | ❌ | 🟡 (idx 28) | ❌ | 🟡 (idx 34) | ❌ | ❌ | ❌ |

> **Letters with committed data in ANY repo:** A (Maitree: 4,264), B (Maitree: 2,206), C (Maitree: 1,199)
> **Letters in a trained model but no committed data:** A-L, P, S, T, U, X-Z (Atharv model), all letters (Maitree model, mostly untrained)

---

## Section 3 — Numbers / Digits

| Digit | Current BiLSTM | Atharv (5).keras | Atharv Data | Maitree Model | Maitree Data |
|---|---|---|---|---|---|
| 0 | ❌ | 🟡 (idx 0) | ✅ 2,102 (kp3) | ❌ | ❌ |
| 1 | ❌ | 🟡 (idx 1) | ✅ 1,923 (kp3) | 🟡 (idx 0) | ❌ |
| 2 | ❌ | 🟡 (idx 2) | ✅ 2,152 (kp3) | 🟡 (idx 1) | ❌ |
| 3 | ❌ | 🟡 (idx 3) | ✅ 1,849 (kp3) | 🟡 (idx 2) | ❌ |
| 4 | ❌ | 🟡 (idx 4) | ✅ 2,402 (kp) | 🟡 (idx 3) | ❌ |
| 5 | ❌ | ❌ | ❌ | 🟡 (idx 4) | ❌ |
| 6 | ❌ | ❌ | ❌ | 🟡 (idx 5) | ❌ |
| 7 | ❌ | 🟡 (idx 5) | ✅ 2,121 (kp) | 🟡 (idx 6) | ❌ |
| 8 | ❌ | 🟡 (idx 6) | ✅ 3,164 (kp) | 🟡 (idx 7) | ❌ |
| 9 | ❌ | 🟡 (idx 7) | ✅ 1,814 (kp) | 🟡 (idx 8) | ❌ |

> **Digits with committed data:** 0 (2102), 1 (1923), 2 (2152), 3 (1849), 4 (2402), 7 (2121), 8 (3164), 9 (1814). Missing: 5, 6.

---

## Section 4 — Gesture Trajectories (Point History Classifier)

| Gesture | Model | Dataset |
|---|---|---|
| Stop | Atharv `point_history_classifier.hdf5` | ✅ 1,481 samples |
| Clockwise | Atharv `point_history_classifier.hdf5` | ✅ 1,234 samples |
| Counter Clockwise | Atharv `point_history_classifier.hdf5` | ✅ 1,279 samples |
| Move | Atharv `point_history_classifier.hdf5` | ✅ 1,302 samples |

These are finger-trajectory gestures (index finger tip path over 16 frames, 32 features).

---

## Section 5 — SIH Image Dataset (no trained model)

| Class | Images | Notes |
|---|---|---|
| A | 310 | Raw cropped hand images — MediaPipe landmarks not extracted |
| B | 304 | Same |
| C | 305 | Same |

These can be used to generate 42-feature landmark data with `dataset_keypoint_generation.py`.

---

## Complete Unique Vocabulary Count

| Category | Count | Status |
|---|---|---|
| ISL Words (current BiLSTM) | 10 | Has model + data |
| ISL Words (legacy only, not in BiLSTM) | 2 (hello, sorry in both; eat/food too) | In Atharv model, dataset partial |
| ISL Words (label only, no model+data anywhere) | 3 (indian, namaste, thank you etc. in label CSV only) | ❌ |
| Alphabet letters (at least one committed dataset) | 3 (A, B, C) | Maitree dataset |
| Alphabet letters (trained model neuron, NO dataset committed) | 22+ | Atharv model neurons |
| Digits (committed dataset) | 8 (0-4, 7-9) | Atharv dataset |
| Gesture trajectories | 4 | Atharv |

**Total unique signs referenced across ALL projects: ~70**
**Total with model + committed data: ~25**

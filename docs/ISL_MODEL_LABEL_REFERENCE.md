# ISL Model Label Reference

This document tracks the exact 41 classes contained within the inherited `keypoint_classifier.tflite` model (via `keypoint_classifier_label.csv`). 

| Index | Exact Label | Category | Source | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| 0 | `0` | Number | Repo 3 | Verified via CSV |
| 1 | `1` | Number | Repo 3 | Verified via CSV |
| 2 | `2` | Number | Repo 3 | Verified via CSV |
| 3 | `3` | Number | Repo 3 | Verified via CSV |
| 4 | `4` | Number | Repo 3 | Verified via CSV |
| 5 | `7` | Number | Repo 3 | Verified via CSV |
| 6 | `8` | Number | Repo 3 | Verified via CSV |
| 7 | `9` | Number | Repo 3 | Verified via CSV |
| 8 | `hello` | Word | Repo 3 | Verified via CSV |
| 9 | `sorry` | Word | Repo 3 | Verified via CSV |
| 10 | `a` | Alphabet | Repo 3 | Verified via CSV |
| 11 | `b` | Alphabet | Repo 3 | Verified via CSV |
| 12 | `c` | Alphabet | Repo 3 | Verified via CSV |
| 13 | `d` | Alphabet | Repo 3 | Verified via CSV |
| 14 | `e` | Alphabet | Repo 3 | Verified via CSV |
| 15 | `f` | Alphabet | Repo 3 | Verified via CSV |
| 16 | `g` | Alphabet | Repo 3 | Verified via CSV |
| 17 | `h ` | Alphabet | Repo 3 | Verified via CSV (includes trailing space) |
| 18 | `i` | Alphabet | Repo 3 | Verified via CSV |
| 19 | `j` | Alphabet | Repo 3 | Verified via CSV |
| 20 | `k` | Alphabet | Repo 3 | Verified via CSV |
| 21 | `l` | Alphabet | Repo 3 | Verified via CSV |
| 22 | `p` | Alphabet | Repo 3 | Verified via CSV |
| 23 | `s ` | Alphabet | Repo 3 | Verified via CSV (includes trailing space) |
| 24 | `t` | Alphabet | Repo 3 | Verified via CSV |
| 25 | `u` | Alphabet | Repo 3 | Verified via CSV |
| 26 | `x` | Alphabet | Repo 3 | Verified via CSV |
| 27 | `y` | Alphabet | Repo 3 | Verified via CSV |
| 28 | `z` | Alphabet | Repo 3 | Verified via CSV |
| 29 | `eat/food` | Word | Repo 3 | Verified via CSV |
| 30 | `indian` | Word | Repo 3 | Verified via CSV |
| 31 | `hearing` | Word | Repo 3 | Verified via CSV |
| 32 | `namaste` | Word | Repo 3 | Verified via CSV |
| 33 | `thank you` | Word | Repo 3 | Verified via CSV |
| 34 | `love` | Word | Repo 3 | Verified via CSV |
| 35 | `house` | Word | Repo 3 | Verified via CSV |
| 36 | `practice` | Word | Repo 3 | Verified via CSV |
| 37 | `good` | Word | Repo 3 | Verified via CSV |
| 38 | `no` | Word | Repo 3 | Verified via CSV |
| 39 | `yes` | Word | Repo 3 | Verified via CSV |
| 40 | `null` | System | Repo 3 | Verified via CSV |

## Observations & Anomalies
- Numbers `5` and `6` are missing.
- Alphabets `m, n, o, q, r, v, w` are missing.
- Labels `h ` and `s ` contain trailing whitespaces in the original CSV.
- The `null` class (index 40) is utilized programmatically in the source code as the fallback "UNKNOWN" state when the softmax threshold drops below 0.5.

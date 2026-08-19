# Existing Dataset Provenance & Reuse Audit (Phase 3A)

## 1. Executive Summary

This audit examined the existing `keypoint.csv` and `keypoint_3.csv` datasets found in the original ISL repository. 

**Conclusion:** The datasets were **self-collected by the repository authors** using the `logging_csv` function in `app.py`. They were not downloaded from a public source like Kaggle. Because the repository contains **no license**, we do not have legal permission to reuse or redistribute this data. Furthermore, the datasets only cover 10 unique classes combined and consist of single-frame static captures, making them technically insufficient for our dynamic MVP vocabulary.

**Reuse Classification:** **E. NOT PERMITTED** (No license) and **C. RESEARCH/REFERENCE ONLY**.

---

## 2. Dataset Inventory

- **File 1:** `Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint.csv`
- **File 2:** `Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_3.csv`

---

## 3. Sample Counts

| Metric | `keypoint.csv` | `keypoint_3.csv` | Status |
|--------|----------------|------------------|--------|
| Total Rows | 14,090 | 8,026 | **VERIFIED** |
| Unique Rows | 14,090 | 8,026 | **VERIFIED** |
| Exact Duplicates | 0 | 0 | **VERIFIED** |
| Unique Classes | 6 | 4 | **VERIFIED** |

---

## 4. Class Mapping

Using `keypoint_classifier_label.csv`, the class IDs in the CSVs map to the following intended signs:

### `keypoint_3.csv` (Classes 0-3)
- **ID 0:** Label `0`
- **ID 1:** Label `1`
- **ID 2:** Label `2`
- **ID 3:** Label `3`

### `keypoint.csv` (Classes 4-9)
- **ID 4:** Label `4`
- **ID 5:** Label `7`
- **ID 6:** Label `8`
- **ID 7:** Label `9`
- **ID 8:** Label `hello`
- **ID 9:** Label `sorry`

*Note: The IDs in the CSV (4, 5, 6, 7) map directly to indices in the label file, which oddly list labels '4', '7', '8', '9'. This indicates the original authors were likely experimenting with arbitrary keyboard mappings.*

**Status: VERIFIED**

---

## 5. Feature Schema

- **Columns:** 43 (1 Class ID + 42 features)
- **Feature Type:** Float values representing (x, y) coordinates for 21 MediaPipe landmarks.
- **Normalization:** 
  - Values range exactly between `-1.0000` and `1.0000`.
  - This confirms the coordinates have been shifted relative to the wrist (landmark 0) and scaled by the maximum absolute coordinate value.
- **Dimensionality:** `[N, 42]` representing **single static frames**, not temporal sequences.

**Status: VERIFIED**

---

## 6. Preprocessing

The preprocessing used to generate these features is confirmed by inspecting `app.py`:
1. MediaPipe extracts 21 pixel coordinates.
2. `pre_process_landmark()` converts to relative coordinates (subtracting wrist).
3. 1D max absolute scaling is applied.
4. `logging_csv()` appends the 42 floats to the CSV based on a keyboard press (0-9).

**Status: VERIFIED**

---

## 7. Provenance Investigation

- **Origin:** The dataset was **created by the repository authors** (likely Team "Byte Busters").
- **Evidence:** The `app.py` script contains a `logging_csv` function that activates when the user presses keyboard keys `0-9`. It directly appends rows to `keypoint.csv`.
- **Kaggle/External Source:** A full repository regex search for `kaggle`, `dataset`, `download`, and `source` revealed **zero** external dataset origins for the CSV files.

**Status: VERIFIED**

---

## 8. License Investigation

- **License Name:** NONE
- **License URL/Source:** NOT FOUND
- **Commercial Use:** UNKNOWN (Implicitly Denied)
- **Modification Allowed:** UNKNOWN (Implicitly Denied)
- **Redistribution Allowed:** UNKNOWN (Implicitly Denied)

Because there is no open-source license provided anywhere in the repository, standard copyright law applies: all rights are reserved by the original authors.

**Status: VERIFIED** (Absence of license verified).

---

## 9. Git History Findings

- **Introduction:** Both CSVs were added in a single bulk commit (`aba386f7`: "Added ISL to Text COde") on Jan 4, 2026.
- **Commit Messages:** No commit messages mention any data source, Kaggle, or methodology.
- **Conclusion:** The files were generated locally by the authors and then committed in bulk.

**Status: VERIFIED**

---

## 10. Duplicate Analysis

- **Duplicates within `keypoint.csv`:** 0
- **Duplicates within `keypoint_3.csv`:** 0
- **Overlap between files:** 0 exact matching rows.
- **Conclusion:** The two files represent two distinct recording sessions capturing different target classes (0-3 vs 4-9).

**Status: VERIFIED**

---

## 11. Dataset Quality

- **Format Limitations:** These are single-frame static captures. They do not contain temporal sequences (frame N, N+1, N+2).
- **Suitability for Phase 3:** As established in our Phase 3 design, 8 of our 10 MVP signs are **dynamic**. Single-frame static coordinates are technically useless for training our 1D CNN sequence model.
- **Signer Diversity:** UNKNOWN. There is no metadata indicating whether this was recorded by 1 person or multiple people. Given the methodology (`app.py` keyboard logging), it is highly likely it was a single developer at their desk.

**Status: VERIFIED**

---

## 12. Reuse Classification

**Classification:** **E. NOT PERMITTED**
**Alternative:** **C. RESEARCH/REFERENCE ONLY**

**Evidence:**
1. **Legal:** No license exists. We cannot legally reuse or redistribute this data in our own product.
2. **Technical:** The data format (single-frame) is incompatible with our required architecture (temporal sequence).

---

## 13. Frankenstein Dataset Feasibility

**Could we combine `keypoint.csv` + `keypoint_3.csv` + our own data?**
- **Technically:** No. The existing datasets are single-frame CSVs. Our new data collection tool must capture temporal sequences (JSON/CSV of shape `[Sequence_Length, 42]`). The shapes are fundamentally incompatible.
- **Legally:** No. Merging unlicensed data into our clean dataset would taint our dataset with uncleared copyright material.

**Status: VERIFIED** (Infeasible).

---

## 14. Option A/B/C Comparison

| Strategy | Legal Clarity | Dev Speed | Model Quality | Feasibility |
|----------|---------------|-----------|---------------|-------------|
| **Option A (Existing Only)** | FAIL (Unlicensed) | Fast | FAIL (Static only) | Impossible (Cannot learn dynamic signs) |
| **Option B (Frankenstein)** | FAIL (Tainted IP) | Medium | FAIL (Format mismatch) | Impossible (Sequence vs Static mismatch) |
| **Option C (New Custom Data)** | **PASS (Our IP)** | Slower | **PASS (Temporal)** | **Optimal** |

---

## 15. Recommended Strategy

**Execute Option C (Our Own Dataset Only).**

Do not attempt to merge, reuse, or train on `keypoint.csv` or `keypoint_3.csv`. They are legally unlicensed and technically incompatible with our dynamic gesture requirements. We will build our custom temporal dataset exactly as planned in Phase 3.

---

## 16. Remaining Unknowns

- Exactly who recorded the original CSVs (though it's inferred to be the repository authors).
- The exact hardware/camera used for the original recordings.

*(These unknowns do not impact our strategy, as we are abandoning the dataset.)*

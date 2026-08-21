# Static Cross-Source Validation Plan

## Purpose

Determine whether the 99.8% test accuracy represents real generalization or dataset-specific memorization by testing cross-source performance.

## Current Split

```
27,919 total samples → random 70/15/15 split
Train: 19,543 | Val: 4,188 | Test: 4,188
```

Both Atharv and Maitree samples are randomly mixed across all splits.

## Proposed Cross-Source Experiments

### Experiment 1: Train Atharv → Test Maitree
- **Train on**: All Atharv data (digit_0–digit_4, digit_7–digit_9, hello, sorry)
- **Test on**: All Maitree data (A, B, C)
- **Problem**: No class overlap — Atharv has no A/B/C, Maitree has no digits/hello/sorry
- **Conclusion**: This experiment is **not feasible** because the sources cover completely different classes

### Experiment 2: Within-Source Frame Correlation
- **Method**: For each source, group samples into pseudo-sessions by measuring pairwise cosine similarity
- **Hypothesis**: Samples with cosine similarity > 0.99 are likely consecutive frames from the same recording
- **Expected finding**: Many near-duplicate clusters exist, inflating random-split accuracy

### Experiment 3: Leave-K%-Contiguous-Out Split
- **Method**: Sort samples by class, then within each class identify clusters of near-identical samples (cosine similarity > 0.95). Assign entire clusters to either train or test, never splitting a cluster.
- **Expected result**: Accuracy will drop from 99.8% — the magnitude of the drop indicates how much dataset leakage inflated the original number

### Experiment 4: Live Webcam vs Offline Test
- **Method**: Capture 50 live frames per class using the flipped preprocessing, run inference, compare accuracy to offline test accuracy
- **This is the definitive experiment**

## Class Coverage by Source

| Source | Classes |
|--------|---------|
| Atharv keypoint.csv | digit_4, digit_7, digit_8, digit_9, hello, sorry |
| Atharv keypoint_3.csv | digit_0, digit_1, digit_2, digit_3 |
| Maitree keypoint.csv | A, B, C |

Since there is **zero class overlap** between Atharv and Maitree, traditional cross-source validation (train on source A, test on source B with the same classes) is impossible without collecting new data that covers the same classes from a different signer.

## Recommended Validation Strategy

1. **Fix the mirroring issue first** (use flipped preprocessing)
2. **Run live webcam tests** with the flipped preprocessing on the existing static_v1 model
3. **If live accuracy is still poor after the flip fix**, then investigate dataset leakage and retrain with cluster-aware splits
4. **If live accuracy becomes acceptable after the flip fix**, the mirroring was the dominant problem and the dataset quality is adequate for MVP

## Near-Duplicate Detection Script (To Be Created)

```python
# Pseudocode for detecting dataset leakage
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
X = load_csv("static_dataset.csv")[:, 1:]  # 42 features

# Compute pairwise similarity within each class
for class_id in range(13):
    class_samples = X[labels == class_id]
    sim_matrix = cosine_similarity(class_samples)
    
    # Count pairs with similarity > 0.99
    near_dupes = (sim_matrix > 0.99).sum() - len(class_samples)  # exclude self
    print(f"Class {class_id}: {near_dupes} near-duplicate pairs")
```

This will quantify the leakage risk without modifying the model.

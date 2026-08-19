# Dataset Split & Evaluation Plan

## 1. Data Split Strategy

### Signer-Independent Splitting [PROPOSED]

To measure real-world generalization, we split by **signer identity**, not by random sample:

| Split | Purpose | Signers | Approx. % of Data |
|-------|---------|---------|-------------------|
| Training | Model learning | Signers A, B, C | ~60% |
| Validation | Hyperparameter tuning, early stopping | Signer D (or subset of A/B/C) | ~20% |
| Test | Final evaluation (never used for tuning) | Signer E (unseen) | ~20% |

### Minimum Configuration (3 signers)

If only 3 signers are available:
- **Training:** Signers A, B (leave-one-out cross-validation)
- **Test:** Signer C (rotate so each signer serves as test once)
- **Validation:** 20% random split from training signers' data

### Leakage Prevention Rules
1. A signer's samples must NEVER appear in both training and test sets
2. If signer-independent splitting is not possible, document this clearly as a limitation
3. Temporal ordering within a signer's session should not leak: do not split mid-sequence

## 2. Evaluation Metrics

### Per-Class Metrics
For each of the 10 MVP signs:
- **Precision:** Of all predictions for this class, what fraction were correct?
- **Recall:** Of all actual instances of this class, what fraction were detected?
- **F1 Score:** Harmonic mean of precision and recall

### Overall Metrics
- **Overall Accuracy:** Total correct predictions / total predictions
- **Macro-Average F1:** Unweighted mean of per-class F1 scores
- **Weighted-Average F1:** Mean of per-class F1 weighted by class support
- **Confusion Matrix:** 10×10 matrix showing all misclassification patterns

### Inference Performance Metrics
- **Model loading time** (ms): Time from `tf.loadLayersModel()` to model ready
- **Inference latency** (ms): Time for a single `model.predict()` call
- **End-to-end latency** (ms): Time from landmark extraction to displayed prediction
- **Frames per second** (FPS): Sustained FPS during live recognition
- **Memory usage** (MB): Browser tab memory with model loaded

### What We Do NOT Define Yet
- Target accuracy numbers (these should be measured, not assumed)
- Minimum acceptable thresholds (to be set after baseline measurement)

## 3. Evaluation Protocol

### Step 1: Baseline Measurement
1. Train the baseline model on training split
2. Run inference on validation split
3. Record all metrics above
4. Generate confusion matrix
5. Identify worst-performing classes

### Step 2: Signer-Independent Test
1. Run the trained model on the held-out test signer
2. Compare test accuracy vs. validation accuracy
3. A large gap indicates poor generalization

### Step 3: Per-Class Analysis
1. For each class with F1 < macro-average:
   - Inspect confusion matrix for common misclassifications
   - Determine if more training data, better preprocessing, or architecture changes are needed

### Step 4: Cross-Validation (if signers ≤ 3)
1. Perform leave-one-signer-out cross-validation
2. Report mean and standard deviation of accuracy across folds

## 4. Reporting Template

All evaluation results will be documented in:
`docs/EVALUATION_RESULTS.md` (to be created after training)

Using this structure:
```
## Experiment: [Name]
- Date: [Date]
- Model: [Architecture]
- Training data: [N samples, K signers]
- Test data: [N samples, K signers]
- Results:
  - Overall Accuracy: X%
  - Macro F1: X
  - Confusion Matrix: [embedded]
  - Inference Latency: X ms
```

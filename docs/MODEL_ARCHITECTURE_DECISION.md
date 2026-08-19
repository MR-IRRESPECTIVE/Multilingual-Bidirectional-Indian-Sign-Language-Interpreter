# Model Architecture Decision

## 1. Problem Statement

We need to classify 10 ISL signs from MediaPipe hand landmarks in real-time in a web browser. Some signs may be static (single-frame) while others may be dynamic (require temporal information).

## 2. Candidate Architectures

### Option A: Small MLP (Multi-Layer Perceptron)
- **Input:** Single frame of 42 normalized landmark features (21 × 2)
- **Architecture:** Input(42) → Dense(128, relu) → Dropout(0.3) → Dense(64, relu) → Dense(10, softmax)
- **Suitable for:** Static signs only
- **Pros:**
  - Extremely fast inference (< 1ms)
  - Tiny model size (< 100KB)
  - Simple to train (requires hundreds, not thousands of samples)
  - Perfect browser compatibility via TensorFlow.js
  - Well-understood, easy to debug
- **Cons:**
  - Cannot capture temporal dynamics
  - Relies entirely on single-frame hand pose
  - Signs that look similar in a single frame will be confused
- **Training data needed [PROPOSED]:** ~200-500 samples per class minimum
- **Status:** PROPOSED as baseline

### Option B: LSTM/GRU (Recurrent Neural Network)
- **Input:** Sequence of N frames, each with 42 features → shape [N, 42]
- **Architecture:** Input(N, 42) → LSTM(64) → Dense(32, relu) → Dense(10, softmax)
- **Suitable for:** Dynamic signs requiring temporal trajectory
- **Pros:**
  - Captures movement patterns over time
  - Can distinguish signs that look similar in a single frame but differ in motion
- **Cons:**
  - Requires sequence-aligned training data (fixed-length or padded)
  - Slower inference (~5-20ms per sequence)
  - Larger model size (~500KB-2MB)
  - More complex data collection (must capture sequences, not single frames)
  - TensorFlow.js supports LSTM layers but performance varies by device
- **Training data needed [PROPOSED]:** ~300-800 sequences per class minimum
- **Status:** PROPOSED for dynamic signs if needed

### Option C: Hybrid (Static MLP + Temporal RNN)
- **Architecture:** Two separate models:
  1. Static MLP for single-frame classification
  2. LSTM/GRU for temporal classification
  3. Router logic decides which model to use based on hand movement magnitude
- **Pros:**
  - Best of both worlds
  - Static signs get fast inference, dynamic signs get temporal modeling
- **Cons:**
  - Double the implementation complexity
  - Two models to maintain, train, and serve
  - Router logic adds engineering complexity
- **Status:** PROPOSED only if MVP sign analysis confirms a mix of static and dynamic signs

### Option D: 1D CNN on Temporal Sequence
- **Input:** Sequence of N frames, each with 42 features → shape [N, 42]
- **Architecture:** Input(N, 42) → Conv1D(32, kernel=3) → Conv1D(64, kernel=3) → GlobalAvgPool → Dense(10, softmax)
- **Pros:**
  - Faster than LSTM for fixed-length sequences
  - Good at capturing local temporal patterns
  - Excellent TensorFlow.js support
- **Cons:**
  - Less effective than LSTM for long-range temporal dependencies
  - Requires fixed sequence length
- **Status:** PROPOSED as alternative to LSTM if temporal modeling is needed

## 3. Comparison Matrix

| Criteria | MLP | LSTM | Hybrid | 1D CNN |
|----------|-----|------|--------|--------|
| Static sign accuracy | High | Medium | High | Medium |
| Dynamic sign accuracy | None | High | High | Medium-High |
| Inference latency | < 1ms | 5-20ms | 1-20ms | 2-10ms |
| Model size | < 100KB | 500KB-2MB | 600KB-2MB | 200KB-1MB |
| Browser compatibility | Excellent | Good | Good | Excellent |
| Implementation complexity | Low | Medium | High | Medium |
| Data collection complexity | Low | Medium | High | Medium |
| Training data requirement | Low | Medium | High | Medium |

## 4. Recommendation [PROPOSED]

### Phase 3 Baseline: Option D (1D CNN on Temporal Sequence)

**Rationale:**
1. Our research (see `docs/ISL_MVP_SIGN_SPECIFICATION.md`) reveals that **8 out of 10** of our MVP signs are strictly **dynamic** (requiring temporal motion like waving, nodding the wrist, or sweeping outward from the chin).
2. Option A (Small MLP on a single frame) is physically incapable of distinguishing these signs (e.g., "Hello" vs resting open hand; "Yes" vs static fist).
3. Option D (1D CNN) is chosen over LSTM because it typically executes much faster in TensorFlow.js in the browser while still capturing the local temporal trajectories (like a hand sweep or wrist nod) perfectly. 
4. We will capture a fixed-length rolling window (e.g., 30 frames ≈ 1 second of motion) to feed into the 1D CNN.

### Future Extension: Option C (Hybrid)
If inference on static signs like "Namaste" proves unstable using a 30-frame window, we will introduce a two-path hybrid model (Option C) where static frame analysis acts as a fast-path for non-moving gestures.

## 5. Feature Representation Decision [PROPOSED]

### Recommended: 21 landmarks × (x, y) = 42 features, normalized

**Normalization procedure (verified from research audit):**
1. Extract 21 MediaPipe hand landmarks
2. Convert to pixel coordinates
3. Subtract wrist (landmark 0) position to get relative coordinates
4. Flatten to 42 values: [x0, y0, x1, y1, ..., x20, y20]
5. Divide all values by the maximum absolute value

### Why not include z-coordinate?
- MediaPipe's z-estimate for hands is approximate and noisy
- Adding z increases feature dimensionality by 50% (42 → 63)
- For our 10 MVP signs, (x, y) relative positions should be discriminative enough
- z can be added later if depth information proves useful

### Why not raw pixel coordinates?
- Raw coordinates are resolution-dependent and not invariant to hand position in frame
- Relative + normalized coordinates are position/scale invariant
- This is the same approach used in the verified research audit preprocessing

## 6. Browser Inference Architecture [PROPOSED]

```
Camera → MediaPipe Hands JS → 21 landmarks
    → Preprocessing (normalize to 42 features)
    → tf.tensor2d([features], [1, 42])
    → model.predict() via @tensorflow/tfjs
    → 10-class softmax probabilities
    → Confidence threshold (> 0.5)
    → 5-frame majority vote stabilization
    → Display prediction
```

- No backend inference required
- No TFLite WASM required
- Model loaded once at page initialization
- Inference runs on every frame where a hand is detected

# Data Collection Specification

## 1. Overview

This document specifies the protocol for collecting our custom ISL gesture dataset. The dataset is collected by our team under controlled conditions with proper consent.

## 2. Collection Tool Design [PROPOSED]

### Purpose
A browser-based internal tool that allows team members to record ISL gesture data as MediaPipe landmark sequences.

### User Interface

```
┌─────────────────────────────────────────────────────┐
│  ISL Data Collection Tool                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Signer ID:  [ signer_A ▼ ]                         │
│  Target Sign: [ Namaste  ▼ ]                        │
│                                                     │
│  ┌─────────────────────────────────┐                │
│  │                                 │                │
│  │       [Camera Feed]             │                │
│  │   (MediaPipe overlay visible)   │                │
│  │                                 │                │
│  └─────────────────────────────────┘                │
│                                                     │
│  Status: Ready                                      │
│  Hand Detected: ✓ / ✗                               │
│  Frames Captured: 0                                 │
│                                                     │
│  [ ● Start Recording ]  [ ■ Stop ]  [ ✓ Save ]     │
│                                                     │
│  Samples collected this session:                    │
│    Namaste: 12 samples                              │
│    Hello: 8 samples                                 │
│    Yes: 15 samples                                  │
│                                                     │
│  Session Notes: [_________________________]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Workflow
1. Signer selects their anonymized ID from the dropdown
2. Signer selects the target sign from the dropdown
3. Tool displays: "Perform the sign: [NAME]"
4. Signer clicks "Start Recording"
5. MediaPipe extracts hand landmarks each frame
6. Landmarks are buffered (all frames from start to stop)
7. Signer clicks "Stop Recording"
8. Tool shows preview: frame count, duration, landmark quality
9. Signer clicks "Save" to store, or "Discard" to retry
10. Sample is appended to the session file with metadata

### What Is Captured Per Sample
```json
{
  "sample_id": "namaste_signerA_001",
  "class": "namaste",
  "class_id": 4,
  "signer_id": "signer_A",
  "timestamp": "2026-08-20T10:30:00Z",
  "num_frames": 30,
  "recording_conditions": {
    "device": "laptop_webcam",
    "lighting": "indoor_natural",
    "background": "plain_wall"
  },
  "frames": [
    {
      "frame_idx": 0,
      "landmarks": [
        [0.0, 0.0], [0.12, -0.34], ...  // 21 × 2 normalized
      ]
    },
    ...
  ]
}
```

### For Static Signs
- The tool captures a **burst of ~30 frames** (1 second at 30fps)
- Each frame becomes an independent training sample
- This naturally provides slight variation (hand micro-movements)

### For Dynamic Signs
- The tool captures the **entire sequence** from start to stop
- The sequence is stored as a single training sample
- Sequence length varies per sample (normalized during preprocessing)

## 3. Recording Protocol

### Environment Requirements
- Indoor location with reasonable lighting
- Plain or uncluttered background preferred (not required)
- Webcam resolution: minimum 640×480
- Signer positioned 50-100cm from camera
- Hand(s) clearly visible and not occluded

### Per-Sign Recording Procedure
1. Review reference material for the sign (see ISL_MVP_SIGN_SPECIFICATION.md)
2. Practice the sign 2-3 times before recording
3. Record 20-30 samples per sign per session
4. Vary hand position slightly between samples (center, left, right of frame)
5. Vary hand orientation slightly (natural variation)
6. Include both dominant and non-dominant hand recordings if applicable

### Quality Checks
- MediaPipe must detect a hand in ≥80% of frames for a sample to be valid
- Landmark confidence score must be ≥0.7 (MediaPipe's built-in metric)
- Samples where the hand leaves the frame mid-recording should be discarded

## 4. Recommended Sample Counts [PROPOSED]

### Per Sign Per Signer
| Sign Type | Minimum Samples | Target Samples | Justification |
|-----------|----------------|----------------|---------------|
| Static | 100 | 200 | Each frame is an independent sample; 30-frame bursts yield ~3-7 captures needed |
| Dynamic | 50 | 100 | Each sequence is one sample; requires more recording effort |

### Total Dataset Size (assuming 5 signers, 10 static signs)
- Minimum: 5 signers × 10 signs × 100 samples = 5,000 samples
- Target: 5 signers × 10 signs × 200 samples = 10,000 samples

### With 3 Signers (minimum viable)
- Minimum: 3 × 10 × 100 = 3,000 samples
- Target: 3 × 10 × 200 = 6,000 samples

## 5. Export Format [PROPOSED]

### Option A: CSV (for static MLP)
```csv
class_id,x0,y0,x1,y1,...,x20,y20
4,0.0,0.0,-0.12,0.34,...
```
- One row per frame
- Compatible with the reference repository's format
- Simple, fast to load with numpy

### Option B: JSON Lines (for temporal models)
```jsonl
{"class":"namaste","class_id":4,"signer":"A","frames":[[0.0,0.0,-0.12,...],[...],...]}
```
- One line per sequence
- Preserves temporal ordering
- Larger file size but more flexible

### Recommendation [PROPOSED]
- Use CSV for the MLP baseline (one row per frame)
- Maintain JSON metadata files alongside the CSV for traceability
- Store signer ID in a separate manifest file (not in the CSV) for privacy

## 6. Dataset Directory Structure [PROPOSED]

```
data/
├── raw/                          # Raw landmark recordings
│   ├── signer_A/
│   │   ├── namaste/
│   │   │   ├── sample_001.json
│   │   │   └── sample_002.json
│   │   └── hello/
│   │       └── ...
│   └── signer_B/
│       └── ...
├── processed/                    # Flattened training-ready data
│   ├── keypoints_train.csv
│   ├── keypoints_val.csv
│   └── keypoints_test.csv
├── splits/                       # Split manifests
│   └── signer_split.json         # Which signers in which split
├── labels.csv                    # class_id → sign_name mapping
└── README.md                     # Dataset description and statistics
```

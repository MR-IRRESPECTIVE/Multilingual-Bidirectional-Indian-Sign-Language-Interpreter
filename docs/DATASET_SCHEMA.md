# Custom ISL Dataset Schema

## 1. Overview
This document defines the exact schema for the exported custom MVP dataset. The dataset is exported in JSON format to seamlessly preserve the temporal sequence dimension and associated metadata.

## 2. JSON Schema Definition (Version 1.0)

```json
{
  "dataset_version": "1.0",
  "sample_id": "hello_signer_A_1724032123456",
  "signer_id": "signer_A",
  "sign_class": 8,
  "sign_label": "Hello",
  "capture_timestamp": "2026-08-19T01:50:00Z",
  "frame_count": 30,
  "feature_dimension": 42,
  "frames": [
    [0.0, 0.0, 0.12, -0.05, ...],  // Frame 1 (42 values)
    [0.0, 0.0, 0.13, -0.04, ...],  // Frame 2 (42 values)
    ...
  ]
}
```

## 3. Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `dataset_version` | String | Schema version, currently "1.0". |
| `sample_id` | String | Unique identifier: `{sign_label}_{signer_id}_{epoch_ms}`. |
| `signer_id` | String | Anonymized identifier for the human signer (e.g., `signer_A`). |
| `sign_class` | Integer | The integer target class ID (0-9). |
| `sign_label` | String | The human-readable ISL sign name (e.g., "Namaste"). |
| `capture_timestamp` | String | ISO 8601 timestamp of when the recording started. |
| `frame_count` | Integer | Total number of valid frames captured in this sequence. |
| `feature_dimension` | Integer | Total features per frame (must be 42). |
| `frames` | Array[Array[Float]] | A list of frames. Each frame is a flat list of 42 normalized feature coordinates. |

## 4. Preprocessing [PROPOSED]

The 42 features per frame are generated as follows:
1. MediaPipe extracts 21 hand landmarks `(x, y)` relative to the frame width and height.
2. The wrist landmark (Landmark 0) acts as the origin point.
3. Every landmark's coordinates are transformed to be relative to the wrist `(relative_x = raw_x - wrist_x)`.
4. The maximum absolute coordinate value across the entire hand is found.
5. All relative coordinates are divided by this maximum absolute value to scale them tightly between `-1.0` and `1.0`.
6. The resulting list is flattened: `[x0, y0, x1, y1, ... x20, y20]`.

*Note: This matches the geometric abstraction of the repository's original model, but is implemented entirely from scratch in our custom collection tool.*

## 5. Validity Requirements

A sequence is marked INVALID and will not be saved if:
- Any feature value is `NaN` or `Infinity`.
- A frame does not contain exactly 42 floats.
- The `frame_count` does not match the expected temporal window (default 30 frames).

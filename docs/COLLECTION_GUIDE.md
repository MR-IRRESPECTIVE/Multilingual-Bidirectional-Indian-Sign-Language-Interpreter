# ISL Data Collection Guide — Multi-Computer Setup

**Audience**: Teammates collecting ISL sign data using the web application.

---

## 1. Architecture Overview

This system is designed for **privacy-first, fully offline, multi-computer data collection**.

| Component | What it is | Who owns it |
|-----------|-----------|-------------|
| **GitHub repository** | Application code (Next.js app) | Shared — identical clone on every computer |
| **Browser IndexedDB** | Your local collection database | Private — lives only in your browser |
| **Exported JSON file** | Your portable dataset | You collect it, then send to the coordinator |
| **signer_id** | Your globally unique identity | Generated once, stored in your browser |

**The key insight**: The repository is just code. Your data never leaves your computer until you explicitly export it and send the JSON file.

---

## 2. Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd frontend
npm install
npm run dev

# Open in your browser
http://localhost:3000/collection
```

---

## 3. Signer Identity — How It Works

### Why we use UUIDs

When multiple computers independently collect data, sequential IDs like `signer_001` collide:

```
Computer A: Rohan   → signer_005   ← SAME ID, different person!
Computer B: Amit    → signer_005   ← collision
```

After merging their JSON files, the system would wrongly treat Rohan and Amit as the same signer.

### The solution: crypto.randomUUID()

Every new signer you create gets a **cryptographically strong globally unique ID**:

```
Computer A: Rohan → signer_550e8400-e29b-41d4-a716-446655440001
Computer B: Amit  → signer_7c9e6679-7425-40de-944b-e07fc1f90ae7
```

These IDs are mathematically guaranteed to never collide across any number of computers.

### What this means for you

- **Adding a new signer**: Click "+ Add New Signer", type the display name. A UUID is generated automatically. You never need to choose or type an ID.
- **Same display name, different computers**: Fine! "Rohan" on Computer A and "Rohan" on Computer B will get different IDs.
- **Browser restart**: Your signer list is saved in `localStorage`. Restarting the browser keeps the same signers and IDs.
- **Git pull / code update**: Does not affect your local signer data or collected samples.

### Legacy IDs (signer_A, signer_005, etc.)

The original pilot signers have legacy IDs. **These are preserved exactly** and never migrated to UUID format. Do not rename or re-create them.

---

## 4. Data Collection Workflow

### Step 1 — Select your signer
From the "Signer Identity" dropdown, select yourself. If you are not listed, click "+ Add New Signer".

### Step 2 — Select the target sign
Choose the sign you are about to perform from the "Target Sign" dropdown.

**Check the Hand Mode label:**
- `☝️ One-handed` — perform with one hand as normal
- `✌️ Two-handed (Ratio)` — **Sequence validated: aim to keep both hands visible** (see Namaste section)

### Step 3 — Position your hands and start recording
Click **● Start Recording**. The camera will begin capturing frames.

### Step 4 — Perform the sign
Perform the sign naturally. A progress bar shows how many of the required 30 frames have been captured.

### Step 5 — Auto-stop at 30 frames
Recording stops automatically when 30 valid frames are collected. You do not need to click Stop.

### Step 6 — Save or discard
- Click **✓ Save** to save to your local IndexedDB
- Click **Discard** to throw away and try again

### Step 7 — Export when done
Click **Export Dataset (JSON)** to download a `.json` file containing all your collected samples. Send this file to the coordinator.

---

## 5. Namaste — Two-Hand Ratio Mode

### How Namaste collection differs

Namaste is configured as a **two-handed sign**. However, because bringing palms fully together can confuse the camera into thinking there is only one hand, the tool uses a **Sequence-Level Ratio Policy**.

For every frame recorded:
- The system captures all frames where *at least one hand* is detected.
- If one hand drops out momentarily (due to occlusion), the frame is still recorded. The missing hand is simply zero-padded.
- A yellow warning banner appears: **"⚠️ Try to keep both hands visible"**. This is a live indicator to adjust your posture.

**At the end of the 30-frame sequence**, the tool evaluates the whole clip:
- If **at least 80%** (24 out of 30) of the frames have BOTH hands detected, the sequence is accepted and ready to save.
- If the ratio is **below 80%**, the sequence is discarded, a red "Recording Failed" message appears, and you must record the sign again.

**Recommended strategy**:
1. Start with hands slightly separated so MediaPipe can detect both.
2. Slowly bring them together. If they get too close and the system loses one hand (the yellow warning appears), hold that position or slightly separate them so the overall sequence stays above the 80% requirement.
3. A consistent, partially-separated posture is a valid and reproducible representation of the sign.

---

## 6. Camera and Handedness

The camera preview shows your hands **as MediaPipe sees them**. MediaPipe's handedness labels ("Left", "Right") correctly reflect **your actual left and right hands**, not the mirror image.

Internally:
- Left hand features occupy positions `[0..41]` in the 86-feature vector
- Right hand features occupy positions `[42..83]`
- Positions `[84]` and `[85]` are presence flags (1.0 = detected, 0.0 = absent)

This layout is consistent regardless of which direction the array from MediaPipe happens to be in.

---

## 7. Dataset Generations — DO NOT MIX

There are two incompatible dataset generations:

| Generation | Feature dim | Signs | Feature layout | Status |
|-----------|-------------|-------|----------------|--------|
| **Legacy (v1)** | 42 features | Hello, Yes | `[left_x0, left_y0, ... left_x20, left_y20]` | Frozen — do not modify |
| **New (v2-86)** | 86 features | All new signs incl. Namaste | `[left_42, right_42, left_present, right_present]` | Active collection |

**Rule**: Do not combine 42-feature and 86-feature samples in the same training dataset. The merge validation utility will detect and flag this automatically.

---

## 8. Merging Datasets from Multiple Computers

When the coordinator receives JSON files from multiple teammates, they should run:

```javascript
// In Node.js or browser console
const { validateMerge } = require("./src/utils/mergeValidator");

const datasetRohan = JSON.parse(fs.readFileSync("rohan_export.json"));
const datasetAmit  = JSON.parse(fs.readFileSync("amit_export.json"));

const report = validateMerge([datasetRohan, datasetAmit]);

if (!report.isClean) {
  console.error("Issues found before merge:", report);
} else {
  console.log(`Clean merge: ${report.totalSamples} total samples`);
}
```

The report flags:
- **`signerConflicts`**: same `signer_id` used for different display names (legacy collision)
- **`generationMixWarning`**: 42-feature and 86-feature samples combined (must not train together)
- **`duplicateSampleIds`**: same recording exported more than once

---

## 9. Privacy Guarantees

- No video is ever saved or transmitted
- Only 21 hand landmark coordinates per frame are processed
- All data stays in your browser's IndexedDB until you explicitly export it
- The export is a plain JSON file — you control who receives it
- The server (Next.js dev server) has no access to your collected data

---

## 10. Troubleshooting

| Problem | Solution |
|---------|----------|
| Camera not starting | Allow camera permission in browser; refresh the page |
| "Recording Failed" error on Namaste | Separate hands slightly so both are visible to camera |
| Signer not persisting after browser restart | Check that localStorage is not cleared on exit (private/incognito mode clears it) |
| Save button greyed out | Need at least 15 frames in buffer |
| Export produces empty file | No samples in IndexedDB — collect and save first |

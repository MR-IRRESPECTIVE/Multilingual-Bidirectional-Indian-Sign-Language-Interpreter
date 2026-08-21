"""
ml/build_static_dataset.py
==========================
Merges Atharv and Maitree 42-feature datasets into a unified static training dataset.

SOURCE DATASETS (read-only, never modified):
  - scratch/reference/Bidirectional-Indian-Sign-Language-Translator/.../keypoint.csv
  - scratch/reference/Bidirectional-Indian-Sign-Language-Translator/.../keypoint_3.csv
  - scratch/reference/Indian-Sign-Language-Detection/keypoint.csv

OUTPUT:
  - datasets/static_training/static_dataset.csv
  - datasets/static_training/label_map.json
  - datasets/static_training/manifest.json
"""

import os
import json
import pandas as pd
import numpy as np

# ── Source paths (never modified) ────────────────────────────────────────────
ATHARV_KP = "scratch/reference/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint.csv"
ATHARV_KP3 = "scratch/reference/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_3.csv"
MAITREE_KP = "scratch/reference/Indian-Sign-Language-Detection/keypoint.csv"
ATHARV_LABELS = "scratch/reference/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier_label.csv"

# ── Output directory ──────────────────────────────────────────────────────────
OUT_DIR = "datasets/static_training"
os.makedirs(OUT_DIR, exist_ok=True)

# ── Load Atharv label mapping ─────────────────────────────────────────────────
atharv_labels = pd.read_csv(ATHARV_LABELS, header=None)[0].tolist()

def atharv_idx_to_label(cls_id):
    return atharv_labels[cls_id] if cls_id < len(atharv_labels) else f"unknown_{cls_id}"

# ── Canonical label map for merged dataset ────────────────────────────────────
# Each canonical label maps to a unified integer class ID
CANONICAL_LABELS = [
    "digit_0",   # 0
    "digit_1",   # 1
    "digit_2",   # 2
    "digit_3",   # 3
    "digit_4",   # 4
    "digit_7",   # 5
    "digit_8",   # 6
    "digit_9",   # 7
    "hello",     # 8
    "sorry",     # 9
    "A",         # 10
    "B",         # 11
    "C",         # 12
]

label_to_id = {lbl: i for i, lbl in enumerate(CANONICAL_LABELS)}

print("=" * 60)
print("Building Unified Static Training Dataset")
print("=" * 60)

# ── Load Atharv keypoint.csv ──────────────────────────────────────────────────
print("\n[1] Loading Atharv keypoint.csv ...")
df_kp = pd.read_csv(ATHARV_KP, header=None)
print(f"    Raw: {len(df_kp)} rows, {df_kp.shape[1]-1} features")

# Atharv class ID -> canonical label mapping
# class 4->'4'->digit_4, 5->'7'->digit_7, 6->'8'->digit_8, 7->'9'->digit_9, 8->hello, 9->sorry
atharv_kp_map = {4: "digit_4", 5: "digit_7", 6: "digit_8", 7: "digit_9", 8: "hello", 9: "sorry"}

rows_kp = []
for cls_id, group in df_kp.groupby(0):
    if cls_id in atharv_kp_map:
        canonical = atharv_kp_map[cls_id]
        new_id = label_to_id[canonical]
        features = group.iloc[:, 1:].values
        for row in features:
            rows_kp.append([new_id] + list(row))
        print(f"    Class {cls_id} ({atharv_labels[cls_id]!r} -> {canonical!r} -> id {new_id}): {len(group)} samples")

df_from_kp = pd.DataFrame(rows_kp)
print(f"    Loaded: {len(df_from_kp)} rows")

# ── Load Atharv keypoint_3.csv ────────────────────────────────────────────────
print("\n[2] Loading Atharv keypoint_3.csv ...")
df_kp3 = pd.read_csv(ATHARV_KP3, header=None)
print(f"    Raw: {len(df_kp3)} rows")

atharv_kp3_map = {0: "digit_0", 1: "digit_1", 2: "digit_2", 3: "digit_3"}
rows_kp3 = []
for cls_id, group in df_kp3.groupby(0):
    if cls_id in atharv_kp3_map:
        canonical = atharv_kp3_map[cls_id]
        new_id = label_to_id[canonical]
        features = group.iloc[:, 1:].values
        for row in features:
            rows_kp3.append([new_id] + list(row))
        print(f"    Class {cls_id} ({atharv_labels[cls_id]!r} -> {canonical!r} -> id {new_id}): {len(group)} samples")

df_from_kp3 = pd.DataFrame(rows_kp3)
print(f"    Loaded: {len(df_from_kp3)} rows")

# ── Load Maitree keypoint.csv ─────────────────────────────────────────────────
print("\n[3] Loading Maitree keypoint.csv ...")
df_m = pd.read_csv(MAITREE_KP, header=None)
print(f"    Raw: {len(df_m)} rows (includes duplicates)")

maitree_map = {"A": "A", "B": "B", "C": "C"}
rows_m = []
for cls_label, group in df_m.groupby(0):
    if cls_label in maitree_map:
        canonical = maitree_map[cls_label]
        new_id = label_to_id[canonical]
        features = group.iloc[:, 1:].values
        for row in features:
            rows_m.append([new_id] + list(row))
        print(f"    Class '{cls_label}' -> '{canonical}' -> id {new_id}: {len(group)} samples (pre-dedup)")

df_from_maitree = pd.DataFrame(rows_m)
print(f"    Loaded: {len(df_from_maitree)} rows (pre-dedup)")

# ── Merge all sources ─────────────────────────────────────────────────────────
print("\n[4] Merging datasets ...")
manifest = {
    "atharv_keypoint_csv": {"rows_before_dedup": len(df_from_kp), "rows_after_dedup": 0},
    "atharv_keypoint_3_csv": {"rows_before_dedup": len(df_from_kp3), "rows_after_dedup": 0},
    "maitree_keypoint_csv": {"rows_before_dedup": len(df_from_maitree), "rows_after_dedup": 0},
}

# Add source tracking column before concat
df_from_kp["_source"] = "atharv_kp"
df_from_kp3["_source"] = "atharv_kp3"
df_from_maitree["_source"] = "maitree_kp"

df_all = pd.concat([df_from_kp, df_from_kp3, df_from_maitree], ignore_index=True)
total_before_dedup = len(df_all)
print(f"    Total before dedup: {total_before_dedup}")

# Deduplicate on feature columns only (not source column, not class ID)
# Two rows are duplicates if they have the same class ID AND same features
feature_cols = list(range(1, 43))  # columns 1-42 are the 42 features
source_col = "_source"
class_col = 0

# Check exact feature duplicates within each class
df_features_only = df_all.drop(columns=[source_col])
dupes_mask = df_features_only.duplicated(keep="first")
n_dupes = dupes_mask.sum()
print(f"    Exact duplicates found: {n_dupes}")

df_deduped = df_all[~dupes_mask].copy()
total_after_dedup = len(df_deduped)
print(f"    Total after dedup: {total_after_dedup}")
print(f"    Removed: {n_dupes} exact duplicate rows")

# Update manifest
for src_name in ["atharv_kp", "atharv_kp3", "maitree_kp"]:
    kept = df_deduped[df_deduped["_source"] == src_name]
    key = {"atharv_kp": "atharv_keypoint_csv", "atharv_kp3": "atharv_keypoint_3_csv", "maitree_kp": "maitree_keypoint_csv"}[src_name]
    manifest[key]["rows_after_dedup"] = len(kept)

# ── Class distribution report ─────────────────────────────────────────────────
print("\n[5] Final class distribution:")
dist = {}
for cls_id, group in df_deduped.groupby(0):
    lbl = CANONICAL_LABELS[cls_id]
    cnt = len(group)
    dist[lbl] = cnt
    print(f"    {cls_id:2d} {lbl:15s}: {cnt:6d} samples")

print(f"\n    Total: {total_after_dedup} samples across {len(CANONICAL_LABELS)} classes")

# ── Feature dimension validation ──────────────────────────────────────────────
print("\n[6] Feature validation ...")
feat_cols = [c for c in df_deduped.columns if c != "_source"]
features_only = df_deduped[feat_cols].iloc[:, 1:]  # skip class column
assert features_only.shape[1] == 42, f"Expected 42 features, got {features_only.shape[1]}"
nan_count = features_only.isnull().sum().sum()
inf_count = np.isinf(features_only.values.astype(float)).sum()
print(f"    Feature columns: {features_only.shape[1]} (expected 42): OK")
print(f"    NaN values: {nan_count}")
print(f"    Inf values: {inf_count}")
if nan_count > 0 or inf_count > 0:
    print("    WARNING: Invalid values found! Removing ...")
    df_deduped = df_deduped.dropna()

# ── Save dataset ──────────────────────────────────────────────────────────────
print("\n[7] Saving ...")
df_save = df_deduped.drop(columns=["_source"])
out_csv = os.path.join(OUT_DIR, "static_dataset.csv")
df_save.to_csv(out_csv, index=False, header=False)
print(f"    Saved: {out_csv} ({len(df_save)} rows)")

label_map = {str(i): lbl for i, lbl in enumerate(CANONICAL_LABELS)}
with open(os.path.join(OUT_DIR, "label_map.json"), "w") as f:
    json.dump(label_map, f, indent=2)
print(f"    Saved: {OUT_DIR}/label_map.json")

manifest["total_samples"] = int(total_after_dedup)
manifest["total_classes"] = len(CANONICAL_LABELS)
manifest["class_distribution"] = {k: int(v) for k, v in dist.items()}
manifest["feature_dimension"] = 42
manifest["duplicate_rows_removed"] = int(n_dupes)
manifest["preprocessing"] = "wrist_relative_max_abs_normalized_xy_only_21landmarks"
manifest["source_repos"] = [
    "atharvsp189/Bidirectional-Indian-Sign-Language-Translator",
    "MaitreeVaria/Indian-Sign-Language-Detection"
]

# Ensure all manifest values are JSON-serializable
def _to_native(obj):
    if hasattr(obj, 'item'):
        return obj.item()
    return obj

def _clean_manifest(d):
    if isinstance(d, dict):
        return {k: _clean_manifest(v) for k, v in d.items()}
    if isinstance(d, list):
        return [_clean_manifest(v) for v in d]
    return _to_native(d)

with open(os.path.join(OUT_DIR, "manifest.json"), "w") as f:
    json.dump(_clean_manifest(manifest), f, indent=2)
print(f"    Saved: {OUT_DIR}/manifest.json")

print("\nDataset build complete.")

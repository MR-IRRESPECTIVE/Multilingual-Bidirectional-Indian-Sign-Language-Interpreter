"""
ml/train_static_model.py
========================
Trains a static 42-feature ANN classifier on the merged dataset.

Input:  datasets/static_training/static_dataset.csv
Output: backend/models/archive/static_v1/
            model.keras
            metadata.json
            label_map.json
"""

import os
import json
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# ── Config ────────────────────────────────────────────────────────────────────
DATASET = "datasets/static_training/static_dataset.csv"
LABEL_MAP = "datasets/static_training/label_map.json"
MANIFEST = "datasets/static_training/manifest.json"
OUT_DIR = "backend/models/archive/static_v1"
os.makedirs(OUT_DIR, exist_ok=True)

EPOCHS = 100
BATCH_SIZE = 64
PATIENCE = 10
VALIDATION_SPLIT = 0.15
TEST_SPLIT = 0.15
RANDOM_SEED = 42

# ── Load data ─────────────────────────────────────────────────────────────────
print("=" * 60)
print("Training Static ANN Classifier")
print("=" * 60)

with open(LABEL_MAP) as f:
    label_map = json.load(f)

num_classes = len(label_map)
print(f"Classes: {num_classes}")
for k, v in sorted(label_map.items(), key=lambda x: int(x[0])):
    print(f"  {k}: {v}")

df = pd.read_csv(DATASET, header=None)
print(f"\nDataset: {len(df)} rows, {df.shape[1]-1} features")

X = df.iloc[:, 1:].values.astype(np.float32)
y = df.iloc[:, 0].values.astype(np.int32)

# ── Split: train / val / test ─────────────────────────────────────────────────
# NOTE: signer IDs are not available in legacy datasets. This is a random split.
# We cannot claim signer-generalization performance from this split.
X_trainval, X_test, y_trainval, y_test = train_test_split(
    X, y, test_size=TEST_SPLIT, random_state=RANDOM_SEED, stratify=y
)
X_train, X_val, y_train, y_val = train_test_split(
    X_trainval, y_trainval,
    test_size=VALIDATION_SPLIT / (1.0 - TEST_SPLIT),
    random_state=RANDOM_SEED, stratify=y_trainval
)

print(f"\nSplit:")
print(f"  Train: {len(X_train)}")
print(f"  Val:   {len(X_val)}")
print(f"  Test:  {len(X_test)}")

# ── Class weights (handle imbalance) ──────────────────────────────────────────
from sklearn.utils.class_weight import compute_class_weight

class_weights_array = compute_class_weight(
    class_weight='balanced',
    classes=np.arange(num_classes),
    y=y_train
)
class_weight_dict = {i: w for i, w in enumerate(class_weights_array)}
print(f"\nClass weights (max ratio {max(class_weights_array)/min(class_weights_array):.2f}x):")
for i, w in class_weight_dict.items():
    print(f"  {label_map[str(i)]:15s}: {w:.3f}")

# ── Build model ───────────────────────────────────────────────────────────────
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(42,)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(num_classes, activation='softmax'),
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy'],
)

model.summary()

# ── Train ─────────────────────────────────────────────────────────────────────
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor='val_accuracy',
        patience=PATIENCE,
        restore_best_weights=True,
        verbose=1,
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=1e-6,
        verbose=1,
    ),
]

print("\nTraining ...")
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    class_weight=class_weight_dict,
    callbacks=callbacks,
    verbose=1,
)

# ── Evaluate on test set ─────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("Test Set Evaluation")
print("=" * 60)

test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Loss:     {test_loss:.4f}")
print(f"Test Accuracy: {test_acc:.4f} ({test_acc*100:.1f}%)")

y_pred = np.argmax(model.predict(X_test, verbose=0), axis=1)

class_names = [label_map[str(i)] for i in range(num_classes)]
report = classification_report(y_test, y_pred, target_names=class_names)
print("\nClassification Report:")
print(report)

cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:")
print(cm)

# ── Save model ────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("Saving Model")
print("=" * 60)

model_path = os.path.join(OUT_DIR, "model.keras")
model.save(model_path)
print(f"Saved: {model_path}")

# Save label_map.json
lm_path = os.path.join(OUT_DIR, "label_map.json")
with open(lm_path, "w") as f:
    json.dump(label_map, f, indent=2)
print(f"Saved: {lm_path}")

# Save metadata.json
best_epoch = callbacks[0].best_epoch if hasattr(callbacks[0], 'best_epoch') else len(history.history['loss'])
metadata = {
    "model_version": "static_v1",
    "feature_generation": "42-landmark-xy-wrist-normalized",
    "feature_dimension": 42,
    "class_count": num_classes,
    "class_labels": label_map,
    "architecture": "Dense_ANN",
    "layers": "BN-Dense(128)-Drop(0.3)-Dense(64)-Drop(0.3)-Softmax(13)",
    "training_samples": int(len(X_train)),
    "validation_samples": int(len(X_val)),
    "test_samples": int(len(X_test)),
    "test_accuracy": float(test_acc),
    "test_loss": float(test_loss),
    "epochs_trained": len(history.history['loss']),
    "confidence_threshold": 0.60,
    "signer_split": "random (signer IDs unavailable in legacy datasets)",
    "source_datasets": [
        "atharvsp189 keypoint.csv (classes 4,5,6,7,8,9)",
        "atharvsp189 keypoint_3.csv (classes 0,1,2,3)",
        "MaitreeVaria keypoint.csv (classes A,B,C)",
    ],
    "preprocessing": "wrist_relative_max_abs_normalized_xy_only_21landmarks",
    "per_class_metrics": {},
}

# Per-class F1
from sklearn.metrics import precision_recall_fscore_support
prec, rec, f1, support = precision_recall_fscore_support(y_test, y_pred)
for i in range(num_classes):
    metadata["per_class_metrics"][label_map[str(i)]] = {
        "precision": round(float(prec[i]), 4),
        "recall": round(float(rec[i]), 4),
        "f1": round(float(f1[i]), 4),
        "test_samples": int(support[i]),
    }

meta_path = os.path.join(OUT_DIR, "metadata.json")
with open(meta_path, "w") as f:
    json.dump(metadata, f, indent=2)
print(f"Saved: {meta_path}")

print("\nTraining complete.")
print(f"Test accuracy: {test_acc*100:.1f}%")

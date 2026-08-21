import os
import json
import numpy as np
import tensorflow as tf
from collections import Counter
from ml.preprocessing.split_utils import create_signer_aware_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

tf.keras.utils.set_random_seed(42)

CANONICAL_CLASSES = [
    "Hello",
    "Sorry",
    "Eat / Food",
    "Indian",
    "Namaste",
    "Thank You",
    "Love",
    "Good",
    "Yes",
    "No"
]
CLASS_MAP = {i: name for i, name in enumerate(CANONICAL_CLASSES)}
NAME_TO_CLASS = {name: i for i, name in enumerate(CANONICAL_CLASSES)}

def load_derived_dataset(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    if "dataset" in data:
        data = data["dataset"]
    return data

def build_model(input_shape, num_classes):
    inputs = tf.keras.Input(shape=input_shape)
    # Bidirectional LSTM baseline as requested
    x = tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64))(inputs)
    x = tf.keras.layers.Dropout(0.5)(x)
    x = tf.keras.layers.Dense(64, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)
    
    model = tf.keras.Model(inputs=inputs, outputs=outputs)
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def calculate_class_weights(y_train, num_classes):
    counter = Counter(y_train)
    total = sum(counter.values())
    class_weights = {}
    for i in range(num_classes):
        if counter[i] > 0:
            # typical balanced weight: total_samples / (num_classes * class_samples)
            # but we only count represented classes for the division factor
            represented_classes = len(counter)
            class_weights[i] = total / (represented_classes * counter[i])
        else:
            class_weights[i] = 1.0 # Default fallback
    return class_weights

def main():
    print("--- ISL Baseline Training Pipeline (V1) ---")
    
    derived_path = os.path.join("datasets", "training", "training_dataset.json")
    if not os.path.exists(derived_path):
        print(f"ERROR: Derived dataset not found at {derived_path}. Run prepare_training_dataset.py first.")
        return
        
    samples = load_derived_dataset(derived_path)
    print(f"Loaded {len(samples)} samples from derived dataset.")
    
    # Verify input shape
    valid_samples = []
    class_counts = Counter()
    signer_counts = Counter()
    
    for s in samples:
        frames = s.get("frames", [])
        if len(frames) != 30 or len(frames[0]) != 86:
            print("ERROR: Found sample with invalid shape in derived dataset. Stopping.")
            return
            
        label = s["sign_label"]
        if label not in NAME_TO_CLASS:
            print(f"WARNING: Unknown class '{label}' found. Skipping.")
            continue
            
        s["sign_class"] = NAME_TO_CLASS[label]
        valid_samples.append(s)
        class_counts[label] += 1
        signer_counts[s["signer_id"]] += 1
        
    print("\n--- DATASET DISTRIBUTION ---")
    print(f"Total unique usable samples: {len(valid_samples)}")
    print(f"Total signers: {len(signer_counts)}")
    print("\nSamples per class:")
    for name in CANONICAL_CLASSES:
        print(f"  {name}: {class_counts[name]}")
        
    if class_counts["Namaste"] == 0:
        print("NOTE: 'Namaste' has 0 samples.")
        
    print("\nSamples per signer:")
    for sid, count in signer_counts.most_common():
        print(f"  {sid}: {count}")

    if len(signer_counts) < 3:
        print("ERROR: Too few signers to create a proper disjoint train/val/test split without leaking signer data. Stopping.")
        # But wait, user said "If current number of signers makes a perfect split difficult, implement splitting utility but do not arbitrarily discard data. Document chosen strategy." 
        # Actually our split_utils.py warns and falls back to random splitting if < 4 signers.
        # But we have 9 signers!
        
    train_samples, val_samples, test_samples = create_signer_aware_split(valid_samples, val_ratio=0.15, test_ratio=0.15)
    
    def format_split(split_samples):
        X = np.array([s["frames"] for s in split_samples], dtype=np.float32)
        y = np.array([s["sign_class"] for s in split_samples], dtype=np.int32)
        return X, y
        
    X_train, y_train = format_split(train_samples)
    X_val, y_val = format_split(val_samples)
    X_test, y_test = format_split(test_samples)
    
    print("\n--- SPLIT SIZES ---")
    print(f"Train: {len(X_train)} samples")
    print(f"Val:   {len(X_val)} samples")
    print(f"Test:  {len(X_test)} samples")
    
    train_signers = set(s['signer_id'] for s in train_samples)
    val_signers = set(s['signer_id'] for s in val_samples)
    test_signers = set(s['signer_id'] for s in test_samples)
    print(f"\nTrain Signers: {train_signers}")
    print(f"Val Signers: {val_signers}")
    print(f"Test Signers: {test_signers}")
    
    # Calculate class weights
    class_weights = calculate_class_weights(y_train, len(CANONICAL_CLASSES))
    print(f"\nClass weights (calculated from Train split):")
    for i, w in class_weights.items():
        print(f"  {CLASS_MAP[i]}: {w:.4f}")

    num_classes = len(CANONICAL_CLASSES)
    input_shape = (30, 86)
    
    model = build_model(input_shape, num_classes)
    model.summary()
    
    out_dir = os.path.join("backend", "models", "archive", "baseline_v1")
    os.makedirs(out_dir, exist_ok=True)
    
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5),
        tf.keras.callbacks.ModelCheckpoint(filepath=os.path.join(out_dir, "model.keras"), monitor='val_loss', save_best_only=True)
    ]
    
    print("\n--- TRAINING ---")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=150,
        batch_size=16,
        class_weight=class_weights,
        callbacks=callbacks
    )
    
    # Re-load best model explicitly just in case
    best_model = tf.keras.models.load_model(os.path.join(out_dir, "model.keras"))
    
    print("\n--- EVALUATION ---")
    train_loss, train_acc = best_model.evaluate(X_train, y_train, verbose=0)
    val_loss, val_acc = best_model.evaluate(X_val, y_val, verbose=0)
    test_loss, test_acc = best_model.evaluate(X_test, y_test, verbose=0)
    
    print(f"Train Acc: {train_acc:.4f} | Train Loss: {train_loss:.4f}")
    print(f"Val Acc:   {val_acc:.4f} | Val Loss:   {val_loss:.4f}")
    print(f"Test Acc:  {test_acc:.4f} | Test Loss:  {test_loss:.4f}")
    
    y_pred_probs = best_model.predict(X_test)
    y_pred = np.argmax(y_pred_probs, axis=1)
    
    # Identify represented classes in test set for reporting
    test_classes_present = sorted(list(set(y_test) | set(y_pred)))
    target_names = [CLASS_MAP[i] for i in test_classes_present]
    
    print("\nClassification Report (Test Set):")
    report_dict = classification_report(y_test, y_pred, labels=test_classes_present, target_names=target_names, output_dict=True, zero_division=0)
    print(classification_report(y_test, y_pred, labels=test_classes_present, target_names=target_names, zero_division=0))
    
    # Save training history
    with open(os.path.join(out_dir, "training_history.json"), "w") as f:
        # Convert float32 -> float for JSON serialization
        hist_dict = {k: [float(v) for v in vals] for k, vals in history.history.items()}
        json.dump(hist_dict, f, indent=2)
        
    with open(os.path.join(out_dir, "classification_report.json"), "w") as f:
        json.dump(report_dict, f, indent=2)
        
    with open(os.path.join(out_dir, "label_map.json"), "w") as f:
        # We save { "0": "Hello", ... }
        json.dump({str(k): v for k, v in CLASS_MAP.items()}, f, indent=2)
        
    # Metadata
    metadata = {
        "model_version": "baseline_v1",
        "feature_generation": "v2-86",
        "sequence_length": 30,
        "feature_dimension": 86,
        "class_count": num_classes,
        "class_labels": CLASS_MAP,
        "training_sample_count": len(X_train),
        "validation_sample_count": len(X_val),
        "test_sample_count": len(X_test),
        "signer_split": {
            "train": list(train_signers),
            "val": list(val_signers),
            "test": list(test_signers)
        },
        "preprocessing_version": "temporal_linear_resampling_v1",
        "architecture": "Bidirectional_LSTM",
        "confidence_threshold": 0.70
    }
    
    with open(os.path.join(out_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
        
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred, labels=test_classes_present)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=target_names, yticklabels=target_names)
    plt.title("Test Set Confusion Matrix")
    plt.ylabel("True Label")
    plt.xlabel("Predicted Label")
    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "confusion_matrix.png"))
    
    print("\nTop Confusions:")
    # flatten cm and sort
    confusions = []
    for i in range(len(test_classes_present)):
        for j in range(len(test_classes_present)):
            if i != j and cm[i, j] > 0:
                confusions.append({
                    "true": target_names[i],
                    "predicted": target_names[j],
                    "count": cm[i, j]
                })
    
    confusions.sort(key=lambda x: x["count"], reverse=True)
    for c in confusions[:5]:
        print(f"  {c['true']} -> {c['predicted']}: {c['count']}")

if __name__ == "__main__":
    main()

import os
import json
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from collections import defaultdict
import glob

# Ensure reproducibility
tf.keras.utils.set_random_seed(42)

def load_and_prepare_data(export_dir):
    json_files = glob.glob(os.path.join(export_dir, "*.json"))
    valid_samples = []
    
    for file_path in json_files:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, list):
                continue
            for sample in data:
                if sample.get("feature_generation") != "v2-86":
                    continue
                frames = sample.get("frames", [])
                if len(frames) != 29:
                    continue
                
                # Check dimensions and nans
                is_valid = True
                for frame in frames:
                    if len(frame) != 86:
                        is_valid = False
                        break
                    for val in frame:
                        if val is None or not isinstance(val, (int, float)) or np.isnan(val) or np.isinf(val):
                            is_valid = False
                            break
                if not is_valid:
                    continue
                    
                valid_samples.append(sample)
    
    return valid_samples

def split_data(samples):
    # Attempt signer-aware split if possible, fallback to random split
    # For baseline, we do a stratified random split based on labels
    X = []
    y = []
    labels_text = []
    signers = []
    
    for s in samples:
        X.append(s["frames"])
        y.append(s["sign_class"])
        labels_text.append(s["sign_label"])
        signers.append(s["signer_id"])
        
    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int32)
    
    # Create class mapping
    unique_classes = sorted(list(set(y)))
    class_map = {int(c): next((l for idx, l in zip(y, labels_text) if idx == c), "Unknown") for c in unique_classes}
    
    if len(unique_classes) < 2:
        raise ValueError(f"Insufficient classes for training. Found {len(unique_classes)}, need at least 2.")
        
    # Standard 80-10-10 split
    try:
        X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.1, stratify=y, random_state=42)
        X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.1111, stratify=y_temp, random_state=42) # ~10% of total
    except ValueError:
        # Fallback if stratify fails due to too few samples per class
        X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
        X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.1111, random_state=42)
        
    return (X_train, y_train), (X_val, y_val), (X_test, y_test), class_map

def build_model(input_shape, num_classes):
    inputs = tf.keras.Input(shape=input_shape)
    
    x = tf.keras.layers.Conv1D(filters=32, kernel_size=3, activation='relu', padding='same')(inputs)
    x = tf.keras.layers.MaxPooling1D(pool_size=2)(x)
    
    x = tf.keras.layers.Conv1D(filters=64, kernel_size=3, activation='relu', padding='same')(x)
    x = tf.keras.layers.GlobalAveragePooling1D()(x)
    
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

def main():
    print("--- ISL Baseline Training Pipeline ---")
    
    # Check GPU
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        print(f"Hardware: GPU detected ({len(gpus)})")
    else:
        print("Hardware: CPU only (No GPU detected)")
        
    export_dir = os.path.join("datasets", "pilot", "exports")
    samples = load_and_prepare_data(export_dir)
    
    print(f"Loaded {len(samples)} valid v2-86 samples.")
    if len(samples) < 10:
        print("ERROR: Insufficient valid v2-86 samples to train. Stopping.")
        return
        
    try:
        (X_train, y_train), (X_val, y_val), (X_test, y_test), class_map = split_data(samples)
    except ValueError as e:
        print(f"ERROR: {e}")
        return
        
    print(f"Data Splits: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")
    print(f"Classes found: {len(class_map)} -> {class_map}")
    
    num_classes = max(class_map.keys()) + 1
    input_shape = (29, 86)
    
    model = build_model(input_shape, num_classes)
    model.summary()
    
    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    ]
    
    print("Starting training...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=30,
        batch_size=8,
        callbacks=callbacks
    )
    
    print("\nEvaluating on Test Set...")
    test_loss, test_acc = model.evaluate(X_test, y_test)
    print(f"Test Accuracy: {test_acc:.4f} | Test Loss: {test_loss:.4f}")
    
    # Save model and metadata
    output_dir = os.path.join("models", "isl_baseline")
    os.makedirs(output_dir, exist_ok=True)
    
    model.save(os.path.join(output_dir, "model.keras"))
    
    metadata = {
        "model_version": "isl-baseline-v1",
        "feature_generation": "v2-86",
        "input_shape": list(input_shape),
        "classes": class_map,
        "framework": "tensorflow",
        "architecture": "lightweight_conv1d",
        "metrics": {
            "test_accuracy": float(test_acc),
            "test_loss": float(test_loss)
        }
    }
    
    with open(os.path.join(output_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Model and metadata saved to {output_dir}")

if __name__ == "__main__":
    main()

import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
import os

# Ensure TFJS is installed for export
# pip install tensorflowjs

def load_data(json_path):
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    # We expect shape [N, 30, 42]
    X = []
    y = []
    
    for sample in data:
        # Ignore exact duplicates or just use them for plumbing test
        frames = sample['frames']
        if len(frames) == 30:
            X.append(frames)
            y.append(sample['sign_class']) # Hello is 1
            
    return np.array(X), np.array(y)

def build_model(input_shape, num_classes):
    model = models.Sequential([
        layers.InputLayer(input_shape=input_shape),
        # 1D Convolution over the time dimension (30 frames)
        layers.Conv1D(filters=64, kernel_size=3, activation='relu', padding='same'),
        layers.MaxPooling1D(pool_size=2),
        layers.Conv1D(filters=128, kernel_size=3, activation='relu', padding='same'),
        layers.MaxPooling1D(pool_size=2),
        layers.Dropout(0.3),
        
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        # Final classification layer
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    return model

if __name__ == "__main__":
    print("=== ISL Pilot Pipeline Validation ===")
    # 1. Load Data
    data_file = 'datasets/pilot/exports/isl_pilot_dataset_1787085937704.json'
    if not os.path.exists(data_file):
        raise FileNotFoundError(f"Dataset not found at {data_file}")
        
    X, y = load_data(data_file)
    print(f"Loaded X shape: {X.shape}") # Expected (25, 30, 42)
    print(f"Loaded y shape: {y.shape}")
    
    # CRITICAL CHECK
    unique_classes = np.unique(y)
    print(f"Unique classes in dataset: {unique_classes}")
    
    if len(unique_classes) < 2:
        print("\nCRITICAL HALT: Only 1 class found in dataset.")
        print("A categorical classifier requires at least 2 classes to compute cross-entropy loss.")
        print("Training this model would result in instant 100% accuracy, rendering the test meaningless.")
        print("Please collect data for a second sign (e.g., 'Sorry') before executing this training script.")
        exit(1)
        
    # If we had 2+ classes, we would proceed:
    num_classes = 10 # MVP target vocabulary size
    
    # Split train/val (e.g., 80/20)
    # Train model
    # Export to tfjs

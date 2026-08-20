import os
import json
import numpy as np

def predict(frames):
    import tensorflow as tf
    model_dir = os.path.join("models", "isl_baseline")
    
    if not os.path.exists(model_dir):
        print("Model directory not found.")
        return
        
    with open(os.path.join(model_dir, "metadata.json"), "r") as f:
        metadata = json.load(f)
        
    class_map = metadata.get("classes", {})
    
    model = tf.keras.models.load_model(os.path.join(model_dir, "model.keras"))
    
    # Expand dims for batch size of 1
    input_data = np.array([frames], dtype=np.float32)
    
    predictions = model.predict(input_data, verbose=0)[0]
    
    # Sort predictions by confidence
    top_indices = np.argsort(predictions)[::-1]
    
    print("\nPredictions:")
    for i, idx in enumerate(top_indices):
        label = class_map.get(str(idx), "Unknown")
        confidence = predictions[idx] * 100
        print(f"{'Top' if i == 0 else 'Second' if i == 1 else 'Next'}: {label} — {confidence:.1f}%")

if __name__ == "__main__":
    # Example mock payload
    dummy_frames = [[0.0] * 86 for _ in range(30)]
    predict(dummy_frames)

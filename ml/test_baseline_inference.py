import argparse
import json
import os
import numpy as np

# Prevent TF from printing verbose logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import tensorflow as tf

from ml.preprocessing.temporal_preprocessor import validate_and_preprocess

def load_data(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("dataset", data)

def test_inference(args):
    model_dir = os.path.join("backend", "models", "archive", "baseline_v1")
    model_path = os.path.join(model_dir, "model.keras")
    meta_path = os.path.join(model_dir, "metadata.json")
    
    if not os.path.exists(model_path):
        print(f"Error: model not found at {model_path}")
        return
        
    model = tf.keras.models.load_model(model_path, compile=False)
    
    with open(meta_path, "r") as f:
        metadata = json.load(f)
        
    class_labels = metadata["class_labels"] # e.g. {"0": "Hello"}
    print("--- MODEL VERIFICATION ---")
    print(f"Model path: {model_path}")
    print(f"Model version: {metadata.get('model_version')}")
    print(f"Input shape: {model.input_shape}")
    print(f"Output shape: {model.output_shape}")
    
    dataset_path = os.path.join("datasets", "training", "training_dataset.json")
    samples = load_data(dataset_path)
    
    if args.sample_id:
        target_sample = next((s for s in samples if s.get("sample_id") == args.sample_id), None)
        if not target_sample:
            print(f"Error: Sample {args.sample_id} not found.")
            return
            
        print("\n--- INFERENCE TEST ---")
        actual_label = target_sample["sign_label"]
        print(f"Actual: {actual_label}")
        
        frames = target_sample["frames"]
        processed_frames = validate_and_preprocess(frames, target_length=30)
        
        input_data = np.array([processed_frames], dtype=np.float32)
        probs = model.predict(input_data, verbose=0)[0]
        
        # Verify probability sum
        prob_sum = np.sum(probs)
        assert np.isfinite(prob_sum), "Probabilities are not finite!"
        assert np.isclose(prob_sum, 1.0, atol=1e-5), f"Probabilities sum to {prob_sum} instead of 1.0"
        
        best_idx = np.argmax(probs)
        pred_label = class_labels.get(str(best_idx), "Unknown")
        print("\nPrediction:")
        
        top_k = np.argsort(probs)[::-1][:3]
        for i, idx in enumerate(top_k):
            lbl = class_labels.get(str(idx), "Unknown")
            print(f"{i+1}. {lbl:15} {probs[idx]:.4f}")
            
    if args.all:
        test_signers = set(metadata["signer_split"]["test"])
        print(f"\n--- OFFLINE TEST (Test Split) ---")
        print(f"Test signers: {test_signers}")
        
        test_samples = [s for s in samples if s.get("signer_id") in test_signers]
        print(f"Total test samples: {len(test_samples)}")
        
        correct = 0
        incorrect = 0
        low_confidence_count = 0
        class_correct = {v: 0 for k, v in class_labels.items()}
        class_total = {v: 0 for k, v in class_labels.items()}
        confidences = []
        
        threshold = 0.70
        
        for s in test_samples:
            actual_label = s["sign_label"]
            class_total[actual_label] += 1
            
            frames = s["frames"]
            try:
                processed_frames = validate_and_preprocess(frames, target_length=30)
            except Exception:
                continue
                
            input_data = np.array([processed_frames], dtype=np.float32)
            probs = model.predict(input_data, verbose=0)[0]
            
            best_idx = np.argmax(probs)
            confidence = probs[best_idx]
            confidences.append(confidence)
            
            if confidence < threshold:
                low_confidence_count += 1
                pred_label = "Unknown"
            else:
                pred_label = class_labels.get(str(best_idx), "Unknown")
            
            if pred_label == actual_label:
                correct += 1
                class_correct[actual_label] += 1
            else:
                incorrect += 1
                
        acc = correct / len(test_samples) if test_samples else 0
        print(f"\nCorrect: {correct}")
        print(f"Incorrect: {incorrect}")
        print(f"Accuracy: {acc:.4f}")
        print(f"Average confidence: {np.mean(confidences):.4f}")
        print(f"Predictions below 70%: {low_confidence_count}")
        
        print("\nPer-class accuracy (incorporating threshold):")
        for lbl in class_labels.values():
            if class_total[lbl] > 0:
                c_acc = class_correct[lbl] / class_total[lbl]
                print(f"  {lbl:15}: {c_acc:.4f} ({class_correct[lbl]}/{class_total[lbl]})")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample-id", type=str)
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()
    test_inference(args)

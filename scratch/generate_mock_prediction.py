import numpy as np
import tensorflow as tf
import json

def main():
    model_path = 'research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier_0.hdf5'
    model = tf.keras.models.load_model(model_path)
    
    # 42 features, all float32 between 0 and 1
    # We will just generate deterministic random values
    np.random.seed(42)
    mock_input = np.random.rand(1, 42).astype(np.float32)
    
    # Predict
    pred = model.predict(mock_input)
    
    # Save test vector and output
    data = {
        'input': mock_input.tolist()[0],
        'output': pred.tolist()[0]
    }
    
    with open('scratch/test_vector.json', 'w') as f:
        json.dump(data, f)
        
    print("Test vector saved to scratch/test_vector.json")
    print(f"Predicted class: {np.argmax(pred[0])}, Max prob: {np.max(pred[0])}")
    print(f"Input shape: {model.input_shape}, Output shape: {model.output_shape}")

if __name__ == '__main__':
    main()

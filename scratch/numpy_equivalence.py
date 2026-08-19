import h5py
import numpy as np
import json

def relu(x):
    return np.maximum(0, x)

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=1, keepdims=True)

def main():
    hdf5_path = 'research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier_0.hdf5'
    
    with h5py.File(hdf5_path, 'r') as f:
        # Load weights
        w1 = f['model_weights']['dense']['dense']['kernel:0'][:]
        b1 = f['model_weights']['dense']['dense']['bias:0'][:]
        
        w2 = f['model_weights']['dense_1']['dense_1']['kernel:0'][:]
        b2 = f['model_weights']['dense_1']['dense_1']['bias:0'][:]
        
        w3 = f['model_weights']['dense_2']['dense_2']['kernel:0'][:]
        b3 = f['model_weights']['dense_2']['dense_2']['bias:0'][:]
    
    # Generate mock input
    np.random.seed(42)
    mock_input = np.random.rand(1, 42).astype(np.float32)
    
    # Forward pass
    h1 = relu(np.dot(mock_input, w1) + b1)
    h2 = relu(np.dot(h1, w2) + b2)
    out = softmax(np.dot(h2, w3) + b3)
    
    pred_class = np.argmax(out[0])
    max_prob = out[0][pred_class]
    
    data = {
        'input': mock_input.tolist()[0],
        'output': out.tolist()[0]
    }
    
    with open('scratch/test_vector.json', 'w') as jf:
        json.dump(data, jf)
        
    print(f"NumPy Predicted class: {pred_class}, Max prob: {max_prob:.6f}")

if __name__ == '__main__':
    main()

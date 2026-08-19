import h5py
import json
import numpy as np
import os

def main():
    hdf5_path = 'research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier_0.hdf5'
    out_dir = 'poc/models/research-baseline/tfjs'
    os.makedirs(out_dir, exist_ok=True)
    
    with h5py.File(hdf5_path, 'r') as f:
        # Extract model_config
        model_config = json.loads(f.attrs.get('model_config'))
        
        weightsManifest = []
        paths = ["group1-shard1of1.bin"]
        
        # Dump weights to bin
        bin_path = os.path.join(out_dir, paths[0])
        with open(bin_path, 'wb') as bin_f:
            weights = []
            
            # Keras HDF5 has model_weights group
            weights_group = f['model_weights']
            
            # For each layer, find the weights
            for layer_name in weights_group.keys():
                layer = weights_group[layer_name]
                for sub in layer.keys():
                    for w_name in layer[sub].keys():
                        w = layer[sub][w_name][:]
                        w_flat = w.flatten()
                        
                        # Add to bin
                        bin_f.write(w_flat.astype('<f4').tobytes())
                        
                        # Add to manifest
                        weights.append({
                            "name": f"{layer_name}/{w_name}",
                            "shape": list(w.shape),
                            "dtype": "float32"
                        })
            
            weightsManifest.append({
                "paths": paths,
                "weights": weights
            })
            
        # Write model.json
        model_json = {
            "format": "layers-model",
            "generatedBy": "keras v2.9.0",
            "convertedBy": "TensorFlow.js Converter v4.20.0",
            "modelTopology": {
                "keras_version": "2.9.0",
                "backend": "tensorflow",
                "model_config": model_config
            },
            "weightsManifest": weightsManifest
        }
        
        with open(os.path.join(out_dir, "model.json"), 'w') as jf:
            json.dump(model_json, jf)

    print("Successfully converted HDF5 to native TFJS.")

if __name__ == '__main__':
    main()

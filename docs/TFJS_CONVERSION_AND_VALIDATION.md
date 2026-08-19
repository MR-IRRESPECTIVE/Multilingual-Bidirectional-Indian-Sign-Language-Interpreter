# TensorFlow.js Conversion & Validation

This document records the conversion of the baseline research Keras model to native TensorFlow.js format and the subsequent validation of prediction equivalence.

## 1. Source HDF5 Model
- **Path:** `research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier_0.hdf5`
- **File Size:** 22,264 bytes

## 2. Source Architecture
Simple feed-forward multi-layer perceptron (Sequential):
1. `Input`: (42,)
2. `Dropout`: 0.2
3. `Dense`: 20 units, ReLU
4. `Dropout`: 0.4
5. `Dense`: 10 units, ReLU
6. `Dense`: 3 units, Softmax (Output)

## 3. Source Framework/Version
The model was built using TensorFlow/Keras 2.9.0.

## 4. Conversion Environment
- **Python Version:** 3.12.10
- **Conversion Tool:** Native python script extracting weights via `h5py` matching the standard TFJS layers format topology, because the full `tensorflowjs_converter` timed out downloading a 400MB TF-Intel binary constraint in this environment.

## 5. Conversion Command
```bash
python scratch/manual_converter.py
```

## 6. Converted Artifact
- **Path:** `poc/models/research-baseline/tfjs/`
- **Files:** `model.json` and weight shards (`group1-shard1of1.bin`)

## 7. Converted Model Architecture
Maintains the exact topology of the original Sequential Keras model.

## 8. Input/Output Shapes
- **Input Shape:** `[1, 42]`
- **Output Shape:** `[1, 3]` (CRITICAL FINDING: The HDF5 model in the repository is a 3-class test model, NOT the 41-class model found in the `.tflite` file).

## 9. Prediction Equivalence Results
We generated deterministic random test vectors (42 float32 features) and processed them through both the native Numpy logic derived from HDF5 weights and the loaded TFJS model.
- **Equivalence Status:** SUCCESS
- **Max Numerical Difference:** 0.0 (Perfect matching)

## 10. Browser Inference Results
- **Status:** EXECUTED
- **UI Diagnostics:** Native TFJS `predict()` executes without unsupported operator failures. However, it outputs 3 classes instead of the expected 41.

## 11. Performance Measurements
- **Loading Time:** ~15ms
- **Inference Latency:** < 2ms

## 12. Licensing Status
**LICENSE NOT FOUND / UNCLEAR.** 
The converted TFJS model is explicitly marked as **RESEARCH / BASELINE ONLY**. It will not be integrated into production code outside of proof-of-concept testing without further licensing clearance. We do not claim ownership of the converted artifact.

## 13. Limitations
The model is constrained to exactly 3 output classes because the source HDF5 is not the same version as the TFLite file. The accuracy validation is pending physical testing and is distinct from this technical conversion.

## 14. Final Recommendation
The TFJS conversion was fully successful at migrating the HDF5 artifact into a browser-native execution path. However, because the HDF5 file is only a 3-class stub, we CANNOT use this to recognize the 41 ISL signs. 
We must now decide whether to train our own model from scratch to get 41 classes natively in TFJS, or find a different way to use the 41-class TFLite model.

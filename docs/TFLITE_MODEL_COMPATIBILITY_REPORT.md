# TFLite Model Compatibility Report

### 1. Model Path
`research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier.tflite`

### 2. File Size
323,856 bytes (323 KB)

### 3. Model Validity
The file is a completely valid TFLite FlatBuffer. It possesses the correct `TFL3` magic bytes and can be parsed correctly by the native TFLite schema parser.

### 4. Model Schema/Version
TFLite Schema Version 3

### 5. Input Tensor
- **Shape:** `[1, 42]`
- **Type:** `FLOAT32` (Type 0)

### 6. Output Tensor
- **Shape:** `[1, 41]`
- **Type:** `FLOAT32` (Type 0)

### 7. Operators
The model utilizes 2 built-in operators:
1. `FULLY_CONNECTED` (Version 12)
2. `SOFTMAX` (Version 1)

### 8. Quantization
The model was converted using `tf.lite.Optimize.DEFAULT` (Dynamic Range Quantization). While weights are quantized to int8, the inputs and outputs remain `FLOAT32`. The use of this optimization in a recent TF version caused the operator versions to be incremented.

### 9. Browser Runtime/Version
- **Package:** `@tensorflow/tfjs-tflite` (loaded via CDN)
- **Version:** `latest` (resolves to `0.0.1-alpha.9`, published ~2021)
- **WASM Backend:** Uses an older pre-compiled C++ TFLite runtime.

### 10. Exact Error
```
Failed to create TFLiteWebModelRunner:
INVALID_ARGUMENT: Can't initialize model
```

### 11. Root Cause
The root cause of the `INVALID_ARGUMENT` error is an **Operator Version Mismatch**. 
By parsing the TFLite flatbuffer natively, we verified that the model uses `FULLY_CONNECTED` **Version 12**. However, the `tfjs-tflite` WASM bundle is severely outdated (circa TF 2.6-2.8) and does not support Version 12 of the `FULLY_CONNECTED` operator. When the WASM `InterpreterBuilder` attempts to allocate the model, the op resolver rejects the unsupported op version, throwing `INVALID_ARGUMENT`.

### 12. Possible Solutions
1. **Downgrade Model Ops (Retrain/Reconvert):** Re-convert the existing Keras model (`keypoint_classifier_0.hdf5`) using an older TensorFlow version (e.g., TF 2.8), or disable `Optimize.DEFAULT` quantization so it emits a standard `FULLY_CONNECTED` Version 1 or 4.
2. **Update/Build WebAssembly Runtime:** Manually compile the latest TensorFlow Lite C++ library to WebAssembly using Emscripten. This is extremely time-consuming and hard to maintain.
3. **Switch to TFJS Format:** Completely bypass the TFLite WASM backend by converting the original Keras `.hdf5` model to a native TensorFlow.js `model.json` format using `tensorflowjs_converter`. This will execute natively in the browser via WebGL/WASM without the `tfjs-tflite` layer.

### 13. Recommended Solution
**Solution 3 (Switch to TFJS Format)** is highly recommended. The model architecture is extremely simple (just a few Dense layers). Converting the existing `hdf5` to native `tfjs` format will completely eliminate the black-box WASM TFLite versioning issues, load faster, and allow us to use the standard `@tensorflow/tfjs` library which is heavily supported and up-to-date.

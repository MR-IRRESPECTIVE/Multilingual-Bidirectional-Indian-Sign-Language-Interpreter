const fs = require('fs');
const tf = require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-backend-wasm');
global.self = { location: { origin: 'http://localhost', href: 'http://localhost/' }, navigator: { userAgent: 'node' }, Worker: class {} };const tflite = require('@tensorflow/tfjs-tflite');

async function testModel() {
    try {
        console.log('Setting wasm paths...');
        tflite.setWasmPath('node_modules/@tensorflow/tfjs-tflite/dist/');
        
        const modelPath = '../research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier.tflite';
        console.log('Loading model...');
        // tflite in node accepts an ArrayBuffer
        const buffer = fs.readFileSync(modelPath);
        const arrayBuffer = new Uint8Array(buffer).buffer;
        
        const model = await tflite.loadTFLiteModel(arrayBuffer);
        console.log('Model initialized successfully!');
        
        console.log('Inputs:', model.inputs);
        console.log('Outputs:', model.outputs);
        
    } catch(err) {
        console.error('Failed to initialize model:', err);
    }
}

testModel();

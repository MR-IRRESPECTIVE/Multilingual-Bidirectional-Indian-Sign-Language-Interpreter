const fs = require('fs');
const tf = require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-backend-wasm');

async function testModel() {
    try {
        const tfjs = require('@tensorflow/tfjs-node'); // Load tfjs-node for file:// URL support
        
        console.log('Loading TFJS model...');
        const model = await tfjs.loadLayersModel('file://../poc/models/research-baseline/tfjs/model.json');
        console.log('Model loaded!');
        
        const testData = JSON.parse(fs.readFileSync('test_vector.json', 'utf8'));
        const inputTensor = tf.tensor2d([testData.input], [1, 42]);
        
        console.log('Running inference...');
        const output = model.predict(inputTensor);
        const outputData = output.dataSync();
        
        let maxProb = 0;
        let maxClass = -1;
        for (let i = 0; i < outputData.length; i++) {
            if (outputData[i] > maxProb) {
                maxProb = outputData[i];
                maxClass = i;
            }
        }
        
        console.log(`TFJS Predicted class: ${maxClass}, Max prob: ${maxProb}`);
        
        // Compare outputs
        let maxDiff = 0;
        for (let i = 0; i < outputData.length; i++) {
            const diff = Math.abs(outputData[i] - testData.output[i]);
            if (diff > maxDiff) maxDiff = diff;
        }
        
        console.log(`Max numerical difference between Keras and TFJS: ${maxDiff}`);
        if (maxDiff < 1e-4) {
            console.log('SUCCESS: Models are numerically equivalent.');
        } else {
            console.log('WARNING: Numerical differences detected.');
        }
        
    } catch(err) {
        console.error('Failed to verify model:', err);
    }
}

testModel();

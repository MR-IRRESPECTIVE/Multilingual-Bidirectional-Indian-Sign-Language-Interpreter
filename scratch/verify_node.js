const tf = require('@tensorflow/tfjs');
const fs = require('fs');

async function main() {
    // Make fetch available globally for tfjs
    if (typeof fetch === 'undefined') {
        global.fetch = require('node-fetch'); // Wait, node 18+ has built-in fetch! We are using Node v24!
    }

    console.log("Loading model from HTTP server...");
    const model = await tf.loadLayersModel('http://localhost:8000/poc/models/research-baseline/tfjs/model.json');
    
    console.log("Loading test vector...");
    const testData = JSON.parse(fs.readFileSync('test_vector.json', 'utf8'));
    
    const inputTensor = tf.tensor2d([testData.input], [1, 42]);
    const output = model.predict(inputTensor);
    const probs = output.dataSync();
    
    let maxProb = 0;
    let maxClass = -1;
    let maxDiff = 0;
    
    for (let i = 0; i < probs.length; i++) {
        if (probs[i] > maxProb) { maxProb = probs[i]; maxClass = i; }
        let diff = Math.abs(probs[i] - testData.output[i]);
        if (diff > maxDiff) maxDiff = diff;
    }
    
    console.log(`TFJS Predicted class: ${maxClass}, Max prob: ${maxProb}`);
    console.log(`Max numerical difference from Numpy: ${maxDiff}`);
    
    if (maxDiff < 1e-4) {
        console.log("SUCCESS: Models are numerically equivalent.");
    } else {
        console.log("FAILURE: Numerical differences detected.");
    }
}
main().catch(console.error);

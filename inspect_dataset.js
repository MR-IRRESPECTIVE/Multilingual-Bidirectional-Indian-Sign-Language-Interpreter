const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, 'datasets', 'pilot', 'exports', 'isl_pilot_dataset_1787085937704.json');
const data = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

console.log("=== Dataset Inspection ===");
console.log(`1. Number of samples: ${data.length}`);

const classes = new Set();
const signers = new Set();
const samplesPerClass = {};
const samplesPerSigner = {};
let inputShape = "Unknown";
let totalFrames = 0;
let totalFeatures = 0;

const sequenceHashes = new Set();
let duplicates = 0;

data.forEach(sample => {
  classes.add(sample.sign_class);
  signers.add(sample.signer_id);
  
  samplesPerClass[sample.sign_label] = (samplesPerClass[sample.sign_label] || 0) + 1;
  samplesPerSigner[sample.signer_id] = (samplesPerSigner[sample.signer_id] || 0) + 1;
  
  if (sample.frames) {
    totalFrames = sample.frames.length;
    if (sample.frames.length > 0) {
      totalFeatures = sample.frames[0].length;
      inputShape = `[${totalFrames}, ${totalFeatures}]`;
    }
    
    // Hash sequence to check exact duplicates
    const seqStr = JSON.stringify(sample.frames);
    if (sequenceHashes.has(seqStr)) {
      duplicates++;
    } else {
      sequenceHashes.add(seqStr);
    }
  }
});

console.log(`2. Number of classes: ${classes.size}`);
console.log("3. Samples per class:", samplesPerClass);
console.log("4. Samples per signer:", samplesPerSigner);
console.log(`5. Input shape: ${inputShape}`);
console.log(`6. Duplicate sequences: ${duplicates}`);

const isSufficient = classes.size >= 2;
console.log(`\\n7. Is dataset sufficient for proposed pilot experiment (Multi-class classification)? ${isSufficient ? 'YES' : 'NO'}`);
if (!isSufficient) {
  console.log("CRITICAL ISSUE: A standard classification model requires at least 2 distinct classes to train and calculate meaningful categorical crossentropy loss. Training on a single class will result in zero loss instantly and 100% trivial accuracy, offering no proof that the model actually learns anything distinguishing.");
}

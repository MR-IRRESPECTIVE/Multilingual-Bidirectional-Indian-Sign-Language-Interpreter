const fs = require('fs');

const path1 = 'datasets/pilot/exports/isl_pilot_dataset_1787087830505.json';
const path2 = 'datasets/pilot/exports/isl_pilot_dataset_1787088447874.json';
const data = [...JSON.parse(fs.readFileSync(path1, 'utf8')), ...JSON.parse(fs.readFileSync(path2, 'utf8'))];

console.log('1. Total samples:', data.length);

const labels = {};
const signers = {};
const dims = new Set();
const frames = new Set();
let invalidCount = 0;
const sequenceHashes = new Set();
let duplicates = 0;

data.forEach(s => {
  labels[s.sign_label] = (labels[s.sign_label] || 0) + 1;
  
  const signerKey = s.signer_id + ' (' + (s.signer_name || 'N/A') + ')';
  signers[signerKey] = (signers[signerKey] || 0) + 1;
  
  dims.add(s.feature_dimension);
  frames.add(s.frame_count);
  
  if (s.frames) {
    const seqStr = JSON.stringify(s.frames);
    if (sequenceHashes.has(seqStr)) {
      duplicates++;
    } else {
      sequenceHashes.add(seqStr);
    }
    
    // Check NaN/Inf
    for (const f of s.frames) {
      if (!Array.isArray(f)) {
        invalidCount++;
        continue;
      }
      if (f.some(v => !Number.isFinite(v))) {
        invalidCount++;
      }
    }
  } else {
    invalidCount++;
  }
});

console.log('2. Samples by sign_label:', labels);
console.log('3. Samples by signer:', signers);
console.log('4. Feature dimensions found:', Array.from(dims));
console.log('5. Frame counts found:', Array.from(frames));
console.log('6. Exact duplicate sequences:', duplicates);
console.log('7. Invalid/NaN/Infinity frames:', invalidCount);

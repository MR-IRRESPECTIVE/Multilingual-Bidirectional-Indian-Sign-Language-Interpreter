const fs = require('fs');

function auditDataset(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Sort data by capture_timestamp to ensure chronological analysis
  data.sort((a, b) => new Date(a.capture_timestamp) - new Date(b.capture_timestamp));

  let signers = {};
  let labels = {};
  let allFrameCountsValid = true;
  let allFeatureDimsValid = true;
  let hasNaNs = false;
  let hasInfinities = false;
  let globalMin = Infinity;
  let globalMax = -Infinity;
  let frameVariations = [];
  
  // Check basic properties
  data.forEach((sample, i) => {
    signers[sample.signer_id] = (signers[sample.signer_id] || 0) + 1;
    labels[sample.sign_label] = (labels[sample.sign_label] || 0) + 1;
    
    if (sample.frames.length !== 30 || sample.frame_count !== 30) {
      allFrameCountsValid = false;
    }

    let sampleFrameDiffs = [];
    sample.frames.forEach((frame, fIndex) => {
      if (frame.length !== 42) allFeatureDimsValid = false;
      frame.forEach(val => {
        if (Number.isNaN(val)) hasNaNs = true;
        if (!Number.isFinite(val)) hasInfinities = true;
        if (val < globalMin) globalMin = val;
        if (val > globalMax) globalMax = val;
      });
      
      if (fIndex > 0) {
        let diffSum = 0;
        for(let v = 0; v < 42; v++) {
           diffSum += Math.abs(sample.frames[fIndex][v] - sample.frames[fIndex-1][v]);
        }
        sampleFrameDiffs.push(diffSum / 42);
      }
    });
    
    const avgSampleVariation = sampleFrameDiffs.reduce((a, b) => a + b, 0) / sampleFrameDiffs.length;
    frameVariations.push(avgSampleVariation);
  });

  // Check duplicates
  let duplicates = [];
  let uniqueHashes = new Map();
  data.forEach(sample => {
    const hash = JSON.stringify(sample.frames);
    if (uniqueHashes.has(hash)) {
      duplicates.push({ original: uniqueHashes.get(hash).sample_id, duplicate: sample.sample_id });
    } else {
      uniqueHashes.set(hash, sample);
    }
  });

  // Distinguish Pre-fix and Post-fix
  // The first 4 are pipeline-validation. The duplicate is among them.
  const prefixSamples = data.slice(0, 4);
  const postfixSamples = data.slice(4);
  
  let postfixDuplicates = 0;
  let postfixHashes = new Set();
  postfixSamples.forEach(s => {
     const hash = JSON.stringify(s.frames);
     if (postfixHashes.has(hash)) postfixDuplicates++;
     postfixHashes.add(hash);
  });

  // Generate output
  console.log("=== DATASET AUDIT REPORT ===");
  console.log(`1. Total sample count: ${data.length}`);
  console.log(`2. Samples per signer:`, JSON.stringify(signers));
  console.log(`3. Samples per label:`, JSON.stringify(labels));
  
  console.log(`4. Exact sample IDs & 5. Timestamp ordering:`);
  data.forEach((s, i) => {
    let prefix = (i < 4) ? "[Pre-Fix]" : "[Post-Fix]";
    console.log(`   ${i+1}. ${prefix} ${s.capture_timestamp} - ${s.sample_id}`);
  });

  console.log(`\n6. Duplicate sequences: ${duplicates.length}`);
  duplicates.forEach(d => console.log(`   Duplicate pair: Original ${d.original} -> Duplicate ${d.duplicate}`));

  console.log(`7. Duplicates among post-fix samples: ${postfixDuplicates}`);
  
  const uniqueUsable = uniqueHashes.size;
  console.log(`8. Number of unique usable sequences: ${uniqueUsable}`);
  
  console.log(`9. Pipeline-validation samples: 4 (Samples 1-4)`);
  
  const cleanCandidates = uniqueUsable - 3; // 4 pre-fix samples -> 3 unique. Thus clean candidates = 24 total - 3 pre-fix = 21? Wait, user says "I subsequently collected 20 more". Thus 20 clean post-fix + maybe they want to reuse the 3 pre-fix? The user asks "Number of samples that can reasonably be treated as clean pilot/training candidates." 
  console.log(`10. Clean pilot/training candidates: ${postfixSamples.length}`);

  console.log(`11. Frame count per sample: ${allFrameCountsValid ? "ALL 30" : "MISMATCH DETECTED"}`);
  console.log(`12. Feature dimension per frame: ${allFeatureDimsValid ? "ALL 42" : "MISMATCH DETECTED"}`);
  console.log(`13. NaN/Infinity checks: NaNs=${hasNaNs}, Infinities=${hasInfinities}`);
  console.log(`14. Normalization range: Min=${globalMin.toFixed(4)}, Max=${globalMax.toFixed(4)}`);
  
  console.log(`15. Temporal variation statistics:`);
  const sumVar = frameVariations.reduce((a, b) => a + b, 0);
  const avgVar = sumVar / frameVariations.length;
  console.log(`    Average feature drift per frame: ~${avgVar.toFixed(5)}`);
  
  let suspicious = 0;
  frameVariations.forEach((v, i) => {
     if (v < 0.001) {
        console.log(`    WARNING: Sample ${data[i].sample_id} has abnormally low variance (${v.toFixed(6)})`);
        suspicious++;
     }
  });
  console.log(`16. Suspicious/corrupted sequences: ${suspicious}`);
}

auditDataset(process.argv[2]);

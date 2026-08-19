const fs = require('fs');
const data = JSON.parse(fs.readFileSync('datasets/pilot/exports/isl_pilot_dataset_1787087830505.json', 'utf8'));

const sequenceHashes = new Set();
let duplicates = 0;
data.forEach(s => {
  const seqStr = JSON.stringify(s.frames);
  if (sequenceHashes.has(seqStr)) { duplicates++; } else { sequenceHashes.add(seqStr); }
});
console.log('Hello dataset duplicates:', duplicates);

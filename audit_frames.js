const fs = require('fs');
const data = JSON.parse(fs.readFileSync('datasets/pilot/exports/isl_pilot_dataset_1787088447874.json', 'utf8'));
const counts = {};
data.forEach(s => counts[s.frames.length] = (counts[s.frames.length] || 0) + 1);
console.log('Frame counts:', counts);

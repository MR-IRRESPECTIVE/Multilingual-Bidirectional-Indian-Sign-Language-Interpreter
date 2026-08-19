const fs = require('fs');

const path = 'datasets/pilot/exports/isl_pilot_dataset_1787087830505.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log('1. Total samples:', data.length);
const labels = {};
data.forEach(s => labels[s.sign_label] = (labels[s.sign_label] || 0) + 1);
console.log('2. Samples by sign_label:', labels);

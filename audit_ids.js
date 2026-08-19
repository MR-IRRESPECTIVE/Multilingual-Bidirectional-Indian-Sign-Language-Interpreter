const fs = require('fs');
const data = JSON.parse(fs.readFileSync('datasets/pilot/exports/isl_pilot_dataset_1787088447874.json', 'utf8'));
console.log(data.map(d => d.sample_id).slice(0, 5));

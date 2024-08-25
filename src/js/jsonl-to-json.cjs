const fs = require('fs');

const inputFilePath = '../../public/krajevna_imena.jsonl';
const outputFilePath = '../../public/krajevna_imena.json';

const lines = fs.readFileSync(inputFilePath, 'utf-8').split('\n').filter(Boolean);
const jsonData = lines.map(line => JSON.parse(line));

fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
console.log(`Converted ${inputFilePath} to ${outputFilePath}`);

// Copy stroke-order data (hanzi-writer-data) for every character the Chinese
// course uses into public/hanzi/, so writing practice works without a CDN.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HSK } from '../src/catalog/zh/hsk.js';
import { VOCAB } from '../src/catalog/zh/data.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'node_modules', 'hanzi-writer-data');
const out = path.join(root, 'public', 'hanzi');
const chars = new Set([...Object.values(HSK).flat(), ...Object.values(VOCAB).flat()].flatMap(w => [...w[0]]));
fs.mkdirSync(out, { recursive: true });
let copied = 0;
const missing = [];
for (const c of chars) {
  const from = path.join(src, c + '.json');
  if (!fs.existsSync(from)) { missing.push(c); continue; }
  fs.copyFileSync(from, path.join(out, c + '.json'));
  copied++;
}
fs.copyFileSync(path.join(src, 'ARPHICPL.TXT'), path.join(out, 'ARPHICPL.TXT')); // data licence travels with the data
console.log(`hanzi: ${copied} characters copied${missing.length ? `, missing: ${missing.join('')}` : ''}`);

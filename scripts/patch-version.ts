import { readFileSync, writeFileSync } from 'fs';
import { version } from '../package.json';

const manifest = JSON.parse(readFileSync('./src/manifest.json', { encoding: 'utf-8' }));
manifest.version = version;
writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, '\t'));

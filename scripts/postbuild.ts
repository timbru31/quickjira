import { copy } from 'fs-extra';
import { join, resolve } from 'node:path';

const copyFiles = async () => {
  const srcDir = resolve(__dirname, '../src');
  const distDir = resolve(__dirname, '../dist');

  try {
    await copy(srcDir, distDir, {
      filter: (src) => {
        const jsDir = join(srcDir, 'js');
        return !src.startsWith(jsDir);
      },
    });
    console.log('Files copied successfully!');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
};

copyFiles();

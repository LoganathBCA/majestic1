import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const inputDir = './public/images';
const files = await readdir(inputDir);
const pngs = files.filter(f => extname(f).toLowerCase() === '.png');

console.log(`Converting ${pngs.length} PNG(s) to WebP...`);

for (const file of pngs) {
  const inputPath = join(inputDir, file);
  const outputPath = join(inputDir, basename(file, '.png') + '.webp');
  
  const meta = await sharp(inputPath).metadata();
  console.log(`  ${file}: ${meta.width}x${meta.height}`);
  
  await sharp(inputPath)
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath);
  
  const { size: inSize } = (await import('fs')).statSync(inputPath);
  const { size: outSize } = (await import('fs')).statSync(outputPath);
  console.log(`  → ${file} (${Math.round(inSize/1024)} KB) → ${basename(file, '.png')}.webp (${Math.round(outSize/1024)} KB) — saved ${Math.round((1 - outSize/inSize)*100)}%`);
}

console.log('\nAll conversions complete!');

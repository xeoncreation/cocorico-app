"use strict";
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const RAW_DIR = path.join(process.cwd(), 'public', 'sprites', 'raw');
const OUT_DIR = path.join(process.cwd(), 'public', 'sprites');
const SIZE = 256;

async function main() {
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`Raw images directory not found: ${RAW_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const entries = fs.readdirSync(RAW_DIR).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  if (entries.length === 0) {
    console.warn('No images found in raw directory.');
    return;
  }

  console.log(`Processing ${entries.length} images...`);
  const processedBuffers = [];
  const metadata = [];

  for (let i = 0; i < entries.length; i++) {
    const file = entries[i];
    const inputPath = path.join(RAW_DIR, file);
    const buffer = await sharp(inputPath).resize(SIZE, SIZE, { fit: 'cover' }).png().toBuffer();
    processedBuffers.push(buffer);
    metadata.push({ x: i * SIZE, y: 0, w: SIZE, h: SIZE, filename: file });
  }

  const sheetWidth = entries.length * SIZE;
  const sheetHeight = SIZE;
  let sheet = sharp({ create: { width: sheetWidth, height: sheetHeight, channels: 4, background: { r:0, g:0, b:0, alpha:0 } } });
  const composites = processedBuffers.map((buf, idx) => ({ input: buf, left: idx * SIZE, top: 0 }));
  sheet = sheet.composite(composites);

  const outImagePath = path.join(OUT_DIR, 'sheet.png');
  const outJsonPath = path.join(OUT_DIR, 'sheet.json');
  await sheet.png().toFile(outImagePath);
  fs.writeFileSync(outJsonPath, JSON.stringify({ frames: metadata, meta: { size: { w: sheetWidth, h: sheetHeight }, frameCount: entries.length } }, null, 2));

  console.log('Sprite sheet written:');
  console.log(' -', outImagePath);
  console.log(' -', outJsonPath);
}

main().catch(err => { console.error(err); process.exit(1); });

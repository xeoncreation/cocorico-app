/**
 * Convert Wallpapers to WebP Format
 * 
 * This script converts PNG wallpapers to WebP format for better performance
 * WebP provides ~30% better compression than PNG with similar quality
 * 
 * Usage:
 * npm install sharp --save-dev
 * npm run convert-wallpapers
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const WALLPAPERS_DIR = path.join(process.cwd(), "public", "branding");
const OUTPUT_DIR = path.join(process.cwd(), "public", "branding", "webp");
const QUALITY = 85; // WebP quality (0-100)

interface ConversionResult {
  original: string;
  output: string;
  originalSize: number;
  newSize: number;
  savings: number;
}

async function ensureOutputDir() {
  try {
    await fs.access(OUTPUT_DIR);
  } catch {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${OUTPUT_DIR}`);
  }
}

async function convertImage(
  inputPath: string,
  outputPath: string
): Promise<ConversionResult> {
  // Get original file size
  const originalStats = await fs.stat(inputPath);
  const originalSize = originalStats.size;

  // Convert to WebP
  await sharp(inputPath)
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outputPath);

  // Get new file size
  const newStats = await fs.stat(outputPath);
  const newSize = newStats.size;
  const savings = ((originalSize - newSize) / originalSize) * 100;

  return {
    original: path.basename(inputPath),
    output: path.basename(outputPath),
    originalSize,
    newSize,
    savings,
  };
}

async function findWallpapers(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && /\.(png|jpg|jpeg)$/i.test(entry.name)) {
        // Skip already converted files
        if (!entry.name.includes(".webp")) {
          files.push(fullPath);
        }
      }
    }
  }

  await scan(dir);
  return files;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

async function main() {
  console.log("🖼️  Converting wallpapers to WebP format...\n");

  await ensureOutputDir();

  const wallpapers = await findWallpapers(WALLPAPERS_DIR);
  console.log(`Found ${wallpapers.length} images to convert\n`);

  if (wallpapers.length === 0) {
    console.log("No PNG/JPG files found in public/branding");
    return;
  }

  const results: ConversionResult[] = [];
  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (let i = 0; i < wallpapers.length; i++) {
    const inputPath = wallpapers[i];
    const relativePath = path.relative(WALLPAPERS_DIR, inputPath);
    const outputPath = path.join(
      OUTPUT_DIR,
      relativePath.replace(/\.(png|jpg|jpeg)$/i, ".webp")
    );

    // Ensure output subdirectory exists
    const outputSubdir = path.dirname(outputPath);
    await fs.mkdir(outputSubdir, { recursive: true });

    try {
      const result = await convertImage(inputPath, outputPath);
      results.push(result);
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;

      console.log(
        `[${i + 1}/${wallpapers.length}] ${result.original} → ${result.output}`
      );
      console.log(
        `  ${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (${result.savings.toFixed(1)}% savings)\n`
      );
    } catch (error) {
      console.error(`❌ Failed to convert ${inputPath}:`, error);
    }
  }

  // Summary
  const totalSavings = ((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100;

  console.log("\n" + "=".repeat(60));
  console.log("📊 CONVERSION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total files converted: ${results.length}`);
  console.log(`Original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`New size: ${formatBytes(totalNewSize)}`);
  console.log(`Total savings: ${formatBytes(totalOriginalSize - totalNewSize)} (${totalSavings.toFixed(1)}%)`);
  console.log("\n✅ Done! WebP files saved to:", OUTPUT_DIR);
  console.log("\n💡 Next steps:");
  console.log("1. Update Wallpaper components to use .webp files");
  console.log("2. Add <picture> tags with fallbacks for old browsers");
  console.log("3. Consider lazy loading wallpapers below the fold");
}

main().catch(console.error);

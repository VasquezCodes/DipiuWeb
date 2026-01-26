import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/DipiuFotos');
const quality = 90;
const maxWidth = 2560;

if (!fs.existsSync(inputDir)) {
    console.error(`Directory not found: ${inputDir}`);
    process.exit(1);
}

const files = fs.readdirSync(inputDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));

console.log(`Found ${files.length} images. Starting optimization...`);

let savedBytes = 0;

for (const file of files) {
    const filePath = path.join(inputDir, file);
    const tempPath = path.join(inputDir, `temp_${file}`);

    try {
        const stats = fs.statSync(filePath);
        const originalSize = stats.size;

        // Process image
        await sharp(filePath)
            .resize({
                width: maxWidth,
                height: maxWidth,
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: quality }) // Convert all to high-quality JPEG (most efficient for photos)
            .toFile(tempPath);

        const newStats = fs.statSync(tempPath);
        const newSize = newStats.size;

        if (newSize < originalSize) {
            fs.renameSync(tempPath, filePath);
            savedBytes += (originalSize - newSize);
            console.log(`Optimized ${file}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024 / 1024).toFixed(2)}MB`);
        } else {
            console.log(`Skipped ${file} (no improvement)`);
            fs.unlinkSync(tempPath);
        }
    } catch (err) {
        console.error(`Error optimizing ${file}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
}

console.log(`\nOptimization complete! Total saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);

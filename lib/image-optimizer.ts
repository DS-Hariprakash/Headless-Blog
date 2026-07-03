import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadsDir = path.join(process.cwd(), 'public/uploads');

export interface ImageSize {
  width?: number;
  height?: number;
  quality?: number;
}

const imageSizes: Record<string, ImageSize> = {
  thumbnail: { width: 300, height: 300, quality: 70 },
  medium: { width: 800, height: 600, quality: 75 },
  large: { width: 1200, height: 900, quality: 80 },
  original: { quality: 85 },
};

export async function optimizeImage(
  filePath: string,
  filename: string
): Promise<string[]> {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const buffer = fs.readFileSync(filePath);
    const name = path.parse(filename).name;
    const optimizedFiles: string[] = [];

    // Generate different sizes
    for (const [sizeKey, sizeConfig] of Object.entries(imageSizes)) {
      const outputName = `${name}-${sizeKey}.webp`;
      const outputPath = path.join(uploadsDir, outputName);

      let pipeline = sharp(buffer).webp({ quality: sizeConfig.quality || 75 });

      if (sizeConfig.width && sizeConfig.height) {
        pipeline = pipeline.resize(sizeConfig.width, sizeConfig.height, {
          fit: 'cover',
          position: 'center',
        });
      }

      await pipeline.toFile(outputPath);
      optimizedFiles.push(`/uploads/${outputName}`);
    }

    // Cleanup original temp file
    fs.unlinkSync(filePath);
    return optimizedFiles;
  } catch (error) {
    console.error('Image optimization error:', error);
    throw error;
  }
}

export async function deleteImage(filename: string) {
  const imagePath = path.join(uploadsDir, filename);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
}

export function getImageUrl(filename: string, size: keyof typeof imageSizes = 'original'): string {
  const name = path.parse(filename).name;
  return `/uploads/${name}-${size}.webp`;
}

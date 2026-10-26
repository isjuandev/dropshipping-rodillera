import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_ASSETS = path.resolve('public/assets');
const SRC_ASSETS = path.resolve('src/assets');

fs.mkdirSync(PUBLIC_ASSETS, { recursive: true });
fs.mkdirSync(SRC_ASSETS, { recursive: true });

export async function processImage(sourcePath, targetName, width, height, fit = 'cover') {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Archivo no encontrado: ${sourcePath}`);
    return false;
  }

  const webpBuffer = await sharp(sourcePath)
    .resize(width, height, { fit })
    .webp({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(path.join(PUBLIC_ASSETS, `${targetName}.webp`), webpBuffer);
  fs.writeFileSync(path.join(SRC_ASSETS, `${targetName}.webp`), webpBuffer);

  // También guardar en JPG si es imagen hero o detalle
  if (targetName.includes('hero') || targetName.includes('detalle') || targetName.includes('poster')) {
    const jpgBuffer = await sharp(sourcePath)
      .resize(width, height, { fit })
      .jpeg({ quality: 90 })
      .toBuffer();
    fs.writeFileSync(path.join(PUBLIC_ASSETS, `${targetName}.jpg`), jpgBuffer);
    fs.writeFileSync(path.join(SRC_ASSETS, `${targetName}.jpg`), jpgBuffer);
  }

  console.log(`✓ Procesado y guardado: ${targetName} (${width}x${height})`);
  return true;
}

// Para ejecución directa desde CLI si se pasan argumentos: node process-generated-images.mjs <source> <targetName> <width> <height>
if (process.argv[2] && process.argv[3]) {
  const source = process.argv[2];
  const target = process.argv[3];
  const w = parseInt(process.argv[4] || '800', 10);
  const h = parseInt(process.argv[5] || '800', 10);
  processImage(source, target, w, h).catch(console.error);
}

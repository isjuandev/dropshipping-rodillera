import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execSync } from 'node:child_process';

const WIDTH = 720;
const HEIGHT = 1280;
const FPS = 30;
const TEMP_DIR = path.resolve('.temp-video-frames');

if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TEMP_DIR, { recursive: true });

// Configuración de las escenas
const scenes = [
  {
    bgImage: 'public/assets/hero-clasica.jpg',
    tag: 'SOPORTE DEPORTIVO',
    headline: 'Muévete con la rodilla firme',
    subtext: 'Compresión técnica con estabilizadores',
    durationSec: 2,
  },
  {
    bgImage: 'public/assets/detalle-gel.jpg',
    tag: 'GEL DE RÓTULA',
    headline: 'Almohadilla anatómica centrada',
    subtext: 'Amortigua y acompaña cada flexión',
    durationSec: 2,
  },
  {
    bgImage: 'public/assets/detalle-resortes.jpg',
    tag: 'ESTABILIDAD LATERAL',
    headline: 'Resortes dobles de memoria',
    subtext: 'Firmeza guiada sin limitar el movimiento',
    durationSec: 2,
  },
  {
    bgImage: 'public/assets/clasica-puesta.webp',
    tag: 'EN ACCIÓN REAL',
    headline: 'No se baja ni se enrolla',
    subtext: 'Bandas antideslizantes de silicona',
    durationSec: 2,
  },
  {
    bgImage: 'public/assets/hero-clasica.jpg',
    tag: 'PAGO CONTRAENTREGA',
    headline: 'Envío gratis a toda Colombia',
    subtext: 'Pagas en efectivo cuando te llegue',
    durationSec: 2,
  },
];

async function createFrame(scene, frameIndex, totalFramesInScene) {
  const progress = frameIndex / totalFramesInScene;
  const scale = 1 + progress * 0.06; // Efecto suave de zoom Ken Burns

  // 1. Cargar imagen de fondo y redimensionar con zoom
  const currentW = Math.round(WIDTH * scale);
  const currentH = Math.round(HEIGHT * scale);

  const bgBuffer = await sharp(scene.bgImage)
    .resize(currentW, currentH, { fit: 'cover' })
    .extract({
      left: Math.round((currentW - WIDTH) / 2),
      top: Math.round((currentH - HEIGHT) / 2),
      width: WIDTH,
      height: HEIGHT,
    })
    .toBuffer();

  // 2. Crear overlay SVG gráfico
  const svgOverlay = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
        <stop offset="35%" stop-color="#000000" stop-opacity="0.0"/>
        <stop offset="65%" stop-color="#000000" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
      </linearGradient>
    </defs>

    <!-- Gradiente cinematográfico superior e inferior -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>

    <!-- Badge Superior -->
    <g transform="translate(40, 50)">
      <rect width="240" height="42" rx="21" fill="#1489AE"/>
      <text x="120" y="27" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="900" font-size="13" letter-spacing="1.5" text-anchor="middle">
        ${scene.tag}
      </text>
    </g>

    <!-- Card Inferior con Texto -->
    <g transform="translate(40, 960)">
      <rect width="${WIDTH - 80}" height="190" rx="28" fill="#1F2933" fill-opacity="0.9" stroke="#374151" stroke-width="2"/>
      
      <text x="35" y="70" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="900" font-size="34">
        ${scene.headline}
      </text>
      
      <text x="35" y="115" fill="#94A3B8" font-family="-apple-system, sans-serif" font-weight="600" font-size="20">
        ${scene.subtext}
      </text>

      <!-- Badge de confianza -->
      <g transform="translate(35, 135)">
        <rect width="180" height="30" rx="15" fill="#16A34A"/>
        <text x="90" y="20" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="800" font-size="12" text-anchor="middle">
          ✓ CONTRAENTREGA
        </text>
      </g>
    </g>
  </svg>
  `;

  const finalBuffer = await sharp(bgBuffer)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 85 })
    .toBuffer();

  return finalBuffer;
}

async function generateAllFrames() {
  console.log('🎬 Generando frames para el video vertical de 10 segundos...');
  let globalFrameCount = 0;

  for (let sIdx = 0; sIdx < scenes.length; sIdx++) {
    const scene = scenes[sIdx];
    const totalFrames = scene.durationSec * FPS;

    for (let fIdx = 0; fIdx < totalFrames; fIdx++) {
      const frameBuf = await createFrame(scene, fIdx, totalFrames);
      const filename = `frame_${String(globalFrameCount).padStart(5, '0')}.jpg`;
      fs.writeFileSync(path.join(TEMP_DIR, filename), frameBuf);
      globalFrameCount++;
    }
    console.log(`  ✓ Escena ${sIdx + 1}/${scenes.length} renderizada (${totalFrames} frames)`);
  }

  console.log(`\n📦 Total de frames renderizados: ${globalFrameCount}`);
  console.log('🎞️ Codificando con FFmpeg a MP4...');

  const outputPath = path.resolve('public/assets/demostracion-rodillera.mp4');
  const inputPattern = path.join(TEMP_DIR, 'frame_%05d.jpg');

  const ffmpegCmd = `/opt/homebrew/bin/ffmpeg -y -framerate ${FPS} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 22 -movflags +faststart "${outputPath}"`;

  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Limpiar temporales
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log(`\n🎉 ¡Video generado con éxito en: ${outputPath}!`);
}

generateAllFrames().catch(console.error);

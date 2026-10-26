import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_ASSETS = path.resolve('public/assets');
const SRC_ASSETS = path.resolve('src/assets');

fs.mkdirSync(PUBLIC_ASSETS, { recursive: true });
fs.mkdirSync(SRC_ASSETS, { recursive: true });

async function saveImage(name, svgString, width, height) {
  const svgBuffer = Buffer.from(svgString);
  const webpBuffer = await sharp(svgBuffer).resize(width, height).webp({ quality: 90 }).toBuffer();
  
  fs.writeFileSync(path.join(PUBLIC_ASSETS, `${name}.webp`), webpBuffer);
  fs.writeFileSync(path.join(SRC_ASSETS, `${name}.webp`), webpBuffer);

  // Also write jpg if it's a hero image
  if (name.includes('hero') || name.includes('detalle')) {
    const jpgBuffer = await sharp(svgBuffer).resize(width, height).jpeg({ quality: 88 }).toBuffer();
    fs.writeFileSync(path.join(PUBLIC_ASSETS, `${name}.jpg`), jpgBuffer);
    fs.writeFileSync(path.join(SRC_ASSETS, `${name}.jpg`), jpgBuffer);
  }
}

// 1. Hero Clásica (Negra con tejido gris/blanco, gel en la rótula)
const heroClasicaSvg = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3F5F7"/>
      <stop offset="100%" stop-color="#E2E6EA"/>
    </linearGradient>
    <linearGradient id="sleeve" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D3748"/>
      <stop offset="50%" stop-color="#1F2933"/>
      <stop offset="100%" stop-color="#0B0F14"/>
    </linearGradient>
    <radialGradient id="gelGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1489AE" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#1489AE" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#1489AE" stop-opacity="0.1"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  
  <!-- Subtle tech grid -->
  <circle cx="400" cy="400" r="320" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="6,6"/>
  <circle cx="400" cy="400" r="260" fill="none" stroke="#CBD5E1" stroke-width="1"/>

  <!-- Knee Sleeve Silhouette (Black / Graphite) -->
  <path d="M 310,140 Q 400,125 490,140 Q 520,380 470,660 Q 400,675 330,660 Q 280,380 310,140 Z" fill="url(#sleeve)" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.25))"/>
  
  <!-- Top band with grip pattern -->
  <path d="M 312,145 Q 400,132 488,145 L 485,185 Q 400,172 315,185 Z" fill="#1489AE" opacity="0.9"/>
  <path d="M 320,165 Q 400,155 480,165" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- Side spring stabilizers indicator (Teal) -->
  <path d="M 305,260 Q 285,400 325,540" fill="none" stroke="#1489AE" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
  <path d="M 495,260 Q 515,400 475,540" fill="none" stroke="#1489AE" stroke-width="8" stroke-linecap="round" opacity="0.9"/>

  <!-- Patella Gel Ring (Centered) -->
  <ellipse cx="400" cy="390" rx="65" ry="85" fill="none" stroke="url(#gelGlow)" stroke-width="26"/>
  <ellipse cx="400" cy="390" rx="42" ry="58" fill="#1F2933" stroke="#1489AE" stroke-width="4"/>
  <circle cx="400" cy="390" r="22" fill="#1489AE" opacity="0.25"/>

  <!-- Knit texture lines (Horizontal) -->
  <path d="M 345,300 Q 400,320 455,300" stroke="#94A3B8" stroke-width="2.5" fill="none" opacity="0.5"/>
  <path d="M 340,325 Q 400,345 460,325" stroke="#94A3B8" stroke-width="2.5" fill="none" opacity="0.5"/>
  <path d="M 350,470 Q 400,450 450,470" stroke="#94A3B8" stroke-width="2.5" fill="none" opacity="0.5"/>
  <path d="M 355,500 Q 400,480 445,500" stroke="#94A3B8" stroke-width="2.5" fill="none" opacity="0.5"/>

  <!-- Badge Tag -->
  <g transform="translate(60, 60)">
    <rect width="200" height="44" rx="22" fill="#1F2933"/>
    <text x="100" y="27" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="16" text-anchor="middle">EDICIÓN CLÁSICA</text>
  </g>
</svg>`;

// 2. Hero Pro (Blanca/Gris con ajuste giratorio)
const heroProSvg = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgPro" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="sleevePro" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bgPro)"/>
  
  <circle cx="400" cy="400" r="320" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="6,6"/>

  <!-- Sleeve Silhouette (White/Silver) -->
  <path d="M 310,140 Q 400,125 490,140 Q 520,380 470,660 Q 400,675 330,660 Q 280,380 310,140 Z" fill="url(#sleevePro)" stroke="#94A3B8" stroke-width="2" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.15))"/>
  
  <!-- Rotary Dial Knob on upper lateral side -->
  <g transform="translate(260, 220)">
    <circle cx="40" cy="40" r="38" fill="#1F2933" stroke="#1489AE" stroke-width="4"/>
    <circle cx="40" cy="40" r="26" fill="#334155"/>
    <!-- Dial arrows -->
    <path d="M 30,40 L 50,40 M 45,33 L 52,40 L 45,47" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="40" y="58" fill="#FFFFFF" font-family="sans-serif" font-size="9" font-weight="700" text-anchor="middle">GIRO</text>
  </g>

  <!-- Tension Cords from Dial -->
  <path d="M 298,245 Q 360,260 410,250" stroke="#1489AE" stroke-width="3" fill="none"/>
  <path d="M 295,260 Q 360,290 415,280" stroke="#1489AE" stroke-width="3" fill="none"/>

  <!-- Patella Support Ring -->
  <ellipse cx="400" cy="390" rx="65" ry="85" fill="none" stroke="#1489AE" stroke-width="22" opacity="0.85"/>
  <ellipse cx="400" cy="390" rx="42" ry="58" fill="#F1F5F9" stroke="#0284C7" stroke-width="3"/>

  <!-- Side Stabilizer -->
  <path d="M 495,260 Q 515,400 475,540" fill="none" stroke="#64748B" stroke-width="7" stroke-linecap="round"/>

  <!-- Badge Tag -->
  <g transform="translate(60, 60)">
    <rect width="240" height="44" rx="22" fill="#1489AE"/>
    <text x="120" y="27" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="16" text-anchor="middle">EDICIÓN PRO · DIAL</text>
  </g>
</svg>`;

// 3. Side & Action views
function createKneeViewSvg(title, subtitle, colorScheme = 'clasica') {
  const isDark = colorScheme === 'clasica';
  return `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#F1F5F9"/>
  <rect x="60" y="60" width="680" height="680" rx="28" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3"/>
  
  <g transform="translate(400, 370)">
    <!-- Leg outline -->
    <path d="M -110,-240 Q -80,0 -120,240 L 120,240 Q 80,0 110,-240 Z" fill="#E2E8F0" opacity="0.6"/>
    <!-- Sleeve -->
    <path d="M -90,-160 Q 0,-180 90,-160 L 80,160 Q 0,180 -80,160 Z" fill="${isDark ? '#1F2933' : '#E2E8F0'}" stroke="#1489AE" stroke-width="4"/>
    <circle cx="0" cy="0" r="45" fill="none" stroke="#1489AE" stroke-width="12"/>
  </g>

  <rect x="100" y="600" width="600" height="90" rx="16" fill="#1F2933"/>
  <text x="400" y="640" fill="#FFFFFF" font-family="sans-serif" font-size="22" font-weight="700" text-anchor="middle">${title}</text>
  <text x="400" y="670" fill="#94A3B8" font-family="sans-serif" font-size="16" text-anchor="middle">${subtitle}</text>
</svg>`;
}

// 4. Detail Close-ups (Gel, Springs, Knit, Grips, etc.)
function createDetailSvg(title, description, iconType) {
  return `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="detBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#detBg)"/>
  <circle cx="300" cy="250" r="170" fill="#1F2933" stroke="#1489AE" stroke-width="8"/>
  
  ${iconType === 'gel' ? `
    <!-- Gel Pad Illustration -->
    <ellipse cx="300" cy="250" rx="110" ry="130" fill="none" stroke="#1489AE" stroke-width="32" opacity="0.9"/>
    <ellipse cx="300" cy="250" rx="70" ry="90" fill="#0B0F14" stroke="#38BDF8" stroke-width="4"/>
    <circle cx="300" cy="250" r="30" fill="#1489AE" opacity="0.5"/>
  ` : iconType === 'resortes' ? `
    <!-- Dual Spring Stabilizers -->
    <path d="M 240,130 Q 220,250 240,370" fill="none" stroke="#38BDF8" stroke-width="14" stroke-linecap="round"/>
    <path d="M 280,130 Q 260,250 280,370" fill="none" stroke="#94A3B8" stroke-width="14" stroke-linecap="round"/>
    <path d="M 320,130 Q 300,250 320,370" fill="none" stroke="#94A3B8" stroke-width="14" stroke-linecap="round"/>
    <path d="M 360,130 Q 340,250 360,370" fill="none" stroke="#38BDF8" stroke-width="14" stroke-linecap="round"/>
  ` : iconType === 'perilla' ? `
    <!-- Rotary Dial -->
    <circle cx="300" cy="250" r="95" fill="#334155" stroke="#38BDF8" stroke-width="10"/>
    <circle cx="300" cy="250" r="60" fill="#0F172A"/>
    <path d="M 270,250 L 330,250 M 320,235 L 335,250 L 320,265" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
  ` : iconType === 'tiras' ? `
    <!-- Wavy Silicone Gel Strips -->
    <path d="M 180,210 Q 240,190 300,210 T 420,210" fill="none" stroke="#1489AE" stroke-width="14" stroke-linecap="round"/>
    <path d="M 180,250 Q 240,230 300,250 T 420,250" fill="none" stroke="#38BDF8" stroke-width="14" stroke-linecap="round"/>
    <path d="M 180,290 Q 240,270 300,290 T 420,290" fill="none" stroke="#1489AE" stroke-width="14" stroke-linecap="round"/>
  ` : `
    <!-- Air Knit / Knit Mesh -->
    <g stroke="#38BDF8" stroke-width="4" opacity="0.8">
      <path d="M 180,180 L 420,180 M 180,220 L 420,220 M 180,260 L 420,260 M 180,300 L 420,300 M 180,340 L 420,340"/>
      <path d="M 220,150 L 220,360 M 260,150 L 260,360 M 300,150 L 300,360 M 340,150 L 340,360 M 380,150 L 380,360"/>
    </g>
  `}

  <text x="300" y="475" fill="#0B0F14" font-family="sans-serif" font-size="24" font-weight="800" text-anchor="middle">${title}</text>
  <text x="300" y="515" fill="#5B6470" font-family="sans-serif" font-size="16" text-anchor="middle">${description}</text>
</svg>`;
}

// 5. Anatomy base graphics (Clásica & Pro)
function createAnatomySvg(isPro = false) {
  return `
<svg width="900" height="1100" viewBox="0 0 900 1100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="anBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </radialGradient>
    <linearGradient id="anSleeve" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${isPro ? '#F8FAFC' : '#2D3748'}"/>
      <stop offset="50%" stop-color="${isPro ? '#E2E8F0' : '#1F2933'}"/>
      <stop offset="100%" stop-color="${isPro ? '#CBD5E1' : '#0B0F14'}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1100" fill="url(#anBg)"/>

  <!-- Leg Silhouette -->
  <path d="M 250,50 Q 320,550 260,1050 L 640,1050 Q 580,550 650,50 Z" fill="#E2E6EA" opacity="0.6"/>

  <!-- Sleeve Body -->
  <path d="M 270,180 Q 450,155 630,180 Q 660,540 600,940 Q 450,965 300,940 Q 240,540 270,180 Z" 
        fill="url(#anSleeve)" stroke="${isPro ? '#94A3B8' : '#1489AE'}" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.2))"/>

  <!-- Top band -->
  <path d="M 272,185 Q 450,165 628,185 L 624,240 Q 450,220 276,240 Z" fill="#1489AE" opacity="0.9"/>
  <path d="M 285,210 Q 450,195 615,210" stroke="#FFFFFF" stroke-width="4" fill="none"/>

  <!-- Side Stabilizers -->
  <path d="M 265,340 Q 240,540 285,740" fill="none" stroke="#1489AE" stroke-width="12" stroke-linecap="round"/>
  <path d="M 635,340 Q 660,540 615,740" fill="none" stroke="#1489AE" stroke-width="12" stroke-linecap="round"/>

  <!-- Patella Gel Ring -->
  <ellipse cx="450" cy="540" rx="95" ry="125" fill="none" stroke="#1489AE" stroke-width="34" opacity="0.9"/>
  <ellipse cx="450" cy="540" rx="60" ry="85" fill="${isPro ? '#FFFFFF' : '#1F2933'}" stroke="#38BDF8" stroke-width="6"/>

  ${isPro ? `
    <!-- Rotary Dial on Pro -->
    <g transform="translate(210, 310)">
      <circle cx="50" cy="50" r="48" fill="#1F2933" stroke="#1489AE" stroke-width="6"/>
      <circle cx="50" cy="50" r="32" fill="#38BDF8"/>
      <path d="M 38,50 L 62,50 M 56,42 L 64,50 L 56,58" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    </g>
  ` : ''}

  <!-- Knit pattern lines -->
  <path d="M 370,420 Q 450,450 530,420" stroke="#94A3B8" stroke-width="3.5" fill="none" opacity="0.6"/>
  <path d="M 370,660 Q 450,630 530,660" stroke="#94A3B8" stroke-width="3.5" fill="none" opacity="0.6"/>
</svg>`;
}

// 6. Activity cards (Correr, Fútbol, Gimnasio, Ciclismo, Caminar, Trabajo de pie)
function createActivitySvg(activityTitle, subtitle) {
  return `
<svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="actBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F2933"/>
      <stop offset="100%" stop-color="#0B0F14"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#actBg)"/>
  
  <!-- Subtle athletic glow -->
  <circle cx="300" cy="180" r="140" fill="#1489AE" opacity="0.25"/>
  <circle cx="300" cy="180" r="80" fill="#1489AE" opacity="0.3"/>

  <!-- Center Icon Representation -->
  <g transform="translate(300, 180) scale(1.6)">
    <circle cx="0" cy="0" r="36" fill="#1489AE" stroke="#38BDF8" stroke-width="3"/>
    <text x="0" y="8" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="24" text-anchor="middle">⚡</text>
  </g>

  <rect x="40" y="310" width="520" height="100" rx="16" fill="#1F2933" stroke="#374151" stroke-width="1.5"/>
  <text x="300" y="350" fill="#FFFFFF" font-family="sans-serif" font-size="24" font-weight="800" text-anchor="middle">${activityTitle}</text>
  <text x="300" y="385" fill="#94A3B8" font-family="sans-serif" font-size="16" text-anchor="middle">${subtitle}</text>
</svg>`;
}

// 7. Measurement guide
const guiaMedicionSvg = `
<svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="500" fill="#FFFFFF"/>
  <rect x="20" y="20" width="560" height="460" rx="20" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
  
  <!-- Extended Leg Silhouette -->
  <path d="M 230,60 Q 280,250 250,440 L 350,440 Q 320,250 370,60 Z" fill="#CBD5E1"/>
  
  <!-- Patella marker -->
  <ellipse cx="300" cy="240" rx="28" ry="34" fill="#1489AE" opacity="0.4"/>
  <circle cx="300" cy="240" r="8" fill="#1489AE"/>

  <!-- Measuring Tape Ring around Patella -->
  <path d="M 200,240 Q 300,215 400,240 Q 300,265 200,240 Z" fill="#F97316" stroke="#C2410C" stroke-width="4"/>
  
  <!-- Callout line and measurement text -->
  <line x1="400" y1="240" x2="480" y2="200" stroke="#1489AE" stroke-width="3" stroke-dasharray="4,4"/>
  <circle cx="480" cy="200" r="6" fill="#1489AE"/>
  <rect x="420" y="140" width="150" height="50" rx="10" fill="#1F2933"/>
  <text x="495" y="172" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Centro de rótula</text>

  <text x="300" y="400" fill="#0B0F14" font-family="sans-serif" font-size="20" font-weight="800" text-anchor="middle">Mide con la pierna extendida</text>
  <text x="300" y="430" fill="#5B6470" font-family="sans-serif" font-size="15" text-anchor="middle">Pasa la cinta métrica por el centro de la rodilla</text>
</svg>`;

// 8. Steps (paso 1, 2, 3)
function createPasoSvg(numero, titulo, detalle) {
  return `
<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#FFFFFF"/>
  <rect x="15" y="15" width="570" height="370" rx="20" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
  
  <circle cx="300" cy="140" r="65" fill="#1489AE"/>
  <text x="300" y="162" fill="#FFFFFF" font-family="sans-serif" font-size="60" font-weight="900" text-anchor="middle">${numero}</text>
  
  <text x="300" y="270" fill="#0B0F14" font-family="sans-serif" font-size="24" font-weight="800" text-anchor="middle">${titulo}</text>
  <text x="300" y="310" fill="#5B6470" font-family="sans-serif" font-size="16" text-anchor="middle">${detalle}</text>
</svg>`;
}

// 9. Video poster
const videoPosterSvg = `
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="1280" fill="#0B0F14"/>
  <circle cx="360" cy="560" r="300" fill="#1489AE" opacity="0.2"/>
  
  <!-- Play button symbol -->
  <circle cx="360" cy="600" r="65" fill="#F97316"/>
  <polygon points="345,570 345,630 395,600" fill="#0B0F14"/>
  
  <text x="360" y="730" fill="#FFFFFF" font-family="sans-serif" font-size="32" font-weight="800" text-anchor="middle">Demostración en video</text>
  <text x="360" y="775" fill="#94A3B8" font-family="sans-serif" font-size="20" text-anchor="middle">Mira cómo se ajusta y cómo responde en movimiento</text>
</svg>`;

// 10. Avatar placeholders
function createAvatarSvg(iniciales, bgCol) {
  return `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" fill="${bgCol}"/>
  <text x="100" y="118" fill="#FFFFFF" font-family="sans-serif" font-size="44" font-weight="800" text-anchor="middle">${iniciales}</text>
</svg>`;
}

async function run() {
  console.log('Generando imágenes placeholder...');
  await saveImage('hero-clasica', heroClasicaSvg, 800, 800);
  await saveImage('hero-pro', heroProSvg, 800, 800);
  
  await saveImage('clasica-lateral', createKneeViewSvg('Vista Lateral', 'Estabilizadores de resorte a cada lado', 'clasica'), 800, 800);
  await saveImage('clasica-puesta', createKneeViewSvg('Puesta en Movimiento', 'Soporte activo en carrera y trote', 'clasica'), 800, 800);
  
  await saveImage('pro-lateral', createKneeViewSvg('Edición Pro Lateral', 'Sistema de cordones de alta tracción', 'pro'), 800, 800);
  await saveImage('pro-puesta', createKneeViewSvg('Edición Pro en Acción', 'Compresión milimétrica personalizable', 'pro'), 800, 800);
  await saveImage('pro-perilla', createDetailSvg('Perilla Giratoria', 'Ajuste rápido de compresión', 'perilla'), 600, 600);

  await saveImage('detalle-gel', createDetailSvg('Almohadilla de Gel', 'Amortigua y centra la rótula', 'gel'), 600, 600);
  await saveImage('detalle-resortes', createDetailSvg('Resortes Laterales', 'Firmeza y estabilidad en flexión', 'resortes'), 600, 600);
  await saveImage('detalle-cinta', createDetailSvg('Cinta Elástica Interior', 'Ajuste suave sin presionar de más', 'cinta'), 600, 600);
  await saveImage('detalle-tiras', createDetailSvg('Tiras de Gel Antideslizantes', 'Doble hilera de silicona ondulada', 'tiras'), 600, 600);
  await saveImage('detalle-tejido', createDetailSvg('Tejido Air Knit', 'Transpirable y de secado rápido', 'knit'), 600, 600);
  await saveImage('detalle-horizontal', createDetailSvg('Tejido Horizontal', 'Flexibilidad anatómica sin pliegues', 'knit'), 600, 600);

  await saveImage('anatomia-clasica', createAnatomySvg(false), 900, 1100);
  await saveImage('anatomia-pro', createAnatomySvg(true), 900, 1100);

  await saveImage('actividad-correr', createActivitySvg('Correr y Trote', 'Compresión continua que acompaña tu zancada', 'correr'), 600, 450);
  await saveImage('actividad-futbol', createActivitySvg('Fútbol y Cancha', 'Firmeza lateral en giros rápidos y cambios de ritmo', 'futbol'), 600, 450);
  await saveImage('actividad-gym', createActivitySvg('Gimnasio y Pesas', 'Estabilidad centrada en sentadillas y prensa', 'gym'), 600, 450);
  await saveImage('actividad-ciclismo', createActivitySvg('Ciclismo y Ruta', 'Tejido transpirable para trayectos largos y pedaleo fluido', 'ciclismo'), 600, 450);
  await saveImage('actividad-caminar', createActivitySvg('Caminar y Escaleras', 'Soporte constante al subir, bajar y dar largas caminatas', 'caminar'), 600, 450);
  await saveImage('actividad-trabajo', createActivitySvg('Trabajo de Pie', 'Comodidad durante jornadas continuas de pie o en bodega', 'trabajo'), 600, 450);

  await saveImage('guia-medicion', guiaMedicionSvg, 600, 500);

  await saveImage('paso-1', createPasoSvg('1', 'Mide tu talla', 'Pasa la cinta por el centro de la rótula con la pierna estirada.'), 600, 400);
  await saveImage('paso-2', createPasoSvg('2', 'Desliza y centra', 'Sube la rodillera hasta que la almohadilla de gel abrace la rótula.'), 600, 400);
  await saveImage('paso-3', createPasoSvg('3', 'Ajusta y muévete', 'Comprueba la comodidad y disfruta de soporte firme en tu actividad.'), 600, 400);

  await saveImage('video-poster', videoPosterSvg, 720, 1280);

  await saveImage('avatar-1', createAvatarSvg('CR', '#1489AE'), 200, 200);
  await saveImage('avatar-2', createAvatarSvg('MP', '#1F2933'), 200, 200);
  await saveImage('avatar-3', createAvatarSvg('AC', '#0D9488'), 200, 200);
  await saveImage('avatar-4', createAvatarSvg('GM', '#6366F1'), 200, 200);
  await saveImage('avatar-5', createAvatarSvg('JM', '#F97316'), 200, 200);
  await saveImage('avatar-6', createAvatarSvg('PS', '#0284C7'), 200, 200);

  console.log('¡Todas las imágenes placeholder generadas con éxito!');
}

run().catch(console.error);

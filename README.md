# ViralyShop · Landing de Rodillera Deportiva de Compresión (Contraentrega Colombia)

Landing page de producto único de alto rendimiento y optimización de tasa de conversión (CRO) para comercio electrónico contraentrega en Colombia, conectada directamente a la API pública de **NexoBite Dropshipping SaaS** (sin intermediación de pasarela bancaria tradicional ni WhatsApp como canal de pedido).

---

## ⚡ Características Principales

- **Arquitectura SSG Pura:** Desarrollado con **Astro 5**, **Tailwind CSS v4** (`@tailwindcss/vite`) y micro-islas reactivas en **Preact** (`@preact/signals`). Cero dependencias de servidor (100 % estático en CDN).
- **Checkout Contraentrega Directo:** Formulario directo en el cliente con validación en tiempo real (`zod`), honeypot antispam, temporizador mínimo de llenado, soporte DIVIPOLA del DANE (32 departamentos + Bogotá D.C.) cargado bajo demanda (`import()` dinámico), y envío con `fetch` POST directo a NexoBite con timeout de 15 s.
- **CRO & Reglas de Copy:** Copy enfocado en soporte, compresión, estabilidad y confianza para moverse. Cero promesas médicas o palabras prohibidas. Aviso legal visible en sección de producto, FAQ y footer.
- **Rendimiento:** Puntuaciones Lighthouse ≥ 95 en las 4 categorías, LCP optimizado con precarga y WebP/AVIF, fuentes autohospedadas (`Archivo Variable` e `Inter Variable`), JS cliente total < 40 KB gzip sin contar municipios.
- **Accesibilidad WCAG AA:** Anillos de foco en color teal, navegación por teclado en galería y anatomía, diálogo modal con trampa de foco nativa.
- **Contenido Multidimensional:** Galería scroll-snap sin JS, video de demostración vertical (720x1280 MP4, H.264), anatomía interactiva con popovers adaptables, recomendador de tallas en vivo y tabla comparativa.

---

## 🚀 Requisitos y Configuración Rápida

### Requisitos
- **Node.js:** v20+ o v22+ (verificado en v26)
- **pnpm:** v9+ o v10+

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/isjuandev/dropshipping-rodillera.git
cd dropshipping-rodillera

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar servidor de desarrollo local
pnpm dev
```

El sitio estará disponible en `http://localhost:4321`.

---

## ⚙️ Variables de Entorno (.env)

El archivo `.env` es validado estrictamente en tiempo de compilación con Zod en [`src/lib/env.ts`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/lib/env.ts). Si falta alguna variable obligatoria, el comando `pnpm build` informará el error de inmediato.

| Variable | Requerida | Descripción | Ejemplo / Valor por defecto |
| :--- | :---: | :--- | :--- |
| `PUBLIC_NEXOBITE_API_URL` | Sí | Endpoint público de leads de NexoBite | `https://api.nexobite.com/api/v1/public/dropshipping/[campaignSlug]/leads` |
| `PUBLIC_NEXOBITE_PRODUCT_ID` | Sí | ID numérico del producto en Dropi/NexoBite (Clásica) | `2243235` |
| `PUBLIC_NEXOBITE_PRODUCT_ID_PRO` | Condicional | ID numérico del modelo Pro (si `modeloPro.activo` es true) | `2243236` |
| `PUBLIC_NEXOBITE_CAMPAIGN_SLUG` | Sí | Slug de la campaña activa en NexoBite | `campana-rodillera-viraly` |
| `PUBLIC_DOMINIO` | No | URL canónica para SEO, Open Graph y sitemap | `https://viralyshop.co` |
| `PUBLIC_GTM_ID` | No | ID del contenedor de Google Tag Manager | `GTM-XXXXXXX` |
| `PUBLIC_PIXEL_ID` | No | ID del Meta Pixel para tracking de eventos | `123456789012345` |

---

## 📦 Estructura del Proyecto

```text
dropshipping-rodillera/
├── public/
│   ├── assets/              # Imágenes optimizadas WebP/JPG y video MP4
│   └── favicon.svg          # Favicon corporativo
├── scripts/
│   ├── generate-placeholders.mjs   # Generador de placeholders SVG vectoriales
│   ├── generate-video.mjs          # Generador de video comercial vertical con FFmpeg
│   ├── process-generated-images.mjs# Procesador y conversor de imágenes a WebP
│   ├── test-pedido.mjs             # Prueba de envío de payload a NexoBite
│   └── test-unit.mjs               # Pruebas unitarias de CRO y lógica de negocio
├── src/
│   ├── assets/              # Copia de assets para importaciones de Astro
│   ├── components/
│   │   ├── islas/           # Componentes interactivos Preact (Signals)
│   │   │   ├── OrderForm.tsx       # Formulario contraentrega completo
│   │   │   ├── OrderSelector.tsx   # Selector de modelo, paquete y tallas
│   │   │   ├── PackSelector.tsx    # Tarjetas de selección de paquetes (1, 2, 4 uds)
│   │   │   ├── ProductAnatomy.tsx  # Anatomía interactiva con puntos tocables
│   │   │   ├── SizeFinder.tsx      # Calculadora de talla y tabla comparativa
│   │   │   └── StickyBar.tsx       # Barra fija flotante inferior para móvil
│   │   └── secciones/       # Secciones en Astro puro (cero JS innecesario)
│   │       ├── Activities.astro    # 6 tarjetas por actividad física/laboral
│   │       ├── AnatomySection.astro# Contenedor de la sección de anatomía
│   │       ├── AnnouncementBar.astro# Barra superior de beneficios
│   │       ├── ComparisonTable.astro# Tabla comparativa vs rodillera común y venda
│   │       ├── Faq.astro           # Preguntas frecuentes con <details> y JSON-LD
│   │       ├── FinalCta.astro      # Bloque de llamada a la acción final
│   │       ├── Footer.astro        # Pie de página y enlaces legales
│   │       ├── Header.astro        # Encabezado minimalista con anclaje
│   │       ├── Hero.astro          # Hero con galería scroll-snap y video
│   │       ├── HowToWear.astro     # 3 pasos para colocarse la rodillera
│   │       ├── OrderSection.astro  # Sección ancla #pedido
│   │       ├── PacksSection.astro  # Sección de paquetes de ahorro
│   │       ├── Testimonials.astro  # Resumen 4.8★ y 6 testimonios colombianos
│   │       ├── TrustStrip.astro    # Franja de 4 garantías de compra
│   │       └── Warranty.astro      # Garantía 30 días y cambio de talla gratis
│   ├── config/
│   │   └── tienda.ts        # Configuración general: precios, textos, NIT, garantías
│   ├── content/             # Datos gestionados con Content Collections de Astro
│   │   ├── faqs.json        # 8 preguntas y respuestas frecuentes
│   │   ├── producto.json    # Modelos, características, paquetes y medidas
│   │   └── testimonios.json # Reseñas de clientes verificados
│   ├── data/
│   │   └── colombia.json    # DIVIPOLA DANE (32 departamentos + Bogotá D.C.)
│   ├── layouts/
│   │   └── Base.astro       # Layout HTML con Open Graph, Schema.org y scripts
│   ├── lib/
│   │   ├── env.ts           # Validación de variables de entorno con Zod
│   │   ├── pedido-schema.ts # Esquema del formulario y contrato de NexoBite
│   │   └── store.ts         # Señales reactivas globales (@preact/signals)
│   ├── pages/
│   │   ├── cambios-y-devoluciones.astro # Política Ley 1480 de 2011
│   │   ├── envios.astro     # Tiempos de entrega y transportadoras
│   │   ├── gracias.astro    # Página de confirmación y disparo de Lead
│   │   ├── index.astro      # Landing page principal
│   │   ├── privacidad.astro # Tratamiento de datos Ley 1581 de 2012
│   │   ├── robots.txt.ts    # Endpoint dinámico de robots.txt
│   │   └── terminos.astro   # Términos y condiciones del servicio
│   └── styles/
│       └── global.css       # Tailwind CSS v4 con tokens en @theme
├── astro.config.mjs         # Configuración SSG, sitemap y plugins Vite
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

---

## 🧪 Scripts y Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia el entorno de desarrollo local con recarga rápida |
| `pnpm build` | Ejecuta verificación estricta de TypeScript (`astro check`) y compila el sitio estático en `dist/` |
| `pnpm preview` | Sirve localmente los archivos estáticos generados en `dist/` para pruebas pre-despliegue |
| `pnpm test:pedido` | Envía un pedido de prueba estructurado al endpoint de NexoBite validando el contrato |
| `node --experimental-strip-types scripts/test-unit.mjs` | Ejecuta la suite de pruebas unitarias de CRO, límites de tallas y generador de ID |
| `pnpm video:generate` | Renderiza y codifica el video vertical publicitario en MP4 usando FFmpeg |

---

## 🔌 Integración con la API Pública de NexoBite

El formulario en [`src/components/islas/OrderForm.tsx`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/components/islas/OrderForm.tsx) realiza un envío directo `fetch` POST desde el navegador del cliente hacia `PUBLIC_NEXOBITE_API_URL` sin servidores intermedios:

### Contrato del Payload
```json
{
  "pedidoId": "PED-20261026-7KQ4",
  "fecha": "2026-10-26T15:15:00.000Z",
  "tienda": "ViralyShop",
  "landing": "https://viralyshop.co/rodillera-flexiknee",
  "campaignSlug": "campana-rodillera-viraly",
  "producto": {
    "providerProductId": "2243235",
    "nombre": "FlexiKnee Clásica · Par",
    "sku": "FLX-CLA",
    "variante": "Clásica · Tallas: M, L",
    "paquete": "Par",
    "cantidad": 2,
    "extras": [],
    "precioUnitario": 59950,
    "total": 119900
  },
  "cliente": {
    "nombreCompleto": "Ana Restrepo",
    "celular": "+573001234567",
    "departamento": "Antioquia",
    "ciudad": "Medellín",
    "direccion": "Calle 45 #12-30, apto 302",
    "indicaciones": "Entregar después de las 2 p. m."
  },
  "consentimiento": true,
  "origen": {
    "utm_source": "meta",
    "utm_medium": "cpc",
    "utm_campaign": "rodillera_conversiones",
    "utm_content": "video_1",
    "fbclid": "IwAR...",
    "referrer": "https://facebook.com/",
    "fbp": "fb.1.1730000000000.1234567890",
    "fbc": "fb.1.1730000000000.IwAR..."
  },
  "antispam": {
    "empresa": "",
    "segundos": 24
  }
}
```

### Respuestas de la API y Comportamiento CRO
- **HTTP 200 / 201:** Limpia el borrador local, persiste `ultimo_pedido_resumen` y redirige a `/gracias?id=PED-...`.
- **Duplicado (`duplicate: true`):** Mantiene los datos en el formulario y muestra un mensaje indicando que ya existe un pedido en curso, sin redirigir ni disparar conversiones falsas.
- **HTTP 429 (Límite de tasa):** Bloquea el botón de envío durante 60 segundos con cuenta regresiva visible.
- **HTTP 404 / 422 o Error de Red:** Muestra un mensaje amigable con botón de reintento (manteniendo el mismo `pedidoId` y todos los datos digitados) y un enlace a WhatsApp de soporte técnico prellenado.

---

## 📊 Medición y Analítica

El sitio respeta la privacidad del usuario y solo inicializa scripts de analítica si las variables correspondientes están presentes:

1. **Google Tag Manager (`PUBLIC_GTM_ID`):**
   - Dispara `begin_checkout` en el primer foco de cualquier campo del formulario contraentrega.
   - Dispara `generate_lead` una única vez por `pedidoId` en la página `/gracias`.
2. **Meta Pixel (`PUBLIC_PIXEL_ID`):**
   - Dispara `InitiateCheckout` al interactuar con el formulario.
   - Dispara `Lead` con deduplicación mediante `eventID: pedidoId` en `/gracias`.
   - Lee las cookies `_fbp` y `_fbc` del navegador y las adjunta en el payload para optimizar el **Meta Conversions API (CAPI)** desde NexoBite.

---

## 🛠️ Guía de Personalización

### 1. Cambiar Precios y Descuentos
Modifica los valores en [`src/lib/store.ts`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/lib/store.ts) en las constantes `PACKS_DATA` y `PRECIOS_ANTERIORES`, y en [`src/content/producto.json`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/content/producto.json).

### 2. Calibrar Tallas y Rangos en Centímetros
Ajusta la función `recomendarTalla(cm)` en [`src/lib/store.ts`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/lib/store.ts):
```ts
export function recomendarTalla(cm: number): TallaId {
  if (cm < 33) return 'S';
  if (cm < 36) return 'M';
  if (cm < 40) return 'L';
  return 'XL';
}
```
*(Regla CRO: en los límites exactos como 33 cm o 40 cm, siempre se recomienda la talla mayor para garantizar comodidad).*

### 3. Activar o Desactivar la Variante Pro
En [`src/config/tienda.ts`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/config/tienda.ts):
```ts
modeloPro: {
  activo: false, // Desactiva la variante Pro y muestra únicamente la Clásica
}
```

### 4. Reemplazar Imágenes y Video
Las imágenes se encuentran en `public/assets/` y `src/assets/`. Puedes sustituirlas respetando los siguientes tamaños recomendados:

| Archivo | Dimensión recomendada | Uso en la landing |
| :--- | :--- | :--- |
| `hero-clasica.webp` | 800 × 800 px | Foto principal de frente (Clásica) |
| `hero-pro.webp` | 800 × 800 px | Foto principal de frente (Pro con perilla) |
| `clasica-lateral.webp` | 800 × 800 px | Vista de perfil lateral con resortes |
| `clasica-puesta.webp` | 800 × 800 px | Rodillera puesta en movimiento |
| `pro-lateral.webp` | 800 × 800 px | Vista lateral Pro con cordones tensores |
| `pro-puesta.webp` | 800 × 800 px | Modelo Pro en entrenamiento de gimnasio |
| `detalle-gel.webp` | 600 × 600 px | Macro de la almohadilla de silicona en rótula |
| `detalle-resortes.webp` | 600 × 600 px | Macro de los resortes dobles flexibles |
| `detalle-tiras.webp` | 600 × 600 px | Macro de tiras onduladas antideslizantes |
| `detalle-tejido.webp` | 600 × 600 px | Macro del tejido transpirable air-knit |
| `pro-perilla.webp` | 600 × 600 px | Macro del dial giratorio Pro |
| `guia-medicion.webp` | 600 × 500 px | Ilustración de medición sobre la rótula |
| `demostracion-rodillera.mp4` | 720 × 1280 px | Video vertical de demostración (10 s) |

---

## 🚢 Despliegue en Producción

El proyecto compila a HTML estático en la carpeta `dist/`. No requiere Node.js en tiempo de ejecución.

### Despliegue en Vercel
1. Conecta el repositorio de GitHub en el panel de Vercel.
2. Framework preset: **Astro**.
3. Build command: `pnpm build`.
4. Output directory: `dist`.
5. Agrega las variables de entorno (`PUBLIC_NEXOBITE_*`) en *Settings > Environment Variables*.

### Despliegue en Cloudflare Pages
1. Crea una nueva aplicación en **Cloudflare Pages** conectada al repositorio.
2. Build command: `pnpm build`.
3. Output directory: `dist`.
4. Configura las variables de entorno en la sección *Settings > Variables and Secrets*.

### Despliegue en Netlify
1. Conecta el repositorio en Netlify.
2. Build command: `pnpm build`.
3. Publish directory: `dist`.
4. Añade las variables de entorno en *Site Configuration > Environment Variables*.

---

## ⚖️ Cumplimiento Legal en Colombia

- **Ley 1480 de 2011 (Estatuto del Consumidor):** Garantía legal de 30 días calendario y derecho de retracto de 5 días hábiles formalizado en [`/cambios-y-devoluciones`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/pages/cambios-y-devoluciones.astro).
- **Ley 1581 de 2012 (Habeas Data):** Casilla obligatoria desmarcada con consentimiento expreso antes del envío del formulario, detallado en [`/privacidad`](file:///Users/isjuandev/Documents/Dropshipping/dropshipping-rodillera/src/pages/privacidad.astro).
- **Aviso Deportivo de Salud:** Inclusión en Hero, FAQ y Footer de la advertencia obligatoria de que el producto no sustituye el diagnóstico ni el tratamiento médico.

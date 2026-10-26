# ViralyShop · Landing de Rodillera Deportiva de Compresión (Contraentrega Colombia)

Landing page de producto único de alto rendimiento y optimización de tasa de conversión (CRO) para comercio electrónico contraentrega en Colombia, conectada directamente a la API pública de **NexoBite Dropshipping SaaS** (sin intermediación de checkout tradicional ni WhatsApp para toma de órdenes).

---

## ⚡ Características Principales

- **Arquitectura SSG Pura:** Desarrollado con **Astro 5**, **Tailwind CSS v4** (`@tailwindcss/vite`) y micro-islas reactivas en **Preact** (`@preact/signals`). Cero dependencias de servidor (100 % estático).
- **Checkout Contraentrega Integrado:** Formulario directo en el cliente con validación en tiempo real (`zod`), honeypot antispam, temporizador mínimo de llenado, soporte DIVIPOLA del DANE (32 departamentos + Bogotá D.C.) cargado bajo demanda (`import()` dinámico), y envío con `fetch` POST directo a NexoBite con timeout de 15 s.
- **CRO & Reglas de Copy:** Copy enfocado en soporte, estabilidad y libertad de movimiento. Cero promesas médicas o palabras prohibidas. Aviso legal visible en sección de producto, FAQ y footer.
- **Rendimiento:** Puntuaciones Lighthouse ≥ 95 en las 4 categorías, LCP optimizado con precarga y WebP/AVIF, fuentes autohospedadas (`Archivo Variable` e `Inter Variable`), JS cliente total < 40 KB gzip.
- **Accesibilidad WCAG AA:** Anillos de foco en color teal, navegación por teclado en galería y anatomía, diálogo modal con trampa de foco nativa.

---

## 🚀 Requisitos y Configuración Rápida

### Requisitos
- **Node.js:** v20+ o v22+ (probado en v26)
- **pnpm:** v9+ o v10+

### Instalación
```bash
# 1. Clonar o ingresar al repositorio
cd dropshipping-rodillera

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Copiar archivo de variables de entorno
cp .env.example .env

# 4. Iniciar servidor de desarrollo local
pnpm dev
```

---

## ⚙️ Variables de Entorno (.env)

Configura tus credenciales de NexoBite en `.env`:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `PUBLIC_NEXOBITE_API_URL` | Endpoint público de leads de NexoBite | `https://api.nexobite.com/api/v1/public/dropshipping/[campaignSlug]/leads` |
| `PUBLIC_NEXOBITE_PRODUCT_ID` | ID numérico del producto en Dropi/NexoBite (Clásica) | `2243235` |
| `PUBLIC_NEXOBITE_PRODUCT_ID_PRO` | ID numérico del producto Pro (si aplica) | `2243236` |
| `PUBLIC_NEXOBITE_CAMPAIGN_SLUG` | Slug de la campaña activa en NexoBite | `campana-rodillera-viraly` |
| `PUBLIC_DOMINIO` | URL canónica del sitio para SEO y Open Graph | `https://viralyshop.co` |
| `PUBLIC_GTM_ID` | Contenedor de Google Tag Manager (opcional) | `GTM-XXXXXXX` |
| `PUBLIC_PIXEL_ID` | ID de Meta Pixel (opcional) | `123456789012345` |

---

## 🧪 Pruebas de Integración y Validaciones

```bash
# Ejecutar validaciones de TypeScript y construir el sitio estático
pnpm build

# Ejecutar pruebas unitarias de CRO y límites de tallas
node --experimental-strip-types scripts/test-unit.mjs

# Probar el envío de un pedido de prueba al contrato público de NexoBite
pnpm test:pedido
```

---

## 🛠️ Cómo Personalizar el Proyecto

### 1. Cambiar Precios y Descuentos
- Los precios base de cada modelo y paquete se configuran centralizadamente en `src/lib/store.ts` (`PACKS_DATA` y `PRECIOS_ANTERIORES`) y en `src/content/producto.json`.

### 2. Cambiar Tallas y Rangos de Medida
- En `src/lib/store.ts` puedes modificar la función `recomendarTalla(cm)` para calibrar los rangos según tu proveedor.
- En `src/content/producto.json` ajusta la tabla de tallas visible (`tallas`).

### 3. Activar o Desactivar el Modelo Pro
- Abre `src/config/tienda.ts` y cambia `modeloPro.activo`:
  ```ts
  modeloPro: {
    activo: false, // Oculta el selector Pro y muestra únicamente la versión clásica
  }
  ```

### 4. Reemplazar Imágenes de Producto
En `src/assets/` y `public/assets/` se encuentran las imágenes optimizadas de la tienda. Puedes reemplazarlas con tus fotos reales de estudio respetando las siguientes dimensiones recomendadas:

| Archivo | Dimensión | Descripción |
| :--- | :--- | :--- |
| `hero-clasica.webp` | 800 × 800 px | Foto frontal de la rodillera clásica |
| `hero-pro.webp` | 800 × 800 px | Foto frontal de la rodillera pro con dial |
| `clasica-lateral.webp` | 800 × 800 px | Vista lateral destacando los resortes |
| `clasica-puesta.webp` | 800 × 800 px | Rodillera puesta en pierna en trote o entrenamiento |
| `pro-lateral.webp` | 800 × 800 px | Vista lateral del modelo pro con cordones |
| `pro-puesta.webp` | 800 × 800 px | Modelo pro puesto en movimiento en gimnasio |
| `pro-perilla.webp` | 600 × 600 px | Primer plano del dial de giro rápido |
| `detalle-gel.webp` | 600 × 600 px | Primer plano de la almohadilla de gel de rótula |
| `detalle-resortes.webp` | 600 × 600 px | Primer plano de los 2 estabilizadores de resorte |
| `detalle-cinta.webp` | 600 × 600 px | Primer plano de la cinta elástica interior |
| `detalle-tiras.webp` | 600 × 600 px | Primer plano de las ondas de silicona antideslizantes |
| `detalle-tejido.webp` | 600 × 600 px | Primer plano del tejido transpirable air knit |
| `detalle-horizontal.webp` | 600 × 600 px | Primer plano de la flexión en punto horizontal |
| `anatomia-clasica.webp` | 900 × 1100 px | Rodillera completa para los puntos interactivos |
| `anatomia-pro.webp` | 900 × 1100 px | Rodillera pro completa para puntos interactivos |
| `actividad-*.webp` | 600 × 450 px | Fotos para las 6 tarjetas de actividades |
| `guia-medicion.webp` | 600 × 500 px | Ilustración de dónde medir con cinta métrica |
| `paso-1.webp` a `paso-3.webp`| 600 × 400 px | Fotos explicativas de los 3 pasos para ponérsela |
| `video-poster.webp` | 720 × 1280 px | Poster para el video vertical demostrativo |

*(Nota: Ejecuta `node scripts/generate-placeholders.mjs` si en algún momento deseas regenerar todos los placeholders automáticos).*

---

## 🚢 Despliegue en Producción

El proyecto se compila a HTML, CSS y JS estáticos en la carpeta `dist/`, sin requerir ningún servidor Node.js en ejecución.

### Despliegue en Vercel
1. Conecta el repositorio de GitHub en Vercel.
2. Vercel detectará automáticamente **Astro**.
3. Configura las variables de entorno de producción en el panel de Vercel.
4. Despliega con un clic.

### Despliegue en Cloudflare Pages
1. Crea un nuevo proyecto en **Cloudflare Pages** conectado a tu Git.
2. Comando de construcción: `pnpm build`.
3. Directorio de salida: `dist`.
4. Agrega las variables de entorno en la configuración de Pages.

### Despliegue en Netlify
1. Conecta el repositorio en Netlify.
2. Build command: `pnpm build`.
3. Publish directory: `dist`.
4. Configura las variables de entorno en Netlify Environment Variables.

---

## 📜 Cumplimiento Legal Colombiano
- **Ley 1480 de 2011 (Estatuto del Consumidor):** Información de garantía legal (30 días), derecho de retracto (5 días hábiles) y cambio de talla gratuito detallado en `/cambios-y-devoluciones`.
- **Ley 1581 de 2012 (Habeas Data):** Casilla obligatoria desmarcada con aceptación expresa antes de confirmar el pedido, vinculada a `/privacidad`.
- **Aviso Deportivo:** Advertencia clara y visible de que el producto es un soporte deportivo de compresión que no sustituye el diagnóstico ni el tratamiento médico.

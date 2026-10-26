import { z } from 'zod';

const envSchema = z.object({
  PUBLIC_NEXOBITE_API_URL: z.string().url('PUBLIC_NEXOBITE_API_URL debe ser una URL válida (ej. https://api.nexobite.com/api/v1/public/dropshipping/campana/leads)'),
  PUBLIC_NEXOBITE_PRODUCT_ID: z.string().min(1, 'PUBLIC_NEXOBITE_PRODUCT_ID es obligatorio (ID de producto en Dropi/NexoBite)'),
  PUBLIC_NEXOBITE_PRODUCT_ID_PRO: z.string().optional(),
  PUBLIC_NEXOBITE_CAMPAIGN_SLUG: z.string().min(1, 'PUBLIC_NEXOBITE_CAMPAIGN_SLUG es obligatorio (slug de campaña en NexoBite)'),
  PUBLIC_GTM_ID: z.string().optional().default(''),
  PUBLIC_PIXEL_ID: z.string().optional().default(''),
  PUBLIC_DOMINIO: z.string().optional().default('https://viralyshop.co'),
});

const rawEnv = {
  PUBLIC_NEXOBITE_API_URL: import.meta.env.PUBLIC_NEXOBITE_API_URL || process.env.PUBLIC_NEXOBITE_API_URL,
  PUBLIC_NEXOBITE_PRODUCT_ID: import.meta.env.PUBLIC_NEXOBITE_PRODUCT_ID || process.env.PUBLIC_NEXOBITE_PRODUCT_ID,
  PUBLIC_NEXOBITE_PRODUCT_ID_PRO: import.meta.env.PUBLIC_NEXOBITE_PRODUCT_ID_PRO || process.env.PUBLIC_NEXOBITE_PRODUCT_ID_PRO,
  PUBLIC_NEXOBITE_CAMPAIGN_SLUG: import.meta.env.PUBLIC_NEXOBITE_CAMPAIGN_SLUG || process.env.PUBLIC_NEXOBITE_CAMPAIGN_SLUG,
  PUBLIC_GTM_ID: import.meta.env.PUBLIC_GTM_ID || process.env.PUBLIC_GTM_ID,
  PUBLIC_PIXEL_ID: import.meta.env.PUBLIC_PIXEL_ID || process.env.PUBLIC_PIXEL_ID,
  PUBLIC_DOMINIO: import.meta.env.PUBLIC_DOMINIO || process.env.PUBLIC_DOMINIO,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error('❌ Error en variables de entorno requeridas:');
  parsed.error.errors.forEach((err) => {
    console.error(`  - ${err.path.join('.')}: ${err.message}`);
  });
  throw new Error('Variables de entorno inválidas o faltantes para NexoBite. Revisa tu archivo .env');
}

export const env = parsed.data;

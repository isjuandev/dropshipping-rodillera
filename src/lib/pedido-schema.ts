import { z } from 'zod';

// Validador de celular colombiano: 10 dígitos locales que inician por 3
export const celularRegex = /^3\d{9}$/;

export const clienteFormSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(1, 'Ingresa tu nombre y apellido')
    .refine(
      (val) => val.trim().split(/\s+/).filter(Boolean).length >= 2,
      'Por favor ingresa tu nombre y al menos un apellido'
    ),
  celular: z
    .string()
    .trim()
    .min(1, 'Ingresa tu número de celular')
    .transform((val) => val.replace(/\D/g, ''))
    .refine(
      (val) => celularRegex.test(val),
      'El celular debe tener 10 dígitos y comenzar por 3 (ej: 300 123 4567)'
    ),
  departamento: z
    .string()
    .trim()
    .min(1, 'Selecciona tu departamento'),
  ciudad: z
    .string()
    .trim()
    .min(1, 'Selecciona tu ciudad o municipio'),
  direccion: z
    .string()
    .trim()
    .min(8, 'La dirección debe tener al menos 8 caracteres')
    .refine(
      (val) => /\d/.test(val),
      'Incluye el número de casa, carrera, calle o torre (ej: Calle 45 # 12-30)'
    ),
  indicaciones: z
    .string()
    .max(300, 'Las indicaciones no pueden exceder 300 caracteres')
    .optional()
    .default(''),
  consentimiento: z
    .boolean()
    .refine(
      (val) => val === true,
      'Debes autorizar el tratamiento de datos para procesar tu orden'
    ),
  empresa: z
    .string()
    .max(0, 'Intento no válido detectado'),
});

export type ClienteFormData = z.infer<typeof clienteFormSchema>;

// Contrato de payload público para NexoBite Leads
export const nexobiteLeadPayloadSchema = z.object({
  pedidoId: z.string().regex(/^PED-\d{8}-[A-Z0-9]{4}$/),
  fecha: z.string().datetime(),
  tienda: z.string().min(1),
  landing: z.string().url(),
  campaignSlug: z.string().min(1),
  producto: z.object({
    providerProductId: z.string().min(1),
    nombre: z.string().min(1),
    sku: z.string().min(1),
    variante: z.string().min(1),
    paquete: z.string().min(1),
    cantidad: z.number().int().positive(),
    extras: z.array(z.any()).default([]),
    precioUnitario: z.number().positive(),
    total: z.number().positive(),
  }),
  cliente: z.object({
    nombreCompleto: z.string().min(1),
    celular: z.string().regex(/^\+573\d{9}$/),
    departamento: z.string().min(1),
    ciudad: z.string().min(1),
    direccion: z.string().min(1),
    indicaciones: z.string().default(''),
  }),
  consentimiento: z.literal(true),
  origen: z.object({
    utm_source: z.string().default(''),
    utm_medium: z.string().default(''),
    utm_campaign: z.string().default(''),
    utm_content: z.string().default(''),
    fbclid: z.string().default(''),
    referrer: z.string().default(''),
    fbp: z.string().default(''),
    fbc: z.string().default(''),
  }),
  antispam: z.object({
    empresa: z.literal(''),
    segundos: z.number().min(5),
  }),
});

export type NexobiteLeadPayload = z.infer<typeof nexobiteLeadPayloadSchema>;

export function generarPedidoId(): string {
  const ahora = new Date();
  // UTC-5 para Bogotá Colombia
  const bogotaOffset = -5 * 60;
  const bogotaTime = new Date(ahora.getTime() + (ahora.getTimezoneOffset() + bogotaOffset) * 60000);
  const yyyy = bogotaTime.getFullYear();
  const mm = String(bogotaTime.getMonth() + 1).padStart(2, '0');
  const dd = String(bogotaTime.getDate()).padStart(2, '0');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PED-${yyyy}${mm}${dd}-${rand}`;
}

export function formatCelularDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

import { env } from '../lib/env';

export interface TiendaConfig {
  nombreTienda: string;
  whatsappSoporte: string;
  moneda: 'COP';
  tiempoEnvio: string;
  garantiaDias: number;
  cambioTallaGratis: boolean;
  modeloPro: {
    activo: boolean;
  };
  pedido: {
    horarioConfirmacion: string;
    tiempoConfirmacion: string;
  };
  gtmId: string;
  pixelId: string;
  razonSocial: string;
  nit: string;
  avisoLegalSalud: string;
}

export const tiendaConfig: TiendaConfig = {
  nombreTienda: 'ViralyShop',
  // Número WhatsApp internacional para soporte exclusivo en errores del formulario
  whatsappSoporte: '573001234567',
  moneda: 'COP',
  tiempoEnvio: '2 a 5 días hábiles',
  garantiaDias: 30,
  cambioTallaGratis: true,
  modeloPro: {
    activo: true,
  },
  pedido: {
    horarioConfirmacion: 'Lunes a sábado de 8:00 a. m. a 6:00 p. m.',
    tiempoConfirmacion: 'Menos de 2 horas',
  },
  gtmId: env.PUBLIC_GTM_ID || '',
  pixelId: env.PUBLIC_PIXEL_ID || '',
  razonSocial: 'ViralyShop S.A.S.',
  nit: '901.765.432-1',
  avisoLegalSalud: 'Producto deportivo de soporte y compresión. No reemplaza el diagnóstico ni el tratamiento médico. Si tienes una lesión, consulta a un profesional de la salud.',
};

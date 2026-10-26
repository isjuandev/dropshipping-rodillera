/**
 * Script de prueba de integración con la API de NexoBite
 * Ejecución: pnpm test:pedido
 */

import { nexobiteLeadPayloadSchema, generarPedidoId } from '../src/lib/pedido-schema.ts';

async function main() {
  console.log('🧪 Iniciando prueba de envío de orden a NexoBite...');

  const endpoint =
    process.env.PUBLIC_NEXOBITE_API_URL ||
    'https://api.nexobite.com/api/v1/public/dropshipping/campana-rodillera-viraly/leads';

  const campaignSlug = process.env.PUBLIC_NEXOBITE_CAMPAIGN_SLUG || 'campana-rodillera-viraly';
  const productId = process.env.PUBLIC_NEXOBITE_PRODUCT_ID || '2243235';

  const pedidoId = generarPedidoId();

  const mockPayload = {
    pedidoId: pedidoId,
    fecha: new Date().toISOString(),
    tienda: 'ViralyShop',
    landing: 'https://viralyshop.co/rodillera-flexiknee',
    campaignSlug: campaignSlug,
    producto: {
      providerProductId: String(productId),
      nombre: 'FlexiKnee Clásica · Par',
      sku: 'FLX-CLA',
      variante: 'Clásica · Tallas: M, L',
      paquete: 'Par',
      cantidad: 2,
      extras: [],
      precioUnitario: 59950,
      total: 119900,
    },
    cliente: {
      nombreCompleto: 'Ana Restrepo',
      celular: '+573001234567',
      departamento: 'Antioquia',
      ciudad: 'Medellín',
      direccion: 'Calle 45 #12-30, apto 302',
      indicaciones: 'Entregar después de las 2 p. m.',
    },
    consentimiento: true,
    origen: {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'rodillera_search',
      utm_content: 'anuncio_1',
      fbclid: 'test_fbclid_123456789',
      referrer: 'https://www.google.com/',
      fbp: 'fb.1.1730000000000.1234567890',
      fbc: 'fb.1.1730000000000.IwARtest',
    },
    antispam: {
      empresa: '',
      segundos: 24,
    },
  };

  console.log('\n📦 Validando estructura del contrato con Zod...');
  const validation = nexobiteLeadPayloadSchema.safeParse(mockPayload);
  if (!validation.success) {
    console.error('❌ Error de validación en el contrato del payload:');
    console.error(validation.error.format());
    process.exit(1);
  }
  console.log('✅ Estructura del payload 100% válida según el contrato de NexoBite.');

  console.log(`\n🚀 Enviando POST a: ${endpoint}`);
  console.log('📄 Payload a enviar:');
  console.log(JSON.stringify(mockPayload, null, 2));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockPayload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    console.log(`\n📡 Código de respuesta HTTP: ${res.status} ${res.statusText}`);
    const data = await res.text();

    try {
      const parsedData = JSON.parse(data);
      console.log('📋 Respuesta recibida (JSON):');
      console.log(JSON.stringify(parsedData, null, 2));
    } catch {
      console.log('📋 Respuesta recibida (Texto):');
      console.log(data);
    }

    if (res.status === 200 || res.status === 201) {
      console.log('\n🎉 ¡Envío exitoso! La API de NexoBite aceptó el lead correctamente.');
    } else {
      console.log(`\nℹ️ El servidor respondió con código ${res.status}. (Normal si la campaña en entorno de desarrollo no está activa en la pasarela de prueba).`);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('\n⏱️ Timeout de 15s agotado al conectar con el servidor.');
    } else {
      console.error(`\n⚠️ Error de conexión: ${err.message}`);
      console.log('ℹ️ Para probar en producción, asegúrate de configurar las variables reales en tu archivo .env.');
    }
  }
}

main().catch(console.error);

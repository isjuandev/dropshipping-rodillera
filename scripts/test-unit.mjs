import { generarPedidoId, clienteFormSchema } from '../src/lib/pedido-schema.ts';
import { recomendarTalla } from '../src/lib/store.ts';

console.log('🧪 Ejecutando pruebas unitarias de CRO y lógica de negocio...\n');

// 1. Prueba de límites de talla
console.log('1. Verificando límites de SizeFinder:');
const tests = [
  { cm: 30, expected: 'S' },
  { cm: 32.5, expected: 'S' },
  { cm: 33, expected: 'M' }, // En el límite exacto gana la mayor
  { cm: 35.5, expected: 'M' },
  { cm: 36, expected: 'L' }, // En el límite exacto gana la mayor
  { cm: 38, expected: 'L' },
  { cm: 40, expected: 'XL' }, // En el límite exacto gana la mayor
  { cm: 43, expected: 'XL' },
];

for (const t of tests) {
  const result = recomendarTalla(t.cm);
  if (result !== t.expected) {
    console.error(`❌ Falló recomendación para ${t.cm} cm: esperada ${t.expected}, obtenida ${result}`);
    process.exit(1);
  }
  console.log(`  ✓ ${t.cm} cm ➔ Talla ${result}`);
}

// 2. Verificando generador de pedidoId
console.log('\n2. Verificando generador de pedidoId Bogotá (PED-AAAAMMDD-XXXX):');
for (let i = 0; i < 5; i++) {
  const id = generarPedidoId();
  if (!/^PED-\d{8}-[A-Z0-9]{4}$/.test(id)) {
    console.error(`❌ PedidoId inválido generado: ${id}`);
    process.exit(1);
  }
  console.log(`  ✓ ID válido: ${id}`);
}

// 3. Verificando validador de formulario de cliente
console.log('\n3. Verificando reglas de validación de cliente:');

// Caso válido
const validForm = {
  nombreCompleto: 'Carlos Eduardo Ramírez',
  celular: '3157894561',
  departamento: 'Cundinamarca',
  ciudad: 'Chía',
  direccion: 'Carrera 7 # 14-20, Casa 5',
  indicaciones: 'Cerca a la plaza',
  consentimiento: true,
  empresa: '',
};
const parsedValid = clienteFormSchema.safeParse(validForm);
if (!parsedValid.success) {
  console.error('❌ Formulario válido falló:', parsedValid.error.format());
  process.exit(1);
}
console.log('  ✓ Formulario válido aceptado correctamente.');

// Caso inválido: celular que no empieza por 3 o no tiene 10 dígitos
const invalidPhone = { ...validForm, celular: '1234567' };
if (clienteFormSchema.safeParse(invalidPhone).success) {
  console.error('❌ Celular inválido no fue rechazado.');
  process.exit(1);
}
console.log('  ✓ Celular inválido rechazado.');

// Caso inválido: nombre con solo una palabra
const invalidName = { ...validForm, nombreCompleto: 'Carlos' };
if (clienteFormSchema.safeParse(invalidName).success) {
  console.error('❌ Nombre con una sola palabra no fue rechazado.');
  process.exit(1);
}
console.log('  ✓ Nombre sin apellido rechazado.');

// Caso inválido: dirección sin número
const invalidDir = { ...validForm, direccion: 'Avenida principal sector norte' };
if (clienteFormSchema.safeParse(invalidDir).success) {
  console.error('❌ Dirección sin números no fue rechazada.');
  process.exit(1);
}
console.log('  ✓ Dirección sin número rechazada.');

// Caso inválido: honeypot lleno
const honeypotLleno = { ...validForm, empresa: 'Spam Bot LLC' };
if (clienteFormSchema.safeParse(honeypotLleno).success) {
  console.error('❌ Honeypot con contenido no fue rechazado.');
  process.exit(1);
}
console.log('  ✓ Honeypot antispam funcionando correctamente.');

console.log('\n🎉 ¡Todas las pruebas unitarias pasaron con éxito al 100%!');

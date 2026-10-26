import { signal, computed } from '@preact/signals';

export type ModeloId = 'clasica' | 'pro';
export type PackId = 'individual' | 'par' | 'doble-par';
export type TallaId = 'S' | 'M' | 'L' | 'XL';

export interface PackInfo {
  id: PackId;
  nombre: string;
  unidades: number;
  precios: Record<ModeloId, number>;
  etiqueta?: string;
  ahorroTexto: string;
}

export const PACKS_DATA: PackInfo[] = [
  {
    id: 'individual',
    nombre: 'Una rodillera',
    unidades: 1,
    precios: {
      clasica: 69900,
      pro: 99900,
    },
    ahorroTexto: 'Ahorras $50.000 vs antes',
  },
  {
    id: 'par',
    nombre: 'Par (ambas rodillas o de repuesto)',
    unidades: 2,
    precios: {
      clasica: 119900,
      pro: 179900,
    },
    etiqueta: 'MÁS VENDIDO',
    ahorroTexto: 'Ahorras $19.900 adicionales',
  },
  {
    id: 'doble-par',
    nombre: 'Dos pares (para ti y alguien más)',
    unidades: 4,
    precios: {
      clasica: 219900,
      pro: 329900,
    },
    etiqueta: 'MEJOR PRECIO',
    ahorroTexto: 'Mayor ahorro por unidad',
  },
];

export const PRECIOS_ANTERIORES: Record<ModeloId, Record<PackId, number>> = {
  clasica: {
    individual: 119900,
    par: 239800,
    'doble-par': 479600,
  },
  pro: {
    individual: 159900,
    par: 319800,
    'doble-par': 639600,
  },
};

export const TALLAS_DISPONIBLES: TallaId[] = ['S', 'M', 'L', 'XL'];

// Signals reactivas globales
export const selectedModelId = signal<ModeloId>('clasica');
export const selectedPackId = signal<PackId>('par'); // Par es el MÁS VENDIDO por defecto
export const selectedSizes = signal<string[]>(['M', 'M']); // Inicialmente 2 unidades de talla M
export const sizeFinderOpen = signal<boolean>(false);
export const activeHotspotId = signal<string | null>(null);

// Computadas
export const currentPack = computed(() => {
  return PACKS_DATA.find((p) => p.id === selectedPackId.value) || PACKS_DATA[1];
});

export const currentUnits = computed(() => currentPack.value.unidades);

export const currentPrice = computed(() => {
  return currentPack.value.precios[selectedModelId.value];
});

export const currentRegularPrice = computed(() => {
  return PRECIOS_ANTERIORES[selectedModelId.value][selectedPackId.value];
});

export const currentSavings = computed(() => {
  return currentRegularPrice.value - currentPrice.value;
});

export const areAllSizesValid = computed(() => {
  const units = currentUnits.value;
  const sizes = selectedSizes.value;
  return sizes.length === units && sizes.every((s) => ['S', 'M', 'L', 'XL'].includes(s));
});

// Helper para sincronizar número de tallas con unidades del pack
export function setPack(packId: PackId) {
  selectedPackId.value = packId;
  const pack = PACKS_DATA.find((p) => p.id === packId);
  const units = pack ? pack.unidades : 2;
  const current = [...selectedSizes.value];
  const fallback = current[0] || 'M';

  if (current.length < units) {
    while (current.length < units) {
      current.push(fallback);
    }
    selectedSizes.value = current;
  } else if (current.length > units) {
    selectedSizes.value = current.slice(0, units);
  }
}

export function setModel(modelId: ModeloId) {
  selectedModelId.value = modelId;
}

export function setUnitSize(index: number, size: string) {
  const updated = [...selectedSizes.value];
  updated[index] = size;
  selectedSizes.value = updated;
}

export function setAllSizes(size: string) {
  const units = currentUnits.value;
  selectedSizes.value = Array(units).fill(size);
}

// Algoritmo de recomendación según cm de rótula (límite superior gana la mayor)
export function recomendarTalla(cm: number): TallaId {
  if (cm < 33) return 'S';
  if (cm < 36) return 'M';
  if (cm < 40) return 'L';
  return 'XL';
}

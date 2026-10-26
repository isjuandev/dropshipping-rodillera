import { h } from 'preact';
import { useState } from 'preact/hooks';
import { selectedModelId, activeHotspotId } from '../../lib/store';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  titulo: string;
  texto: string;
  img: string;
  side: 'left' | 'right';
}

const BASE_HOTSPOTS: Hotspot[] = [
  {
    id: 'cinta',
    x: 28,
    y: 16,
    titulo: 'Cinta elástica interior',
    texto: 'Se ajusta al contorno del muslo con suavidad y sin apretar en exceso.',
    img: '/assets/detalle-cinta.webp',
    side: 'left',
  },
  {
    id: 'tiras-gel',
    x: 72,
    y: 17,
    titulo: 'Tiras de gel antideslizantes',
    texto: 'Doble hilera de silicona ondulada que evita que la rodillera se baje al moverte.',
    img: '/assets/detalle-tiras.webp',
    side: 'right',
  },
  {
    id: 'punto-horizontal',
    x: 26,
    y: 45,
    titulo: 'Tejido de punto horizontal',
    texto: 'Se adapta anatómicamente a la flexión de tu pierna sin crear pliegues incómodos.',
    img: '/assets/detalle-horizontal.webp',
    side: 'left',
  },
  {
    id: 'almohadilla',
    x: 74,
    y: 49,
    titulo: 'Almohadilla de gel en la rótula',
    texto: 'Anillo de silicona anatómicamente contorneado que amortigua impactos y centra la rótula.',
    img: '/assets/detalle-gel.webp',
    side: 'right',
  },
  {
    id: 'resortes',
    x: 24,
    y: 72,
    titulo: 'Estabilizadores laterales de resorte',
    texto: 'Dos resortes flexibles a cada lado que aportan firmeza y estabilidad lateral en cada paso.',
    img: '/assets/detalle-resortes.webp',
    side: 'left',
  },
  {
    id: 'air-knit',
    x: 74,
    y: 76,
    titulo: 'Tejido air knit transpirable',
    texto: 'Estructura microperforada de alta ventilación que disipa el sudor y seca en minutos.',
    img: '/assets/detalle-tejido.webp',
    side: 'right',
  },
];

const PRO_HOTSPOT: Hotspot = {
  id: 'perilla',
  x: 22,
  y: 30,
  titulo: 'Perilla giratoria de ajuste rápido',
  texto: 'Gira la perilla para calibrar la presión al milímetro y suelta levantando con un toque.',
  img: '/assets/pro-perilla.webp',
  side: 'left',
};

export default function ProductAnatomy() {
  const model = selectedModelId.value;
  const isPro = model === 'pro';
  const [touched, setTouched] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>('almohadilla');

  const hotspots = isPro ? [PRO_HOTSPOT, ...BASE_HOTSPOTS] : BASE_HOTSPOTS;
  const currentActive = hotspots.find((h) => h.id === activeId) || hotspots[0];

  const handleSelect = (id: string) => {
    setActiveId(id);
    activeHotspotId.value = id;
    if (!touched) setTouched(true);
  };

  return (
    <div className="relative bg-white rounded-3xl p-6 md:p-10 border border-[var(--color-borde)] shadow-sm max-w-5xl mx-auto overflow-hidden">
      {/* Header informativo */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
          Tecnología y Diseño
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--color-tinta)] mt-2">
          Anatomía de soporte en cada zona
        </h3>
        <p className="text-sm md:text-base text-[var(--color-gris)] mt-1">
          {isPro
            ? 'Explora los 7 puntos clave de soporte con sistema de ajuste giratorio'
            : 'Toca los puntos en la rodillera para ver los detalles anatómicos de soporte'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Columna Izquierda: Botones en Desktop */}
        <div className="hidden lg:flex flex-col gap-3 lg:col-span-3">
          {hotspots
            .filter((h) => h.side === 'left')
            .map((h) => {
              const isSelected = h.id === activeId;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => handleSelect(h.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-teal)] bg-sky-50/50 shadow-xs ring-1 ring-[var(--color-teal)]'
                      : 'border-[var(--color-borde)] hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[var(--color-teal)]' : 'bg-gray-300'
                      }`}
                    />
                    <h4 className="font-bold text-xs text-[var(--color-tinta)]">{h.titulo}</h4>
                  </div>
                  <p className="text-[11px] text-[var(--color-gris)] mt-1 line-clamp-2">{h.texto}</p>
                </button>
              );
            })}
        </div>

        {/* Columna Central: Imagen con Hotspots interactivos */}
        <div className="relative lg:col-span-6 flex items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-[9/11] rounded-2xl overflow-hidden bg-[var(--color-niebla)] flex items-center justify-center p-2">
            <img
              src={isPro ? '/assets/anatomia-pro.webp' : '/assets/anatomia-clasica.webp'}
              alt={isPro ? 'Anatomía de rodillera pro con dial' : 'Anatomía de rodillera deportiva de compresión'}
              className="w-full h-full object-contain transition-opacity duration-300 select-none"
              width={900}
              height={1100}
              loading="lazy"
            />

            {/* Renderizado de Hotspots */}
            {hotspots.map((h) => {
              const isSelected = h.id === activeId;
              return (
                <button
                  key={h.id}
                  type="button"
                  aria-label={`Ver detalle de ${h.titulo}`}
                  aria-expanded={isSelected}
                  onClick={() => handleSelect(h.id)}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer z-20 ${
                    isSelected
                      ? 'bg-[var(--color-teal)] text-white scale-125 ring-4 ring-[var(--color-teal)]/30 shadow-lg'
                      : `bg-white/95 text-[var(--color-teal)] border-2 border-[var(--color-teal)] shadow-md hover:scale-110 ${
                          !touched ? 'animate-hotspot' : ''
                        }`
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-current" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Botones en Desktop */}
        <div className="hidden lg:flex flex-col gap-3 lg:col-span-3">
          {hotspots
            .filter((h) => h.side === 'right')
            .map((h) => {
              const isSelected = h.id === activeId;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => handleSelect(h.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-teal)] bg-sky-50/50 shadow-xs ring-1 ring-[var(--color-teal)]'
                      : 'border-[var(--color-borde)] hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[var(--color-teal)]' : 'bg-gray-300'
                      }`}
                    />
                    <h4 className="font-bold text-xs text-[var(--color-tinta)]">{h.titulo}</h4>
                  </div>
                  <p className="text-[11px] text-[var(--color-gris)] mt-1 line-clamp-2">{h.texto}</p>
                </button>
              );
            })}
        </div>
      </div>

      {/* Tarjeta de detalle activa (Mobile & Desktop Zoom) */}
      <div className="mt-6 bg-[var(--color-niebla)] rounded-2xl p-4 md:p-5 border border-[var(--color-borde)] flex flex-col sm:flex-row items-center gap-4 transition-all">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-[var(--color-teal)] shrink-0 bg-white shadow-xs">
          <img
            src={currentActive.img}
            alt={currentActive.titulo}
            className="w-full h-full object-cover"
            width={200}
            height={200}
            loading="lazy"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-teal)]" />
            <h4 className="font-extrabold text-base md:text-lg text-[var(--color-tinta)]">
              {currentActive.titulo}
            </h4>
          </div>
          <p className="text-xs md:text-sm text-[var(--color-gris)] mt-1 leading-relaxed">
            {currentActive.texto}
          </p>
        </div>
      </div>
    </div>
  );
}

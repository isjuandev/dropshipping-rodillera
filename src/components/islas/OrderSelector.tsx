import {
  selectedModelId,
  selectedPackId,
  selectedSizes,
  sizeFinderOpen,
  PACKS_DATA,
  TALLAS_DISPONIBLES,
  currentPrice,
  currentRegularPrice,
  currentSavings,
  setPack,
  setModel,
  setUnitSize,
} from '../../lib/store';

interface Props {
  proActivo?: boolean;
}

export default function OrderSelector({ proActivo = true }: Props) {
  const model = selectedModelId.value;
  const packId = selectedPackId.value;
  const sizes = selectedSizes.value;
  const pack = PACKS_DATA.find((p) => p.id === packId) || PACKS_DATA[1];
  const price = currentPrice.value;
  const regularPrice = currentRegularPrice.value;
  const savings = currentSavings.value;

  const handleCtaClick = (e: Event) => {
    e.preventDefault();
    const pedidoSection = document.getElementById('pedido');
    if (pedidoSection) {
      pedidoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Enfocar el primer input después del scroll
      setTimeout(() => {
        const firstInput = pedidoSection.querySelector<HTMLInputElement>(
          'input[name="nombreCompleto"], input:not([type="hidden"])'
        );
        if (firstInput) {
          firstInput.focus();
        }
      }, 400);
    }
  };

  const formatPrice = (val: number) => {
    return '$' + val.toLocaleString('es-CO');
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[var(--color-borde)] shadow-sm space-y-6">
      {/* 1. Selector de Modelo (si Pro está activo) */}
      {proActivo && (
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-gris)]">
            1. Elige tu modelo
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setModel('clasica')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                model === 'clasica'
                  ? 'border-[var(--color-teal)] bg-sky-50/50 ring-2 ring-[var(--color-teal)]/20 shadow-xs'
                  : 'border-[var(--color-borde)] hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-[var(--color-tinta)]">Clásica</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    model === 'clasica'
                      ? 'border-[var(--color-teal)] bg-[var(--color-teal)]'
                      : 'border-gray-300'
                  }`}
                >
                  {model === 'clasica' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-[var(--color-gris)] leading-tight">Gel y resortes dobles</p>
              <p className="text-sm font-extrabold text-[var(--color-tinta)] mt-1.5 tabular-nums">
                $69.900 <span className="text-[10px] text-gray-400 font-normal line-through">$119.900</span>
              </p>
            </button>

            <button
              type="button"
              onClick={() => setModel('pro')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                model === 'pro'
                  ? 'border-[var(--color-teal)] bg-sky-50/50 ring-2 ring-[var(--color-teal)]/20 shadow-xs'
                  : 'border-[var(--color-borde)] hover:border-gray-300 bg-white'
              }`}
            >
              <span className="absolute -top-2.5 right-2 bg-[var(--color-teal)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Ajuste Dial
              </span>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-[var(--color-tinta)]">Pro</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    model === 'pro'
                      ? 'border-[var(--color-teal)] bg-[var(--color-teal)]'
                      : 'border-gray-300'
                  }`}
                >
                  {model === 'pro' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-[var(--color-gris)] leading-tight">Perilla de compresión</p>
              <p className="text-sm font-extrabold text-[var(--color-tinta)] mt-1.5 tabular-nums">
                $99.900 <span className="text-[10px] text-gray-400 font-normal line-through">$159.900</span>
              </p>
            </button>
          </div>
        </div>
      )}

      {/* 2. Selector de Pack */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-gris)]">
            2. Selecciona tu paquete
          </label>
          <span className="text-xs font-semibold text-[var(--color-exito)] flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Envío gratis incluido
          </span>
        </div>

        <div className="space-y-2">
          {PACKS_DATA.map((p) => {
            const isSelected = p.id === packId;
            const pPrice = p.precios[model];
            const pUnits = p.unidades;
            const pricePerUnit = Math.round(pPrice / pUnits);

            return (
              <div
                key={p.id}
                onClick={() => setPack(p.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex items-center justify-between ${
                  isSelected
                    ? 'border-[var(--color-teal)] bg-sky-50/40 ring-1.5 ring-[var(--color-teal)]'
                    : 'border-[var(--color-borde)] hover:border-gray-300 bg-white'
                }`}
              >
                {p.etiqueta && (
                  <span
                    className={`absolute -top-2.5 left-4 text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wide text-white ${
                      p.etiqueta === 'MÁS VENDIDO' ? 'bg-[var(--color-oferta)]' : 'bg-[var(--color-grafito)]'
                    }`}
                  >
                    {p.etiqueta}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[var(--color-teal)] bg-[var(--color-teal)]'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-tinta)] leading-tight">{p.nombre}</h3>
                    <p className="text-xs text-[var(--color-gris)] mt-0.5">
                      {pUnits > 1 ? `${formatPrice(pricePerUnit)} c/u · ${p.ahorroTexto}` : p.ahorroTexto}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-extrabold text-base text-[var(--color-tinta)] tabular-nums block">
                    {formatPrice(pPrice)}
                  </span>
                  <span className="text-[10px] text-[var(--color-exito)] font-medium">Contraentrega</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Selección de tallas por unidad */}
      <div className="space-y-3 pt-1 border-t border-[var(--color-borde)]">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-gris)]">
            3. Elige la talla {pack.unidades > 1 ? `(${pack.unidades} unidades)` : ''}
          </label>
          <button
            type="button"
            onClick={() => (sizeFinderOpen.value = true)}
            className="text-xs font-semibold text-[var(--color-teal)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z" />
              <path d="m14.5 12.5 2-2" />
              <path d="m11.5 9.5 2-2" />
              <path d="m8.5 6.5 2-2" />
            </svg>
            ¿Cuál es mi talla?
          </button>
        </div>

        <div className="space-y-2">
          {Array.from({ length: pack.unidades }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[var(--color-niebla)] px-3 py-2 rounded-xl">
              <span className="text-xs font-medium text-[var(--color-tinta)]">
                {pack.unidades > 1 ? `Rodillera #${idx + 1}:` : 'Talla de rodillera:'}
              </span>
              <div className="flex items-center gap-1.5">
                {TALLAS_DISPONIBLES.map((talla) => {
                  const isCurrent = sizes[idx] === talla;
                  return (
                    <button
                      key={talla}
                      type="button"
                      onClick={() => setUnitSize(idx, talla)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[var(--color-grafito)] text-white shadow-xs'
                          : 'bg-white text-[var(--color-tinta)] border border-[var(--color-borde)] hover:border-gray-400'
                      }`}
                    >
                      {talla}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloque de Precio y CTA */}
      <div className="pt-2 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[var(--color-gris)]">Total a pagar en efectivo:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--color-tinta)] tabular-nums">
                {formatPrice(price)}
              </span>
              <span className="text-sm text-[var(--color-gris)] line-through tabular-nums">
                {formatPrice(regularPrice)}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[var(--color-oferta)] bg-red-50 border border-red-200 px-2 py-1 rounded-md">
            Ahorras {formatPrice(savings)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCtaClick}
          className="btn-cta w-full h-14 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-[var(--color-tinta)] font-black text-lg rounded-[14px] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <span>Pedir ahora — pago contraentrega</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--color-gris)] font-medium pt-1">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-exito)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Envío gratis
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-exito)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cambio de talla gratis
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-exito)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Garantía 30 días
          </span>
        </div>
      </div>
    </div>
  );
}

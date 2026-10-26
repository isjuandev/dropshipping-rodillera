import {
  selectedModelId,
  selectedPackId,
  selectedSizes,
  sizeFinderOpen,
  PACKS_DATA,
  TALLAS_DISPONIBLES,
  currentPrice,
  currentSavings,
  setPack,
  setUnitSize,
} from '../../lib/store';

export default function PackSelector() {
  const model = selectedModelId.value;
  const packId = selectedPackId.value;
  const sizes = selectedSizes.value;
  const pack = PACKS_DATA.find((p) => p.id === packId) || PACKS_DATA[1];
  const price = currentPrice.value;
  const savings = currentSavings.value;

  const formatPrice = (val: number) => '$' + val.toLocaleString('es-CO');

  const getCtaLabel = () => {
    if (packId === 'individual') return `Pedir una rodillera por ${formatPrice(price)}`;
    if (packId === 'par') return `Pedir el par por ${formatPrice(price)}`;
    return `Pedir los dos pares por ${formatPrice(price)}`;
  };

  const handleCtaClick = (e: Event) => {
    e.preventDefault();
    const pedidoSection = document.getElementById('pedido');
    if (pedidoSection) {
      pedidoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 3 Tarjetas Radio de Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PACKS_DATA.map((p) => {
          const isSelected = p.id === packId;
          const pPrice = p.precios[model];
          const pUnits = p.unidades;
          const pPerUnit = Math.round(pPrice / pUnits);

          return (
            <div
              key={p.id}
              onClick={() => setPack(p.id)}
              className={`relative rounded-2xl p-5 md:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[var(--color-teal)] bg-sky-50/40 shadow-md ring-2 ring-[var(--color-teal)]/20'
                  : 'border-[var(--color-borde)] hover:border-gray-300 bg-white shadow-xs'
              }`}
            >
              {p.etiqueta && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-xs ${
                    p.etiqueta === 'MÁS VENDIDO' ? 'bg-[var(--color-oferta)]' : 'bg-[var(--color-grafito)]'
                  }`}
                >
                  {p.etiqueta}
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-[var(--color-tinta)]">{p.nombre}</h3>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[var(--color-teal)] bg-[var(--color-teal)]'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[var(--color-tinta)] tabular-nums">
                      {formatPrice(pPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-gris)] mt-1">
                    {pUnits > 1 ? `${formatPrice(pPerUnit)} por unidad` : 'Precio especial contraentrega'}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-block text-xs font-bold text-[var(--color-exito)] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {p.ahorroTexto}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-borde)]">
                <p className="text-xs text-[var(--color-gris)] flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[var(--color-exito)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Pago en efectivo al recibir
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista compacta de selección de tallas para el pack activo */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[var(--color-borde)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="font-bold text-sm md:text-base text-[var(--color-tinta)]">
              Tallas para tu paquete ({pack.nombre})
            </h4>
            <p className="text-xs text-[var(--color-gris)]">
              Puedes elegir tallas iguales o distintas para cada unidad.
            </p>
          </div>
          <button
            type="button"
            onClick={() => (sizeFinderOpen.value = true)}
            className="text-xs font-bold text-[var(--color-teal)] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z" />
            </svg>
            Guía de medidas (cm)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: pack.unidades }).map((_, idx) => (
            <div key={idx} className="bg-[var(--color-niebla)] p-3 rounded-xl border border-[var(--color-borde)]">
              <span className="text-xs font-semibold text-[var(--color-gris)] block mb-2">
                Unidad #{idx + 1}:
              </span>
              <div className="flex items-center gap-1">
                {TALLAS_DISPONIBLES.map((talla) => {
                  const isCurrent = sizes[idx] === talla;
                  return (
                    <button
                      key={talla}
                      type="button"
                      onClick={() => setUnitSize(idx, talla)}
                      className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

        {/* CTA reactivo del Pack */}
        <div className="mt-6 pt-5 border-t border-[var(--color-borde)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-[var(--color-gris)]">Total contraentrega con envío gratis:</span>
            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-[var(--color-tinta)] tabular-nums">
                {formatPrice(price)}
              </span>
              <span className="text-xs text-[var(--color-oferta)] font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Ahorras {formatPrice(savings)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCtaClick}
            className="btn-cta w-full sm:w-auto px-8 h-14 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-[var(--color-tinta)] font-black text-base md:text-lg rounded-[14px] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>{getCtaLabel()}</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

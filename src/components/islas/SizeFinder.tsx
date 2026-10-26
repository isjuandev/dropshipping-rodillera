import { useState, useEffect, useRef } from 'preact/hooks';
import {
  sizeFinderOpen,
  recomendarTalla,
  setAllSizes,
  type TallaId,
} from '../../lib/store';

interface Props {
  isModalOnly?: boolean;
}

const TABLA_TALLAS: Array<{ talla: TallaId; rango: string; desc: string }> = [
  { talla: 'S', rango: '30 a 33 cm', desc: 'Pierna delgada o ajuste más ceñido' },
  { talla: 'M', rango: '33 a 36 cm', desc: 'Medida promedio estándar' },
  { talla: 'L', rango: '36 a 40 cm', desc: 'Muslo y rodilla ancha o desarrollada' },
  { talla: 'XL', rango: '40 a 44 cm', desc: 'Pierna robusta o contextura fuerte' },
];

export default function SizeFinder({ isModalOnly = false }: Props) {
  const [cmInput, setCmInput] = useState<string>('34');
  const [cmNumber, setCmNumber] = useState<number>(34);
  const [recomendacion, setRecomendacion] = useState<TallaId>('M');
  const [aplicada, setAplicada] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const num = parseFloat(cmInput);
    if (!isNaN(num) && num > 0) {
      setCmNumber(num);
      const rec = recomendarTalla(num);
      setRecomendacion(rec);
    }
  }, [cmInput]);

  // Manejo de diálogo modal reactivo a signal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (sizeFinderOpen.value) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [sizeFinderOpen.value]);

  const handleClose = () => {
    sizeFinderOpen.value = false;
  };

  const handleApplySize = (talla: TallaId) => {
    setAllSizes(talla);
    setAplicada(true);
    setTimeout(() => {
      setAplicada(false);
      if (sizeFinderOpen.value) {
        sizeFinderOpen.value = false;
      }
    }, 800);
  };

  const content = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Ilustración de medición */}
        <div className="md:col-span-5 bg-[var(--color-niebla)] rounded-2xl p-4 border border-[var(--color-borde)] flex flex-col items-center justify-center text-center">
          <img
            src="/assets/guia-medicion.webp"
            alt="Cómo medir la rodilla con pierna extendida"
            className="w-full max-w-[260px] aspect-[6/5] object-contain rounded-xl"
            width={600}
            height={500}
            loading="lazy"
          />
          <p className="text-xs text-[var(--color-gris)] mt-3">
            Mide con la pierna completamente recta, pasando la cinta por el centro de la rótula.
          </p>
        </div>

        {/* Calculadora en vivo */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <label
              htmlFor="cm-rodilla-input"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-gris)] mb-1"
            >
              Ingresa el contorno de tu rodilla (cm)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  id="cm-rodilla-input"
                  type="number"
                  min="25"
                  max="60"
                  step="0.5"
                  value={cmInput}
                  onInput={(e) => setCmInput((e.target as HTMLInputElement).value)}
                  className="w-full h-13 px-4 rounded-xl border border-[var(--color-borde)] text-lg font-bold text-[var(--color-tinta)] focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20 outline-none tabular-nums"
                  placeholder="Ej. 35"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-gris)]">
                  cm
                </span>
              </div>
            </div>
          </div>

          {/* Resultado de recomendación */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-[var(--color-teal)] font-bold uppercase tracking-wider">
                Talla recomendada:
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-[var(--color-tinta)]">
                  Talla {recomendacion}
                </span>
                <span className="text-xs text-[var(--color-gris)]">
                  ({cmNumber} cm)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleApplySize(recomendacion)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm cursor-pointer transition-all ${
                aplicada
                  ? 'bg-[var(--color-exito)] text-white'
                  : 'bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-[var(--color-tinta)] shadow-xs'
              }`}
            >
              {aplicada ? '✓ Talla fijada' : `Usar talla ${recomendacion}`}
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong>Consejo de ajuste:</strong> Si tu medida queda en el límite exacto entre dos tallas (ej: 33 cm o 40 cm), elige la mayor para garantizar una circulación cómoda.
            </span>
          </div>
        </div>
      </div>

      {/* Tabla completa de tallas */}
      <div className="border border-[var(--color-borde)] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-niebla)] border-b border-[var(--color-borde)]">
              <th className="p-3 font-bold text-[var(--color-tinta)]">Talla</th>
              <th className="p-3 font-bold text-[var(--color-tinta)]">Contorno de rodilla</th>
              <th className="p-3 font-bold text-[var(--color-tinta)] hidden sm:table-cell">Recomendación</th>
              <th className="p-3 font-bold text-right text-[var(--color-tinta)]">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-borde)]">
            {TABLA_TALLAS.map((t) => {
              const isSelected = recomendacion === t.talla;
              return (
                <tr
                  key={t.talla}
                  className={`transition-colors ${
                    isSelected ? 'bg-sky-50/70 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="p-3 font-extrabold text-base text-[var(--color-tinta)] flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[var(--color-teal)]' : 'bg-transparent'
                      }`}
                    />
                    {t.talla}
                  </td>
                  <td className="p-3 font-medium tabular-nums">{t.rango}</td>
                  <td className="p-3 text-[var(--color-gris)] hidden sm:table-cell">{t.desc}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleApplySize(t.talla)}
                      className="text-xs font-bold text-[var(--color-teal)] hover:underline cursor-pointer"
                    >
                      Elegir {t.talla}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {/* Contenido inline de la sección 8 */}
      {!isModalOnly && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-borde)] shadow-sm max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
              Guía de Tallas
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--color-tinta)] mt-2">
              ¿Cuál es tu talla exacta?
            </h3>
            <p className="text-xs md:text-sm text-[var(--color-gris)] mt-1">
              Mide en 30 segundos con una cinta métrica o un cordón y una regla.
            </p>
          </div>
          {content}
        </div>
      )}

      {/* Modal Dialog nativo accesible cuando sizeFinderOpen es true */}
      <dialog
        ref={dialogRef}
        onClose={handleClose}
        className="fixed inset-0 m-auto z-50 p-6 md:p-8 bg-white rounded-3xl border border-[var(--color-borde)] shadow-2xl max-w-2xl w-[92vw] max-h-[90vh] overflow-y-auto backdrop:bg-black/60 backdrop:backdrop-blur-xs"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-borde)]">
          <div>
            <h3 className="text-xl font-extrabold text-[var(--color-tinta)]">Guía interactiva de tallas</h3>
            <p className="text-xs text-[var(--color-gris)]">Encuentra tu ajuste perfecto</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[var(--color-niebla)] hover:bg-gray-200 flex items-center justify-center text-[var(--color-tinta)] font-bold cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
        {content}
      </dialog>
    </>
  );
}

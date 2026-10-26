import { useState, useEffect } from 'preact/hooks';
import {
  selectedModelId,
  selectedSizes,
  currentPrice,
  currentPack,
  areAllSizesValid,
} from '../../lib/store';

export default function StickyBar() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const model = selectedModelId.value;
  const isPro = model === 'pro';
  const pack = currentPack.value;
  const price = currentPrice.value;
  const sizes = selectedSizes.value;
  const validSizes = areAllSizesValid.value;

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      const pedido = document.getElementById('pedido');

      if (!hero) {
        setIsVisible(window.scrollY > 400);
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const heroPassed = heroRect.bottom < 100;

      let pedidoInView = false;
      if (pedido) {
        const pedidoRect = pedido.getBoundingClientRect();
        pedidoInView = pedidoRect.top < window.innerHeight && pedidoRect.bottom > 0;
      }

      setIsVisible(heroPassed && !pedidoInView);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleActionClick = () => {
    if (!validSizes) {
      const selector = document.getElementById('hero-selector') || document.getElementById('packs');
      if (selector) {
        selector.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const pedido = document.getElementById('pedido');
      if (pedido) {
        pedido.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const firstInput = pedido.querySelector<HTMLInputElement>(
            'input[name="nombreCompleto"], input:not([type="hidden"])'
          );
          if (firstInput) firstInput.focus();
        }, 400);
      }
    }
  };

  const formatPrice = (val: number) => '$' + val.toLocaleString('es-CO');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--color-borde)] shadow-2xl px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Miniatura y Resumen */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-11 rounded-lg overflow-hidden border border-[var(--color-borde)] shrink-0 bg-[var(--color-niebla)]">
            <img
              src={isPro ? '/assets/hero-pro.webp' : '/assets/hero-clasica.webp'}
              alt="Miniatura rodillera"
              className="w-full h-full object-cover"
              width={44}
              height={44}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base text-[var(--color-tinta)] tabular-nums truncate">
                {formatPrice(price)}
              </span>
              <span className="text-[10px] text-[var(--color-exito)] font-bold">Contraentrega</span>
            </div>
            <p className="text-[11px] text-[var(--color-gris)] truncate">
              {isPro ? 'Pro' : 'Clásica'} · {pack.nombre} · {validSizes ? `Talla ${sizes.join(', ')}` : 'Sin talla'}
            </p>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          type="button"
          onClick={handleActionClick}
          className="btn-cta shrink-0 h-11 px-4 rounded-xl bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-[var(--color-tinta)] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>{validSizes ? 'Pedir ahora' : 'Elegir talla'}</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

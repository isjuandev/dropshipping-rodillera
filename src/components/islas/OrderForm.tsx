import { useState, useEffect, useRef } from 'preact/hooks';
import {
  selectedModelId,
  selectedSizes,
  currentPrice,
  currentPack,
  areAllSizesValid,
} from '../../lib/store';
import {
  clienteFormSchema,
  generarPedidoId,
  formatCelularDisplay,
  type ClienteFormData,
  type NexobiteLeadPayload,
} from '../../lib/pedido-schema';
import { tiendaConfig } from '../../config/tienda';

type ColombiaData = Record<string, string[]>;

interface FormErrors {
  nombreCompleto?: string;
  celular?: string;
  departamento?: string;
  ciudad?: string;
  direccion?: string;
  indicaciones?: string;
  consentimiento?: string;
  general?: string;
}

export default function OrderForm() {
  // Estado de inputs del cliente
  const [nombreCompleto, setNombreCompleto] = useState<string>('');
  const [celular, setCelular] = useState<string>('');
  const [departamento, setDepartamento] = useState<string>('');
  const [ciudad, setCiudad] = useState<string>('');
  const [ciudadBusqueda, setCiudadBusqueda] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [indicaciones, setIndicaciones] = useState<string>('');
  const [consentimiento, setConsentimiento] = useState<boolean>(false);
  const [empresaHoneypot, setEmpresaHoneypot] = useState<string>('');

  // Errores de validación
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Carga diferida de DIVIPOLA
  const [colombiaData, setColombiaData] = useState<ColombiaData | null>(null);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  // Estados de envío y respuesta
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'idle' | 'sending' | 'duplicate' | 'rateLimit' | 'unavailable' | 'error';
    text: string;
  }>({ type: 'idle', text: '' });
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0);

  // Pedido ID persistente entre reintentos
  const pedidoIdRef = useRef<string>('');
  const mountTimeRef = useRef<number>(Date.now());
  const checkoutTrackedRef = useRef<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Inicialización de pedidoId, tracking y borrador de localStorage
  useEffect(() => {
    mountTimeRef.current = Date.now();
    pedidoIdRef.current = generarPedidoId();

    // Capturar parámetros UTM y fbclid al cargar la landing
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utms: Record<string, string> = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid'].forEach((param) => {
        const val = urlParams.get(param);
        if (val) {
          utms[param] = val;
          sessionStorage.setItem(`viraly_${param}`, val);
        }
      });
      if (document.referrer) {
        sessionStorage.setItem('viraly_referrer', document.referrer);
      }
    } catch {
      // Ignorar restricciones en iframes o navegadores restringidos
    }

    // Cargar borrador de localStorage (NUNCA el consentimiento)
    try {
      const draft = localStorage.getItem('viraly_pedido_draft');
      if (draft) {
        const data = JSON.parse(draft);
        if (data.nombreCompleto) setNombreCompleto(data.nombreCompleto);
        if (data.celular) setCelular(data.celular);
        if (data.departamento) setDepartamento(data.departamento);
        if (data.ciudad) setCiudad(data.ciudad);
        if (data.direccion) setDireccion(data.direccion);
        if (data.indicaciones) setIndicaciones(data.indicaciones);
      }
    } catch {
      // Fallback silencioso si localStorage está bloqueado
    }

    // Cargar dinámicamente colombia.json
    import('../../data/colombia.json')
      .then((mod) => {
        setColombiaData(mod.default as ColombiaData);
      })
      .catch((err) => console.error('Error cargando DIVIPOLA:', err));
  }, []);

  // Actualizar lista de ciudades al cambiar departamento
  useEffect(() => {
    if (!colombiaData || !departamento) {
      setCiudadesDisponibles([]);
      return;
    }
    const lista = colombiaData[departamento] || [];
    setCiudadesDisponibles(lista);
    if (!lista.includes(ciudad)) {
      setCiudad('');
      setCiudadBusqueda('');
    }
  }, [departamento, colombiaData]);

  // Guardar borrador en localStorage automáticamente al modificar campos
  useEffect(() => {
    try {
      const draft = {
        nombreCompleto,
        celular,
        departamento,
        ciudad,
        direccion,
        indicaciones,
      };
      localStorage.setItem('viraly_pedido_draft', JSON.stringify(draft));
    } catch {
      // Ignorar errores de cuota o cookies bloqueadas
    }
  }, [nombreCompleto, celular, departamento, ciudad, direccion, indicaciones]);

  // Temporizador para estado 429 Rate Limit
  useEffect(() => {
    if (rateLimitCountdown <= 0) return;
    const timer = setInterval(() => {
      setRateLimitCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatusMessage({ type: 'idle', text: '' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  // Evento de tracking BeginCheckout en el primer foco del formulario
  const handleFirstFocus = () => {
    if (checkoutTrackedRef.current) return;
    checkoutTrackedRef.current = true;

    try {
      if (typeof window !== 'undefined') {
        const w = window as any;
        if (w.dataLayer && Array.isArray(w.dataLayer)) {
          w.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
              currency: 'COP',
              value: currentPrice.value,
              items: [
                {
                  item_id: selectedModelId.value === 'pro' ? 'FLX-PRO' : 'FLX-CLA',
                  item_name: `Rodillera ${selectedModelId.value === 'pro' ? 'Pro' : 'Clásica'}`,
                  price: currentPrice.value,
                  quantity: currentPack.value.unidades,
                },
              ],
            },
          });
        }
        if (typeof w.fbq === 'function') {
          w.fbq('track', 'InitiateCheckout', {
            content_name: 'Rodillera De Compresion',
            currency: 'COP',
            value: currentPrice.value,
          });
        }
      }
    } catch {
      // Ignorar bloqueadores de anuncios
    }
  };

  // Validación de campo individual
  const validateField = (field: keyof ClienteFormData, value: any) => {
    const tempObj: any = {
      nombreCompleto,
      celular,
      departamento,
      ciudad,
      direccion,
      indicaciones,
      consentimiento,
      empresa: empresaHoneypot,
      [field]: value,
    };
    const res = clienteFormSchema.safeParse(tempObj);
    if (!res.success) {
      const match = res.error.errors.find((err) => err.path[0] === field);
      setErrors((prev) => ({
        ...prev,
        [field]: match ? match.message : undefined,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleBlur = (field: keyof ClienteFormData) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    let val: any = '';
    if (field === 'nombreCompleto') val = nombreCompleto;
    if (field === 'celular') val = celular;
    if (field === 'departamento') val = departamento;
    if (field === 'ciudad') val = ciudad;
    if (field === 'direccion') val = direccion;
    if (field === 'consentimiento') val = consentimiento;
    validateField(field, val);
  };

  // Construcción de enlace de WhatsApp de soporte exclusivo para errores
  const getWhatsAppSupportUrl = () => {
    const modelText = selectedModelId.value === 'pro' ? 'Rodillera Pro con dial' : 'Rodillera Clásica';
    const msg = `Hola, tuve un problema al enviar mi orden en ViralyShop.\n\n` +
      `*Pedido ID:* ${pedidoIdRef.current}\n` +
      `*Producto:* ${modelText}\n` +
      `*Paquete:* ${currentPack.value.nombre}\n` +
      `*Tallas:* ${selectedSizes.value.join(', ')}\n` +
      `*Total contraentrega:* $${currentPrice.value.toLocaleString('es-CO')}\n` +
      `*Ciudad:* ${ciudad}, ${departamento}\n\n` +
      `¿Me pueden ayudar a confirmar mi pedido por favor?`;
    return `https://wa.me/${tiendaConfig.whatsappSoporte}?text=${encodeURIComponent(msg)}`;
  };

  // Función de envío del pedido contraentrega
  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // 1. Verificar tallas
    if (!areAllSizesValid.value) {
      setErrors((prev) => ({
        ...prev,
        general: 'Por favor selecciona la talla de cada rodillera en el selector antes de enviar.',
      }));
      const selectorElem = document.getElementById('hero-selector') || document.getElementById('packs');
      if (selectorElem) selectorElem.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 2. Validar antispam honeypot y tiempo mínimo
    const elapsedSeconds = Math.round((Date.now() - mountTimeRef.current) / 1000);
    if (empresaHoneypot !== '' || elapsedSeconds < 5) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor tómate unos segundos para verificar los datos de entrega antes de enviar.',
      });
      return;
    }

    // 3. Validar formulario completo con Zod
    const rawData = {
      nombreCompleto,
      celular,
      departamento,
      ciudad,
      direccion,
      indicaciones,
      consentimiento,
      empresa: empresaHoneypot,
    };

    const parsed = clienteFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const newErrors: FormErrors = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path[0] as keyof FormErrors;
        if (!newErrors[path]) {
          newErrors[path] = err.message;
        }
      });
      setErrors(newErrors);

      // Foco en el primer campo erróneo
      const firstKey = parsed.error.errors[0]?.path[0];
      if (firstKey && formRef.current) {
        const input = formRef.current.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        if (input) input.focus();
      }
      return;
    }

    // 4. Preparar payload conforme al contrato de NexoBite
    setIsSubmitting(true);
    setStatusMessage({ type: 'sending', text: 'Enviando tu pedido contraentrega…' });

    // Cookies y atribución
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : '';
    };

    const fbclid = sessionStorage.getItem('viraly_fbclid') || '';
    const fbp = getCookie('_fbp') || '';
    let fbc = getCookie('_fbc') || '';
    if (!fbc && fbclid) {
      fbc = `fb.1.${mountTimeRef.current}.${fbclid}`;
    }

    const isPro = selectedModelId.value === 'pro';
    const providerProductId = isPro
      ? (import.meta.env.PUBLIC_NEXOBITE_PRODUCT_ID_PRO || import.meta.env.PUBLIC_NEXOBITE_PRODUCT_ID || '2243236')
      : (import.meta.env.PUBLIC_NEXOBITE_PRODUCT_ID || '2243235');

    const canonicalLanding = window.location.origin + window.location.pathname.replace(/\/$/, '');
    const cleanPhone = '+57' + parsed.data.celular;
    const units = currentPack.value.unidades;
    const total = currentPrice.value;
    const unitPrice = Math.round(total / units);

    const payload: NexobiteLeadPayload = {
      pedidoId: pedidoIdRef.current,
      fecha: new Date().toISOString(),
      tienda: tiendaConfig.nombreTienda,
      landing: canonicalLanding,
      campaignSlug: import.meta.env.PUBLIC_NEXOBITE_CAMPAIGN_SLUG || 'campana-rodillera-viraly',
      producto: {
        providerProductId: String(providerProductId),
        nombre: isPro ? `FlexiKnee Pro · ${currentPack.value.nombre}` : `FlexiKnee Clásica · ${currentPack.value.nombre}`,
        sku: isPro ? 'FLX-PRO' : 'FLX-CLA',
        variante: `${isPro ? 'Pro' : 'Clásica'} · Tallas: ${selectedSizes.value.join(', ')}`,
        paquete: currentPack.value.nombre,
        cantidad: units,
        extras: [],
        precioUnitario: unitPrice,
        total: total,
      },
      cliente: {
        nombreCompleto: parsed.data.nombreCompleto,
        celular: cleanPhone,
        departamento: parsed.data.departamento,
        ciudad: parsed.data.ciudad,
        direccion: parsed.data.direccion,
        indicaciones: parsed.data.indicaciones || '',
      },
      consentimiento: true,
      origen: {
        utm_source: sessionStorage.getItem('viraly_utm_source') || '',
        utm_medium: sessionStorage.getItem('viraly_utm_medium') || '',
        utm_campaign: sessionStorage.getItem('viraly_utm_campaign') || '',
        utm_content: sessionStorage.getItem('viraly_utm_content') || '',
        fbclid: fbclid,
        referrer: sessionStorage.getItem('viraly_referrer') || '',
        fbp: fbp,
        fbc: fbc,
      },
      antispam: {
        empresa: '',
        segundos: elapsedSeconds,
      },
    };

    // 5. Enviar POST con fetch directo y timeout de 15 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const endpointUrl =
      import.meta.env.PUBLIC_NEXOBITE_API_URL ||
      `https://api.nexobite.com/api/v1/public/dropshipping/${payload.campaignSlug}/leads`;

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Manejo de respuestas
      if (response.status === 200 || response.status === 201) {
        const json = await response.json().catch(() => ({}));

        // Caso duplicado devuelto por la API
        if (json?.data?.duplicate === true) {
          setIsSubmitting(false);
          setStatusMessage({
            type: 'duplicate',
            text: 'Ya tienes un pedido en curso con estos datos. Te contactaremos telefónicamente para confirmarlo.',
          });
          return;
        }

        // Éxito total: limpiar borrador y persistir resumen
        try {
          localStorage.removeItem('viraly_pedido_draft');
          const resumen = {
            pedidoId: payload.pedidoId,
            orderId: json?.data?.orderId || payload.pedidoId,
            nombre: payload.cliente.nombreCompleto,
            modelo: isPro ? 'Rodillera De Compresion Pro con dial' : 'Rodillera De Compresion Clásica',
            pack: payload.producto.paquete,
            tallas: selectedSizes.value.join(', '),
            total: payload.producto.total,
            ciudad: `${payload.cliente.ciudad}, ${payload.cliente.departamento}`,
            direccion: payload.cliente.direccion,
            fecha: payload.fecha,
          };
          localStorage.setItem('ultimo_pedido_resumen', JSON.stringify(resumen));
        } catch {
          // Ignorar restricciones locales
        }

        // Redirección inmediata a página de agradecimiento
        window.location.href = `/gracias?id=${encodeURIComponent(payload.pedidoId)}`;
        return;
      }

      if (response.status === 429) {
        setIsSubmitting(false);
        setRateLimitCountdown(60);
        setStatusMessage({
          type: 'rateLimit',
          text: 'Recibimos varios intentos seguidos. Espera un minuto e inténtalo de nuevo.',
        });
        return;
      }

      if (response.status === 404 || response.status === 422) {
        setIsSubmitting(false);
        setStatusMessage({
          type: 'unavailable',
          text: 'Este producto no está disponible en este momento.',
        });
        return;
      }

      // Otros códigos de error
      throw new Error(`Error en servidor: ${response.status}`);
    } catch (err: any) {
      clearTimeout(timeoutId);
      setIsSubmitting(false);

      if (err.name === 'AbortError') {
        setStatusMessage({
          type: 'error',
          text: 'El servidor tardó en responder. Revisa tu conexión e inténtalo de nuevo.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'No pudimos enviar tu pedido. Revisa tu conexión e inténtalo de nuevo.',
        });
      }
    }
  };

  const departamentos = colombiaData ? Object.keys(colombiaData).sort() : [];
  const ciudadesFiltradas = ciudadesDisponibles.filter((c) =>
    c.toLowerCase().includes(ciudadBusqueda.toLowerCase())
  );

  return (
    <div id="pedido" className="scroll-mt-12 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-[var(--color-borde)] shadow-lg">
        {/* Encabezado del Formulario */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black tracking-widest text-[var(--color-teal)] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full uppercase">
            PEDIDO CONTRAENTREGA
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-tinta)] mt-2">
            Déjanos tus datos y te contactamos
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-gris)] mt-1.5 leading-relaxed">
            Confirmamos el pedido contigo antes de despachar. Pagas en efectivo cuando el transportador te entregue.
          </p>
        </div>

        {/* Resumen en vivo de la orden */}
        <div className="bg-[var(--color-niebla)] rounded-2xl p-4 md:p-5 border border-[var(--color-borde)] mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-borde)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-gris)]">
              Resumen de tu pedido
            </span>
            <a
              href="#packs"
              className="text-xs font-bold text-[var(--color-teal)] hover:underline flex items-center gap-1"
            >
              Cambiar selección
            </a>
          </div>

          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
            <div>
              <span className="text-[var(--color-gris)]">Modelo: </span>
              <strong className="text-[var(--color-tinta)]">
                {selectedModelId.value === 'pro'
                  ? 'Rodillera Pro (con dial giratorio)'
                  : 'Rodillera Clásica (gel y resortes)'}
              </strong>
            </div>

            <div>
              <span className="text-[var(--color-gris)]">Paquete: </span>
              <strong className="text-[var(--color-tinta)]">{currentPack.value.nombre}</strong>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <span className="text-[var(--color-gris)]">Tallas por unidad: </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSizes.value.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-2 py-0.5 rounded border border-[var(--color-borde)] font-extrabold text-xs text-[var(--color-tinta)]"
                  >
                    #{idx + 1}: Talla {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--color-borde)] flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[var(--color-gris)]">Pagas al recibir:</span>
              <p className="text-xs text-[var(--color-exito)] font-semibold">Envío gratis incluido</p>
            </div>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-extrabold text-[var(--color-tinta)] tabular-nums">
                ${currentPrice.value.toLocaleString('es-CO')}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
          onFocus={handleFirstFocus}
        >
          {/* Honeypot invisible */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="empresa-hp">Empresa</label>
            <input
              id="empresa-hp"
              type="text"
              name="empresa"
              tabIndex={-1}
              autoComplete="off"
              value={empresaHoneypot}
              onInput={(e) => setEmpresaHoneypot((e.target as HTMLInputElement).value)}
            />
          </div>

          {/* 1. Nombre Completo */}
          <div>
            <label
              htmlFor="nombreCompleto"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-tinta)] mb-1.5"
            >
              Nombre y apellido <span className="text-red-500">*</span>
            </label>
            <input
              id="nombreCompleto"
              name="nombreCompleto"
              type="text"
              autoComplete="name"
              placeholder="Ej. Juan Pérez"
              value={nombreCompleto}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value;
                setNombreCompleto(val);
                if (touchedFields.nombreCompleto) validateField('nombreCompleto', val);
              }}
              onBlur={() => handleBlur('nombreCompleto')}
              aria-invalid={!!errors.nombreCompleto}
              aria-describedby={errors.nombreCompleto ? 'error-nombre' : undefined}
              className={`w-full h-13 px-4 rounded-xl border text-base text-[var(--color-tinta)] placeholder:text-gray-400 outline-none transition-all ${
                errors.nombreCompleto
                  ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-200'
                  : 'border-[var(--color-borde)] focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20'
              }`}
            />
            {errors.nombreCompleto && (
              <p id="error-nombre" className="text-xs text-red-600 mt-1 font-medium">
                {errors.nombreCompleto}
              </p>
            )}
          </div>

          {/* 2. Celular */}
          <div>
            <label
              htmlFor="celular"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-tinta)] mb-1.5"
            >
              Celular de contacto (Colombia) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-gris)] pointer-events-none">
                +57
              </span>
              <input
                id="celular"
                name="celular"
                type="tel"
                autoComplete="tel"
                placeholder="300 123 4567"
                value={formatCelularDisplay(celular)}
                onInput={(e) => {
                  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10);
                  setCelular(raw);
                  if (touchedFields.celular) validateField('celular', raw);
                }}
                onBlur={() => handleBlur('celular')}
                aria-invalid={!!errors.celular}
                aria-describedby={errors.celular ? 'error-celular' : undefined}
                className={`w-full h-13 pl-14 pr-4 rounded-xl border text-base text-[var(--color-tinta)] font-semibold placeholder:text-gray-400 outline-none transition-all tabular-nums ${
                  errors.celular
                    ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-200'
                    : 'border-[var(--color-borde)] focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20'
                }`}
              />
            </div>
            {errors.celular ? (
              <p id="error-celular" className="text-xs text-red-600 mt-1 font-medium">
                {errors.celular}
              </p>
            ) : (
              <p className="text-[11px] text-[var(--color-gris)] mt-1">
                Te escribiremos o llamaremos para coordinar la hora de entrega.
              </p>
            )}
          </div>

          {/* 3. Departamento y Ciudad (DIVIPOLA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departamento */}
            <div>
              <label
                htmlFor="departamento"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--color-tinta)] mb-1.5"
              >
                Departamento <span className="text-red-500">*</span>
              </label>
              <select
                id="departamento"
                name="departamento"
                value={departamento}
                onChange={(e) => {
                  const val = (e.target as HTMLSelectElement).value;
                  setDepartamento(val);
                  validateField('departamento', val);
                }}
                onBlur={() => handleBlur('departamento')}
                aria-invalid={!!errors.departamento}
                aria-describedby={errors.departamento ? 'error-departamento' : undefined}
                className={`w-full h-13 px-4 rounded-xl border text-base text-[var(--color-tinta)] bg-white outline-none cursor-pointer ${
                  errors.departamento
                    ? 'border-red-500 bg-red-50/20'
                    : 'border-[var(--color-borde)] focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20'
                }`}
              >
                <option value="">Selecciona departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              {errors.departamento && (
                <p id="error-departamento" className="text-xs text-red-600 mt-1 font-medium">
                  {errors.departamento}
                </p>
              )}
            </div>

            {/* Ciudad o Municipio */}
            <div className="relative">
              <label
                htmlFor="ciudad"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--color-tinta)] mb-1.5"
              >
                Ciudad o municipio <span className="text-red-500">*</span>
              </label>
              <input
                id="ciudad"
                name="ciudad"
                type="text"
                autoComplete="address-level2"
                disabled={!departamento}
                placeholder={departamento ? 'Escribe o busca tu ciudad…' : 'Elige departamento primero'}
                value={ciudadBusqueda || ciudad}
                onFocus={() => setIsCityDropdownOpen(true)}
                onInput={(e) => {
                  const val = (e.target as HTMLInputElement).value;
                  setCiudadBusqueda(val);
                  setIsCityDropdownOpen(true);
                  if (ciudadesDisponibles.includes(val)) {
                    setCiudad(val);
                    validateField('ciudad', val);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setIsCityDropdownOpen(false), 200);
                  handleBlur('ciudad');
                }}
                aria-invalid={!!errors.ciudad}
                aria-describedby={errors.ciudad ? 'error-ciudad' : undefined}
                className={`w-full h-13 px-4 rounded-xl border text-base text-[var(--color-tinta)] outline-none ${
                  !departamento
                    ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                    : errors.ciudad
                    ? 'border-red-500 bg-red-50/20'
                    : 'border-[var(--color-borde)] focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20'
                }`}
              />

              {/* Menú desplegable combobox de búsqueda */}
              {isCityDropdownOpen && departamento && (
                <div className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-white border border-[var(--color-borde)] rounded-xl shadow-lg z-30 divide-y divide-gray-100">
                  {ciudadesFiltradas.length > 0 ? (
                    ciudadesFiltradas.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onMouseDown={() => {
                          setCiudad(c);
                          setCiudadBusqueda(c);
                          setIsCityDropdownOpen(false);
                          validateField('ciudad', c);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-sky-50 text-[var(--color-tinta)] font-medium cursor-pointer"
                      >
                        {c}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-[var(--color-gris)]">
                      No se encontraron resultados exactos. Puedes dejar el nombre escrito.
                    </div>
                  )}
                </div>
              )}

              {errors.ciudad && (
                <p id="error-ciudad" className="text-xs text-red-600 mt-1 font-medium">
                  {errors.ciudad}
                </p>
              )}
            </div>
          </div>

          {/* 4. Dirección de Entrega */}
          <div>
            <label
              htmlFor="direccion"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-tinta)] mb-1.5"
            >
              Dirección exacta de entrega <span className="text-red-500">*</span>
            </label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              autoComplete="street-address"
              placeholder="Ej. Calle 45 # 12-30, Casa 4 o Apto 302"
              value={direccion}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value;
                setDireccion(val);
                if (touchedFields.direccion) validateField('direccion', val);
              }}
              onBlur={() => handleBlur('direccion')}
              aria-invalid={!!errors.direccion}
              aria-describedby={errors.direccion ? 'error-direccion' : undefined}
              className={`w-full h-13 px-4 rounded-xl border text-base text-[var(--color-tinta)] outline-none ${
                errors.direccion
                  ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-200'
                  : 'border-[var(--color-borde)] focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20'
              }`}
            />
            {errors.direccion && (
              <p id="error-direccion" className="text-xs text-red-600 mt-1 font-medium">
                {errors.direccion}
              </p>
            )}
          </div>

          {/* 5. Indicaciones Adicionales (Opcional) */}
          <div>
            <label
              htmlFor="indicaciones"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-gris)] mb-1.5"
            >
              Indicaciones adicionales para la entrega (opcional)
            </label>
            <input
              id="indicaciones"
              name="indicaciones"
              type="text"
              maxLength={300}
              placeholder="Ej. Dejar en portería, portón azul, timbrar al 201..."
              value={indicaciones}
              onInput={(e) => setIndicaciones((e.target as HTMLInputElement).value)}
              className="w-full h-12 px-4 rounded-xl border border-[var(--color-borde)] text-sm text-[var(--color-tinta)] focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20 outline-none"
            />
          </div>

          {/* 6. Casilla Obligatoria de Tratamiento de Datos (Ley 1581) */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="consentimiento"
                checked={consentimiento}
                onChange={(e) => {
                  const val = (e.target as HTMLInputElement).checked;
                  setConsentimiento(val);
                  validateField('consentimiento', val);
                }}
                className="w-5 h-5 rounded mt-0.5 border-gray-300 text-[var(--color-teal)] focus:ring-[var(--color-teal)] cursor-pointer"
              />
              <span className="text-xs text-[var(--color-gris)] leading-relaxed">
                Autorizo el tratamiento de mis datos personales para coordinar y despachar mi pedido, conforme a la{' '}
                <a
                  href="/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-teal)] font-semibold underline hover:text-[var(--color-tinta)]"
                >
                  Política de Privacidad y Tratamiento de Datos (Ley 1581 de 2012)
                </a>
                .
              </span>
            </label>
            {errors.consentimiento && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.consentimiento}</p>
            )}
          </div>

          {/* Mensajes de Estado y Alertas */}
          {statusMessage.type === 'duplicate' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              <div className="flex items-start gap-2.5">
                <span className="text-lg">ℹ️</span>
                <p className="font-semibold">{statusMessage.text}</p>
              </div>
            </div>
          )}

          {statusMessage.type === 'rateLimit' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              <p className="font-semibold">{statusMessage.text}</p>
              {rateLimitCountdown > 0 && (
                <p className="text-xs mt-1">Podrás reintentar en: {rateLimitCountdown} segundos.</p>
              )}
            </div>
          )}

          {statusMessage.type === 'unavailable' && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm space-y-2">
              <p className="font-semibold">{statusMessage.text}</p>
              <a
                href={getWhatsAppSupportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-xs text-white bg-[var(--color-exito)] px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                <span>Consultar disponibilidad por WhatsApp</span>
              </a>
            </div>
          )}

          {statusMessage.type === 'error' && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm space-y-3">
              <p className="font-semibold">{statusMessage.text}</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[var(--color-grafito)] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer transition-colors"
                >
                  Reintentar envío
                </button>
                <a
                  href={getWhatsAppSupportUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 hover:underline"
                >
                  ¿Problemas? Contactar soporte por WhatsApp
                </a>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errors.general}
            </div>
          )}

          {/* Botón Principal de Confirmación */}
          <button
            type="submit"
            disabled={isSubmitting || rateLimitCountdown > 0}
            className="btn-cta w-full h-15 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] disabled:bg-gray-300 disabled:cursor-not-allowed text-[var(--color-tinta)] font-black text-lg rounded-[14px] shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin text-[var(--color-tinta)]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                </svg>
                Enviando tu pedido…
              </span>
            ) : rateLimitCountdown > 0 ? (
              <span>Espera {rateLimitCountdown} s</span>
            ) : (
              <>
                <span>Confirmar mi pedido contraentrega</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>

          {/* Microcopy legal de advertencia */}
          <p className="text-[11px] text-[var(--color-gris)] text-center leading-normal pt-1">
            Al enviar tus datos aceptas que te escribamos o te llamemos para confirmar el pedido. No hacemos cobros automáticos ni guardamos datos de pago.
          </p>
        </form>
      </div>
    </div>
  );
}

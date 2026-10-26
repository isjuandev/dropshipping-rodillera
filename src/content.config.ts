import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const producto = defineCollection({
  loader: file('src/content/producto.json'),
  schema: z.object({
    id: z.string(),
    nombreBase: z.string(),
    modelos: z.array(
      z.object({
        id: z.enum(['clasica', 'pro']),
        nombre: z.string(),
        descripcionCorta: z.string(),
        sku: z.string(),
        precio: z.number(),
        precioAnterior: z.number(),
        imagenes: z.array(z.string()),
        caracteristicas: z.array(
          z.object({
            id: z.string(),
            titulo: z.string(),
            texto: z.string(),
            x: z.number(),
            y: z.number(),
            imagenDetalle: z.string(),
          })
        ),
      })
    ),
    packs: z.array(
      z.object({
        id: z.string(),
        nombre: z.string(),
        unidades: z.number(),
        precios: z.record(z.number()),
        ahorroTexto: z.string(),
        etiqueta: z.string().optional(),
      })
    ),
    tallas: z.array(
      z.object({
        talla: z.string(),
        min: z.number(),
        max: z.number(),
        rangoTexto: z.string(),
      })
    ),
    comparativa: z.array(
      z.object({
        caracteristica: z.string(),
        flexiKnee: z.boolean(),
        comun: z.boolean(),
        venda: z.boolean(),
      })
    ),
    rating: z.number(),
    numResenas: z.number(),
    stock: z.number(),
  }),
});

const testimonios = defineCollection({
  loader: file('src/content/testimonios.json'),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    ciudad: z.string(),
    actividad: z.string(),
    foto: z.string(),
    texto: z.string(),
    estrellas: z.number(),
  }),
});

const faqs = defineCollection({
  loader: file('src/content/faqs.json'),
  schema: z.object({
    id: z.string(),
    pregunta: z.string(),
    respuesta: z.string(),
    orden: z.number(),
  }),
});

export const collections = { producto, testimonios, faqs };

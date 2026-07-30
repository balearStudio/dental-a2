# A2 Dental — Rediseño web

Rediseño moderno de la web de la clínica dental **A2 Dental**, en Portals (Calvià), Mallorca — a 200 m de Puerto Portals. El objetivo era sustituir la web anterior, de aspecto anticuado, por un diseño actual, minimalista y profesional, reutilizando el contenido real de la clínica.

Cada página es autónoma (HTML, CSS y JS en línea, con el logotipo incrustado) y solo depende de la carpeta [`images/`](images/). Se puede subir tal cual a cualquier hosting estático.

### Estructura (una URL por idioma, para SEO)

| Idioma | Archivo | URL actual (GitHub Pages) |
| --- | --- | --- |
| Español (por defecto) | [`index.html`](index.html) | `…/dental-a2/` |
| Inglés | [`en/index.html`](en/index.html) | `…/dental-a2/en/` |
| Alemán | [`de/index.html`](de/index.html) | `…/dental-a2/de/` |

Publicado en `https://danielramoshoogwout.github.io/dental-a2/`. Las tres páginas se enlazan entre sí con `hreflang` + `canonical`, de modo que Google indexa y posiciona cada idioma como una página propia. La URL base está centralizada en el generador ([`build/generate.js`](build/generate.js)) para poder cambiarla al dominio real de un solo sitio.

## Identidad visual

Toma como base el **logotipo original de A2 Dental** (el "A2 DENTAL" de línea fina dentro de un arco/círculo abierto) y extiende su lenguaje a toda la web:

- **Estilo minimalista**: tipografía de peso ligero, líneas finas de 1px, iconos de trazo, mucho espacio en blanco y sombras muy suaves.
- **Paleta monocromo + oro**, tomada de la marca:
  - Fondo porcelana `#FBFAF7` · tinta casi negra `#1A1A18` · gris de texto `#7E7C74`
  - Acento corporativo **oro `#C6A245`**, usado con contención (cenefas, subrayados al pasar el cursor, botón principal, acentos del bloque de contacto).
- **Logotipo original incrustado** como *data URI* dentro del CSS (variable `--logo`), presente en la barra de navegación, el menú móvil, el hero y el pie. En modo oscuro se aclara automáticamente mediante un filtro.

## Secciones

- **Navegación** fija con logo, menú y botón "Pedir cita".
- **Hero**: titular, texto, CTAs y datos clave (+15 años, 11 especialidades, 200 m del puerto), con una composición de anillos abiertos que evoca el círculo del logo y tarjetas flotantes de ubicación y teléfono.
- **Formación y acreditaciones**: banda centrada (Invisalign, NYU, WFO, Dentistes Balears, Consejo de Dentistas) con separadores finos.
- **Tratamientos**: un tratamiento destacado (Estética y diseño digital de sonrisa) en banner, más una matriz de 8 tratamientos unida por líneas finas — Implantes, Ortodoncia Invisalign, Odontología conservadora, Cirugía oral, Periodoncia, Bruxismo, Odontopediatría y Radiología digital.
- **Filosofía**: cita de los fundadores y los 5 pilares (trato personalizado, excelencia profesional, compromiso del equipo, ética y responsabilidad).
- **Equipo**: los dos fundadores (Dra. Anna Nilsson y Dr. Alberto Rico), cada uno con su foto recortada (sin fondo, sobre un círculo con aro dorado), una explicación de su perfil y un *quote* dirigido al paciente. Las imágenes están en [`images/`](images/).
- **Contacto**: dirección, teléfono, WhatsApp, email y horarios reales, con CTAs directos.
- **Pie**: navegación secundaria, eslogan "Be proud of your smile" y redes sociales.

## Características técnicas

- **Multiidioma (ES / EN / DE)**: una página estática por idioma con el texto ya escrito en el HTML (no traducción por JS). El selector de la barra y del menú móvil son enlaces reales entre `/`, `/en/` y `/de/`, con el idioma activo resaltado.
- **SEO**: `<title>` y `meta description` propios por idioma, `hreflang` (es/en/de + `x-default`) y `canonical`, etiquetas Open Graph/Twitter para compartir, y **datos estructurados JSON-LD `Dentist`** (nombre, dirección, geolocalización, teléfono, horario) para el SEO local, Google Maps y resultados enriquecidos. Contenido servido en HTML (no inyectado por JS) y sin peticiones externas → muy buen rendimiento.
- **Responsive**: escritorio, tablet y móvil (incluye menú lateral desplegable).
- **Modo claro y oscuro**: respeta la preferencia del sistema y permite alternarlo con el botón del tema.
- **Accesibilidad**: etiquetas `aria`, textos alternativos e imágenes decorativas marcadas como tales.
- **Animaciones sutiles** de aparición al hacer scroll, desactivadas si el usuario prefiere reducir el movimiento (`prefers-reduced-motion`).

## Datos de la clínica

- **Dirección**: C/ Miguel de Cervantes 13, Planta 1 · 07181 Portals, Calvià · Mallorca
- **Teléfono**: +34 971 20 11 23 · **WhatsApp**: +34 696 13 34 10
- **Email**: info@a2dentalmallorca.com
- **Horario**: Lun–Jue 11:00–19:00 · Vie 09:00–17:00

## Generar las páginas (build)

Para no editar tres HTML a mano, las páginas se **generan** a partir de una única fuente:

- **[`build/source.html`](build/source.html)** — fuente de la verdad: contiene el diccionario de textos `T` (ES/EN/DE) y el marcado con atributos `data-i18n`.
- **[`build/generate.js`](build/generate.js)** — genera `index.html`, `en/index.html` y `de/index.html` (con el texto ya escrito en cada idioma) más `sitemap.xml`, `robots.txt`, `.nojekyll` y, si se configura, `CNAME`.
- **[`build/make-favicon.js`](build/make-favicon.js)** — a partir de `build/favicon-source.png` (logo A2 cuadrado, transparente) crea el favicon con **fondo blanco**: `favicon.svg` (vectorial, nítido a cualquier tamaño) e `images/favicon.png` (270×270, para iOS y navegadores antiguos). Solo hay que reejecutarlo si cambia el logo.

```bash
node build/generate.js      # páginas + sitemap/robots
node build/make-favicon.js  # favicon (solo si cambia el logo)
```

Para **cambiar un texto o traducción**, edita el diccionario `T` en `build/source.html` y vuelve a ejecutar el generador. La configuración está al principio de `build/generate.js`:

```js
const SITE = 'https://danielramoshoogwout.github.io/dental-a2'; // URL base (sin barra final)
const CUSTOM_DOMAIN = '';   // p. ej. 'www.a2dentalmallorca.com' para emitir un CNAME
```

## Despliegue en GitHub Pages

Publicado actualmente como *project page* en `https://danielramoshoogwout.github.io/dental-a2/`:

1. **Settings → Pages** → *Source: Deploy from a branch* → rama `main`, carpeta `/ (root)`.
2. Listo: se sirve en `…/dental-a2/`. Las carpetas `en/` y `de/` se sirven solas (`/dental-a2/en/`, `/dental-a2/de/`).

Archivos de apoyo ya incluidos: `sitemap.xml` (con alternativas `hreflang`), `robots.txt`, `.nojekyll`, y logo e imagen social **autoalojados** en `images/` (`logo-a2.png`, `og-a2.jpg`) para que el JSON-LD y Open Graph no dependan del WordPress anterior.

> Nota: en una *project page* el `robots.txt` del subpath no lo lee Google (busca el del dominio raíz), pero el `sitemap.xml` se puede enviar a mano en Google Search Console. Sin `CNAME`, GitHub Pages sirve en `github.io` (correcto para esta fase de prueba).

### Migrar al dominio propio (más adelante)

Cuando el cliente apruebe y quieras usar `a2dentalmallorca.com`:

1. En `build/generate.js`: `SITE = 'https://www.a2dentalmallorca.com'` y `CUSTOM_DOMAIN = 'www.a2dentalmallorca.com'`; ejecuta `node build/generate.js` (regenera los tags SEO y crea el `CNAME`).
2. **DNS**: `CNAME` de `www` → `<usuario>.github.io` (y registros `A` a las IPs de GitHub Pages para el dominio raíz).
3. **Settings → Pages → Custom domain** = `www.a2dentalmallorca.com` + **Enforce HTTPS**.

> ⚠️ Apuntar `a2dentalmallorca.com` a GitHub Pages **sustituye la web WordPress actual** de ese dominio. Hazlo solo al publicar de verdad.

## Tareas pendientes

Todo lo editable vive en `build/source.html`; tras cambiarlo, ejecutar `node build/generate.js`.

### Contenido (validar con la clínica)

- [ ] Verificar los datos redactados en el hero (p. ej. "+15 años de experiencia", "11 especialidades").
- [ ] Confirmar nombres completos, perfiles y *quotes* del equipo (redactados a partir de sus especialidades; validarlos con los propios doctores).
- [ ] Revisar las traducciones al inglés y alemán con un hablante nativo.
- [ ] Sustituir los enlaces de Instagram y Facebook (ahora `#`) por las URLs reales.

### SEO y datos técnicos

- [ ] Verificar las coordenadas geográficas del JSON-LD (`geo`, ahora aproximadas: 39.5350, 2.5556) con la ubicación exacta de la clínica.
- [ ] Añadir las redes reales al campo `sameAs` del JSON-LD (refuerza el SEO local).
- [ ] Tras publicar, enviar el `sitemap.xml` en Google Search Console.

### Publicación

- [ ] Activar GitHub Pages (**Settings → Pages** → `main` / root) y comprobar que se ve en `…/dental-a2/`.
- [ ] Comprobar que el cambio de idioma (ES/EN/DE) y las imágenes cargan bien ya publicado.
- [ ] Cuando el cliente apruebe: migrar al dominio propio (ver [Migrar al dominio propio](#migrar-al-dominio-propio-más-adelante)).

### Opcional (mejoras futuras)

- [ ] Añadir fotos reales de la clínica.
- [ ] Incrustar un mapa de Google en la sección de contacto.

> **Nota de mantenimiento:** hay una página por idioma, así que **no edites los HTML generados a mano**. Cambia el texto en `build/source.html` y ejecuta `node build/generate.js` (ver [Generar las páginas](#generar-las-páginas-build)).

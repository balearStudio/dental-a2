# A2 Dental — Rediseño web

Rediseño moderno de la web de la clínica dental **A2 Dental**, en Portals (Calvià), Mallorca — a 200 m de Puerto Portals. El objetivo era sustituir la web anterior, de aspecto anticuado, por un diseño actual, minimalista y profesional, reutilizando el contenido real de la clínica.

El sitio completo es **un único archivo** ([`index.html`](index.html)), sin dependencias externas: HTML, CSS y JS en línea, y el logotipo incrustado. Se puede subir tal cual a cualquier hosting o abrir directamente en el navegador.

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

- **Responsive**: escritorio, tablet y móvil (incluye menú lateral desplegable).
- **Modo claro y oscuro**: respeta la preferencia del sistema y permite alternarlo con el botón del tema.
- **Accesibilidad**: etiquetas `aria`, textos alternativos e imágenes decorativas marcadas como tales.
- **Animaciones sutiles** de aparición al hacer scroll, desactivadas si el usuario prefiere reducir el movimiento (`prefers-reduced-motion`).

## Datos de la clínica

- **Dirección**: C/ Miguel de Cervantes 13, Planta 1 · 07181 Portals, Calvià · Mallorca
- **Teléfono**: +34 971 20 11 23 · **WhatsApp**: +34 696 13 34 10
- **Email**: info@a2dentalmallorca.com
- **Horario**: Lun–Jue 11:00–19:00 · Vie 09:00–17:00

## Pendiente de revisar

Antes de publicar conviene ajustar algunos detalles añadidos durante el rediseño:

- Verificar los datos redactados en el hero (p. ej. "+15 años de experiencia").
- Confirmar nombres completos, perfiles y *quotes* del equipo (redactados a partir de sus especialidades; conviene validarlos con los propios doctores).
- Sustituir los enlaces de Instagram y Facebook (ahora `#`) por las URLs reales.
- Opcional: añadir fotos reales de la clínica y un mapa de Google.

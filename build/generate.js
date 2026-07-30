'use strict';
const fs = require('fs');
const path = require('path');

// ===================== CONFIG =====================
// Base URL where the site is served (NO trailing slash).
// GitHub Pages project page (current):
const SITE = 'https://danielramoshoogwout.github.io/dental-a2';
// For the real domain later, use instead:
//   const SITE = 'https://www.a2dentalmallorca.com';
// and set CUSTOM_DOMAIN to emit a CNAME file (leave '' to skip):
const CUSTOM_DOMAIN = ''; // e.g. 'www.a2dentalmallorca.com'
// ==================================================

const ROOT = path.join(__dirname, '..');
// source of truth: single file with the i18n dictionary + data-i18n markup
const src = fs.readFileSync(path.join(__dirname, 'source.html'), 'utf8');
const LOGO = SITE + '/images/logo-a2.png';
const OGIMG = SITE + '/images/og-a2.jpg';

// ---- extract pieces ----
const styleMatch = src.match(/<style>[\s\S]*?<\/style>/);
let styleBlock = styleMatch[0];
const scriptStart = src.indexOf('<script>');
const bodyStart = styleMatch.index + styleBlock.length;
let bodyTemplate = src.slice(bodyStart, scriptStart).trim();

// ---- extract dictionary T ----
const tMatch = src.match(/var T = (\{[\s\S]*?\});\s*\n\s*var LANGS/);
const T = eval('(' + tMatch[1] + ')');

// ---- adapt style: lang-switch buttons -> anchors ----
styleBlock = styleBlock.replace(/\.lang-switch button/g, '.lang-switch a');
styleBlock = styleBlock.replace('</style>', '  .lang-switch a { text-decoration: none; display: inline-flex; align-items: center; }\n</style>');

// ---- per-language head data ----
const META = {
  es: {
    title: T['doc.title'].es,
    desc: 'Clínica dental A2 en Portals (Calvià), a 200 m de Puerto Portals. Estética dental, implantes, ortodoncia Invisalign y más. Be proud of your smile.',
    ogLocale: 'es_ES',
    ldName: 'A2 Dental — Clínica dental en Portals, Mallorca',
    ldDesc: 'Clínica dental en Portals (Calvià), a 200 m de Puerto Portals. Estética dental, implantes, ortodoncia Invisalign, cirugía y más.'
  },
  en: {
    title: T['doc.title'].en,
    desc: 'A2 Dental clinic in Portals (Calvià), 200 m from Puerto Portals. Dental aesthetics, implants, Invisalign orthodontics and more. Be proud of your smile.',
    ogLocale: 'en_GB',
    ldName: 'A2 Dental — Dental clinic in Portals, Mallorca',
    ldDesc: 'Dental clinic in Portals (Calvià), 200 m from Puerto Portals. Dental aesthetics, implants, Invisalign orthodontics, surgery and more.'
  },
  de: {
    title: T['doc.title'].de,
    desc: 'Zahnklinik A2 in Portals (Calvià), 200 m vom Puerto Portals. Ästhetische Zahnheilkunde, Implantate, Invisalign und mehr. Be proud of your smile.',
    ogLocale: 'de_DE',
    ldName: 'A2 Dental — Zahnklinik in Portals, Mallorca',
    ldDesc: 'Zahnklinik in Portals (Calvià), 200 m vom Puerto Portals. Ästhetische Zahnheilkunde, Implantate, Invisalign, Chirurgie und mehr.'
  }
};

// canonical + hreflang URLs (per language, absolute)
const URLS = { es: SITE + '/', en: SITE + '/en/', de: SITE + '/de/' };
// relative switch hrefs from each page (work locally and hosted)
const SWITCH = {
  es: { es: './', en: 'en/', de: 'de/' },
  en: { es: '../', en: './', de: '../de/' },
  de: { es: '../', en: '../en/', de: './' }
};

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function jsonld(lang) {
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'A2 Dental',
    alternateName: META[lang].ldName,
    description: META[lang].ldDesc,
    url: URLS[lang],
    image: LOGO,
    logo: LOGO,
    telephone: '+34971201123',
    email: 'info@a2dentalmallorca.com',
    priceRange: '€€',
    inLanguage: lang,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C/ Miguel de Cervantes 13, Planta 1',
      addressLocality: 'Portals Nous, Calvià',
      addressRegion: 'Illes Balears',
      postalCode: '07181',
      addressCountry: 'ES'
    },
    geo: { '@type': 'GeoCoordinates', latitude: 39.5350, longitude: 2.5556 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '11:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '17:00' }
    ]
  };
  return JSON.stringify(obj, null, 2);
}

function head(lang) {
  const m = META[lang];
  const rel = lang === 'es' ? '' : '../'; // subfolder pages reach root assets via ../
  const alt = ['es', 'en', 'de'].map(l =>
    `  <link rel="alternate" hreflang="${l}" href="${URLS[l]}" />`).join('\n');
  return [
    '<!doctype html>',
    `<html lang="${lang}">`,
    '<head>',
    '  <meta charset="utf-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    '  <meta name="theme-color" content="#FBFAF7" />',
    `  <link rel="icon" type="image/svg+xml" href="${rel}favicon.svg" />`,
    `  <link rel="icon" type="image/png" sizes="270x270" href="${rel}images/favicon.png" />`,
    `  <link rel="apple-touch-icon" href="${rel}images/favicon.png" />`,
    `  <title>${esc(m.title)}</title>`,
    `  <meta name="description" content="${esc(m.desc)}" />`,
    `  <link rel="canonical" href="${URLS[lang]}" />`,
    alt,
    `  <link rel="alternate" hreflang="x-default" href="${URLS.es}" />`,
    `  <meta property="og:type" content="website" />`,
    `  <meta property="og:site_name" content="A2 Dental" />`,
    `  <meta property="og:locale" content="${m.ogLocale}" />`,
    `  <meta property="og:title" content="${esc(m.title)}" />`,
    `  <meta property="og:description" content="${esc(m.desc)}" />`,
    `  <meta property="og:url" content="${URLS[lang]}" />`,
    `  <meta property="og:image" content="${OGIMG}" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <script type="application/ld+json">\n${jsonld(lang)}\n  </script>`,
    styleBlock,
    '</head>'
  ].join('\n');
}

// ---- fresh script (no i18n dictionary needed; content is static per page) ----
const SCRIPT = `<script>
  // theme toggle
  (function () {
    var root = document.documentElement;
    document.getElementById('themeBtn').addEventListener('click', function () {
      var dark = getComputedStyle(root).getPropertyValue('--paper').trim().toLowerCase().indexOf('#1') === 0;
      root.setAttribute('data-theme', dark ? 'light' : 'dark');
    });
  })();

  // sticky nav border
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // mobile drawer
  var drawer = document.getElementById('drawer');
  document.getElementById('menuBtn').addEventListener('click', function () { drawer.classList.add('open'); });
  document.getElementById('closeBtn').addEventListener('click', function () { drawer.classList.remove('open'); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-close]'), function (a) {
    a.addEventListener('click', function () { drawer.classList.remove('open'); });
  });

  // scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
    io.observe(el);
  });
</script>`;

function translateBody(lang) {
  let b = bodyTemplate;
  // replace data-i18n-html (inner may contain tags)
  for (const key in T) {
    const val = T[key][lang];
    if (val == null) continue;
    // data-i18n-html
    let re = new RegExp('(<(\\w+)([^>]*\\bdata-i18n-html="' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*)>)([\\s\\S]*?)(</\\2>)');
    b = b.replace(re, (mm, open, tag, attrs, inner, close) => open + val + close);
  }
  for (const key in T) {
    const val = T[key][lang];
    if (val == null) continue;
    // data-i18n (plain text leaf)
    let re = new RegExp('(<(\\w+)([^>]*\\bdata-i18n="' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*)>)([^<]*)(</\\2>)');
    b = b.replace(re, (mm, open, tag, attrs, inner, close) => open + esc(val) + close);
    // data-i18n-alt (on img)
    let reAlt = new RegExp('(<img[^>]*\\balt=")([^"]*)("[^>]*\\bdata-i18n-alt="' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>)');
    b = b.replace(reAlt, (mm, pre, oldAlt, post) => pre + esc(val) + post);
  }
  // lang switch buttons -> anchors
  const H = SWITCH[lang];
  ['es', 'en', 'de'].forEach(l => {
    const label = l.toUpperCase();
    const cls = l === lang ? ' class="active"' : '';
    const reBtn = new RegExp('<button type="button" data-lang="' + l + '">' + label + '</button>', 'g');
    b = b.replace(reBtn, `<a href="${H[l]}" data-lang="${l}"${cls}>${label}</a>`);
  });
  // fix image paths for subfolder pages
  if (lang !== 'es') b = b.replace(/src="images\//g, 'src="../images/');
  // strip leftover data-i18n* attributes
  b = b.replace(/\s+data-i18n(-html|-alt)?="[^"]*"/g, '');
  return b;
}

function build(lang, outPath) {
  const html = head(lang) + '\n<body>\n\n' + translateBody(lang) + '\n\n' + SCRIPT + '\n</body>\n</html>\n';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('wrote', outPath, html.length, 'bytes');
}

build('es', path.join(ROOT, 'index.html'));
build('en', path.join(ROOT, 'en', 'index.html'));
build('de', path.join(ROOT, 'de', 'index.html'));

// ---- GitHub Pages + SEO support files ----
if (CUSTOM_DOMAIN) fs.writeFileSync(path.join(ROOT, 'CNAME'), CUSTOM_DOMAIN + '\n');
fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n');

const today = new Date().toISOString().slice(0, 10);
function urlEntry(lang) {
  const alts = ['es', 'en', 'de'].map(l =>
    `    <xhtml:link rel="alternate" hreflang="${l}" href="${URLS[l]}"/>`).join('\n');
  return [
    '  <url>',
    `    <loc>${URLS[lang]}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    alts,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${URLS.es}"/>`,
    '  </url>'
  ].join('\n');
}
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  ['es', 'en', 'de'].map(urlEntry).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

console.log('wrote .nojekyll, robots.txt, sitemap.xml' + (CUSTOM_DOMAIN ? ', CNAME' : ' (no CNAME)'));
console.log('base URL:', SITE);
console.log('done');

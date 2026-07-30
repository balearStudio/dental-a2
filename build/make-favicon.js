'use strict';
// Generates a white-background A2 favicon from build/favicon-source.png
// (transparent A2 logo). Produces:
//   - images/favicon.png  (270x270, logo composited on white — PNG fallback / apple-touch)
//   - favicon.svg         (vector white rounded tile + embedded logo — crisp at any size)
// Pure Node (uses built-in zlib); no external image libraries.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'favicon-source.png');
const buf = fs.readFileSync(SRC);

// ---- decode PNG (8-bit RGBA, non-interlaced) ----
if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
const colorType = buf[25];
if (buf[24] !== 8 || colorType !== 6 || buf[28] !== 0) throw new Error('expected 8-bit RGBA non-interlaced');

let idat = [];
let off = 8;
while (off < buf.length) {
  const len = buf.readUInt32BE(off);
  const type = buf.toString('ascii', off + 4, off + 8);
  if (type === 'IDAT') idat.push(buf.slice(off + 8, off + 8 + len));
  if (type === 'IEND') break;
  off += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idat));

// ---- unfilter scanlines ----
const bpp = 4;
const stride = width * bpp;
const rgba = Buffer.alloc(height * stride);
function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}
let rpos = 0;
for (let y = 0; y < height; y++) {
  const ft = raw[rpos++];
  for (let x = 0; x < stride; x++) {
    const v = raw[rpos++];
    const a = x >= bpp ? rgba[y * stride + x - bpp] : 0;
    const b = y > 0 ? rgba[(y - 1) * stride + x] : 0;
    const c = x >= bpp && y > 0 ? rgba[(y - 1) * stride + x - bpp] : 0;
    let out;
    switch (ft) {
      case 0: out = v; break;
      case 1: out = v + a; break;
      case 2: out = v + b; break;
      case 3: out = v + ((a + b) >> 1); break;
      case 4: out = v + paeth(a, b, c); break;
      default: throw new Error('bad filter ' + ft);
    }
    rgba[y * stride + x] = out & 0xff;
  }
}

// ---- composite over white -> RGB ----
const rgb = Buffer.alloc(width * height * 3);
for (let i = 0, j = 0, k = 0; i < width * height; i++, j += 4, k += 3) {
  const a = rgba[j + 3] / 255;
  rgb[k] = Math.round(rgba[j] * a + 255 * (1 - a));
  rgb[k + 1] = Math.round(rgba[j + 1] * a + 255 * (1 - a));
  rgb[k + 2] = Math.round(rgba[j + 2] * a + 255 * (1 - a));
}

// ---- encode PNG (RGB, colortype 2, filter 0) ----
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(b) {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
const ostride = width * 3;
const filtered = Buffer.alloc(height * (ostride + 1));
for (let y = 0; y < height; y++) {
  filtered[y * (ostride + 1)] = 0;
  rgb.copy(filtered, y * (ostride + 1) + 1, y * ostride, y * ostride + ostride);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(filtered, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);
fs.mkdirSync(path.join(ROOT, 'images'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'images', 'favicon.png'), png);
console.log('wrote images/favicon.png', png.length, 'bytes');

// ---- favicon.svg: white rounded tile + embedded original logo ----
const b64 = buf.toString('base64');
const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 270" width="270" height="270">
  <rect width="270" height="270" rx="52" fill="#ffffff"/>
  <image x="18" y="18" width="234" height="234" href="data:image/png;base64,${b64}"/>
</svg>
`;
fs.writeFileSync(path.join(ROOT, 'favicon.svg'), svg);
console.log('wrote favicon.svg', svg.length, 'bytes');

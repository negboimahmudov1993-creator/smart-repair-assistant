import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // Uncompressed scanlines: each row starts with filter byte 0
  const rowSize = 1 + width * 4;
  const rawBuffer = Buffer.alloc(height * rowSize);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawBuffer[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawBuffer[offset++] = r;
      rawBuffer[offset++] = g;
      rawBuffer[offset++] = b;
      rawBuffer[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawBuffer);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression: Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace: None

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const fullData = Buffer.concat([typeBuf, data]);
    const crc = crc32(fullData);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, fullData, crcBuf]);
  }

  // Simple CRC32 implementation
  function crc32(buf) {
    let c = 0xffffffff;
    for (let n = 0; n < buf.length; n++) {
      c ^= buf[n];
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw a modern orange/slate repair assistant icon
function iconRenderer(isMaskable = false) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = w / 2;

    // Corner radius for rounded rect
    const pad = isMaskable ? 0 : w * 0.12;
    const cornerR = w * 0.22;
    
    // Check if within rounded rect bounds
    const rx = Math.max(0, Math.abs(dx) - (cx - pad - cornerR));
    const ry = Math.max(0, Math.abs(dy) - (cy - pad - cornerR));
    const cornerDist = Math.sqrt(rx * rx + ry * ry);

    if (!isMaskable && (rx > 0 || ry > 0) && cornerDist > cornerR) {
      return [0, 0, 0, 0]; // Transparent outside
    }

    // Background gradient: dark slate with warm orange ambient
    const t = y / h;
    let r = Math.round(15 + t * 18);
    let g = Math.round(23 + t * 24);
    let b = Math.round(42 + t * 30);

    // Glowing center
    if (dist < maxRadius * 0.6) {
      const glow = (1 - dist / (maxRadius * 0.6)) * 0.35;
      r = Math.min(255, Math.round(r + 234 * glow));
      g = Math.min(255, Math.round(g + 88 * glow));
      b = Math.min(255, Math.round(b + 12 * glow));
    }

    // Wrench shape representation
    // Diagonal bar from (0.35, 0.65) to (0.65, 0.35)
    const normX = (x - cx) / w;
    const normY = (y - cy) / h;
    const d1 = (normX + normY) / Math.SQRT2;
    const d2 = (-normX + normY) / Math.SQRT2;

    // Center tool head
    if (Math.abs(d2) < 0.08 && Math.abs(d1) < 0.32) {
      // Main wrench handle: bright orange gradient
      const handleT = (d1 + 0.32) / 0.64;
      return [
        Math.round(249 - handleT * 20),
        Math.round(115 - handleT * 30),
        Math.round(22 - handleT * 10),
        255
      ];
    }

    // Wrench head 1
    const head1Dist = Math.hypot(normX - 0.22, normY + 0.22);
    if (head1Dist < 0.14) {
      if (head1Dist > 0.05 && normX + normY > 0.08) {
        return [251, 146, 60, 255];
      }
      return [234, 88, 12, 255];
    }

    // AI Sparkle at top right
    const sparkDist = Math.hypot(normX - 0.26, normY + 0.26);
    if (sparkDist < 0.045) {
      return [250, 204, 21, 255];
    }

    return [r, g, b, 255];
  };
}

const outDir = path.resolve('./public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPNG(192, 192, iconRenderer(false)));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPNG(512, 512, iconRenderer(false)));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180, 180, iconRenderer(false)));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, iconRenderer(true)));

console.log('Icons generated successfully in /public!');

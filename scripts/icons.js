const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const crcTable = Array.from({length:256}, (_, n) => { let c=n; for(let k=0;k<8;k++) c=(c&1)?0xedb88320^(c>>>1):c>>>1; return c>>>0; });
function crc32(buf) { let c=0xffffffff; for(const b of buf)c=crcTable[(c^b)&255]^(c>>>8); return (c^0xffffffff)>>>0; }
function chunk(type,data) { const t=Buffer.from(type); const out=Buffer.alloc(data.length+12); out.writeUInt32BE(data.length,0); t.copy(out,4); data.copy(out,8); out.writeUInt32BE(crc32(Buffer.concat([t,data])),data.length+8); return out; }
function icon(size) {
  const rows=[]; const cx=size/2, cy=size/2;
  for(let y=0;y<size;y++) { const row=Buffer.alloc(1+size*4); for(let x=0;x<size;x++) { let color=[37,42,49,255]; const d=Math.hypot(x-cx,y-cy); if(d<size*.34) color=[243,244,246,255]; const stem=x>size*.43&&x<size*.49&&y>size*.31&&y<size*.70; const top=y>size*.31&&y<size*.38&&x>size*.43&&x<size*.64; const mid=y>size*.47&&y<size*.54&&x>size*.43&&x<size*.60; if(stem||top||mid) color=[79,111,215,255]; const i=1+x*4; row.set(color,i); } rows.push(row); }
  const ihdr=Buffer.alloc(13); ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4); ihdr.set([8,6,0,0,0],8);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("IDAT",zlib.deflateSync(Buffer.concat(rows))),chunk("IEND",Buffer.alloc(0))]);
}
for(const size of [192,512]) fs.writeFileSync(path.join(__dirname,"..",`icon-${size}.png`),icon(size));

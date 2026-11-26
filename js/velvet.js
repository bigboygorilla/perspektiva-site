import * as THREE from "three";
/* Бархат: «мятый» ворс (пятна светлее/темнее), мелкий ворс в карте нормалей, мягкий отблеск по краям (sheen) */
function noiseCanvas(size, blobs, rmin, rmax, alpha){
  const c = document.createElement("canvas"); c.width = c.height = size; const x = c.getContext("2d");
  x.fillStyle = "#e4e4e4"; x.fillRect(0, 0, size, size);
  for(let i = 0; i < blobs; i++){
    const r = rmin + Math.random() * (rmax - rmin), px = Math.random() * size, py = Math.random() * size, l = Math.random() < .5 ? 255 : 0;
    for(const [dx, dy] of [[0,0],[size,0],[-size,0],[0,size],[0,-size]]){ // бесшовно
      const g = x.createRadialGradient(px+dx, py+dy, 0, px+dx, py+dy, r);
      g.addColorStop(0, `rgba(${l},${l},${l},${alpha})`); g.addColorStop(1, `rgba(${l},${l},${l},0)`);
      x.fillStyle = g; x.fillRect(px+dx-r, py+dy-r, r*2, r*2); }
  }
  return c;
}
let velvetTex = null;
function velvetMaps(){
  if(velvetTex) return velvetTex;
  const crush = noiseCanvas(512, 180, 40, 150, .06);             // «мятые» пятна, как на настоящем бархате
  const fine = noiseCanvas(512, 5000, 1, 3, .5);                 // ворс
  const ctx = crush.getContext("2d"); ctx.globalAlpha = .25; ctx.drawImage(fine, 0, 0); ctx.globalAlpha = 1;
  // карта нормалей из мелкого ворса
  const f = fine.getContext("2d").getImageData(0, 0, 512, 512).data, n = document.createElement("canvas"); n.width = n.height = 512;
  const nc = n.getContext("2d"), nd = nc.createImageData(512, 512);
  for(let y = 0; y < 512; y++) for(let x = 0; x < 512; x++){
    const i = (y*512 + x)*4, l = f[(y*512 + ((x+1)&511))*4] - f[i], d = f[(((y+1)&511)*512 + x)*4] - f[i];
    nd.data[i] = 128 - l*.6; nd.data[i+1] = 128 - d*.6; nd.data[i+2] = 255; nd.data[i+3] = 255; }
  nc.putImageData(nd, 0, 0);
  const mk = (c, srgb) => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; if(srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  return velvetTex = { map: mk(crush, true), normal: mk(n, false) };
}
export function velvetMat(color){
  const t = velvetMaps();
  // цвет из Blender уже линейный; карта «мятости» — светло-серая вокруг 0.5, поэтому чуть усиливаем цвет
  return new THREE.MeshPhysicalMaterial({ color: color.clone().multiplyScalar(1.3), map: t.map, normalMap: t.normal,
    normalScale: new THREE.Vector2(.3, .3), vertexColors: true, roughness: .88,
    sheen: 1, sheenRoughness: .32, sheenColor: color.clone().lerp(new THREE.Color(1, 1, 1), .18) });
}


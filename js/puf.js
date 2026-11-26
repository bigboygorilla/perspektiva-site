/* Пуф 5 в 1: модель из Blender (5 отдельных табуреток), сборка/разборка и перетаскивание */
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {RoomEnvironment} from "three/addons/environments/RoomEnvironment.js";

const stage = document.getElementById("pufStage"), btn = document.getElementById("pufBtn"),
      bubble = document.getElementById("pufBubble"), tip = document.getElementById("pufTip"), count = document.getElementById("pufCount");
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
stage.prepend(renderer.domElement);
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
cam.position.set(1.3, 1.1, 1.68);
const controls = new OrbitControls(cam, renderer.domElement);
controls.target.set(0, 0.2, 0); controls.enableDamping = true; controls.enablePan = false;
controls.minDistance = 1.1; controls.maxDistance = 4.5; controls.maxPolarAngle = Math.PI * 0.46;
controls.autoRotate = true; controls.autoRotateSpeed = 0.7;
controls.addEventListener("start", () => { controls.autoRotate = false; });
const sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(1.4, 3, 1.1); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, {left:-1.6, right:1.6, top:1.6, bottom:-1.6}); sun.shadow.bias = -0.0004;
scene.add(sun);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({opacity:0.22}));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

function resize(){ const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h;
  cam.fov = w / h < 1 ? 40 : 30; cam.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(stage); resize();

const Y = new THREE.Vector3(0, 1, 0), qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const OUT = 0.3, LID0 = 0.0335; // в собранном кубе крышка стоит на стенках, как выставлено в Blender
// куда «улетает» каждая стенка (как на фото: вертушкой вокруг центральной табуретки)
const SPOTS = [[-0.3, 0.47], [0.47, 0.3], [0.3, -0.47], [-0.47, -0.3]];
let lid, walls = [], frameMats = [], state = "together", anim = null;

function wallPose(i){
  const qy = new THREE.Quaternion().setFromAxisAngle(Y, i * Math.PI / 2);
  return { p: new THREE.Vector3(0, 0.22, -0.193).applyQuaternion(qy), q: qy.clone().multiply(qX),
           n: new THREE.Vector3(0, 0, 1).applyQuaternion(qy) };
}
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
function velvetMat(color){
  const t = velvetMaps();
  // цвет из Blender уже линейный; карта «мятости» — светло-серая вокруг 0.5, поэтому чуть усиливаем цвет
  return new THREE.MeshPhysicalMaterial({ color: color.clone().multiplyScalar(1.3), map: t.map, normalMap: t.normal,
    normalScale: new THREE.Vector2(.3, .3), vertexColors: true, roughness: .88,
    sheen: 1, sheenRoughness: .32, sheenColor: color.clone().lerp(new THREE.Color(1, 1, 1), .18) });
}

/* ткань: основной цвет — крышка и две стенки, второй цвет — две другие стенки */
const velvet = {}, wallFrames = []; let pendingPair = null, core = null;
function setPair(pair){
  const A = velvet.Velvet_Yellow, B = velvet.Velvet_Navy; if(!A || !B){ pendingPair = pair; return; }
  [[A, pair[0]], [B, pair[1]]].forEach(([m, hex]) => { const c = new THREE.Color(hex);
    m.color.copy(c).multiplyScalar(1.3); m.sheenColor.copy(c).lerp(new THREE.Color(1, 1, 1), .18); });
}
const pufFabrics = document.getElementById("pufFabrics");
pufFabrics?.addEventListener("click", e => { const b = e.target.closest("button"); if(!b) return;
  pufFabrics.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  const n = document.getElementById("pufFabricName"); if(n) n.textContent = b.title;
  setPair(b.dataset.pair.split(",")); });

new GLTFLoader().load("models/puf.glb", g => {
  g.scene.traverse(o => { if(!o.isMesh) return; o.castShadow = true; o.receiveShadow = true;
    const m = o.material;
    if(/Metal/.test(m.name)){ if(!frameMats.includes(m)) frameMats.push(m); wallFrames.push(o); } /* в собранном кубе все каркасы спрятаны внутри */
    if(/Velvet/.test(m.name)) o.material = velvet[m.name] ||= velvetMat(m.color); });
  lid = g.scene.getObjectByName("lid"); lid.position.y = LID0;
  walls = ["s1","s2","s3","s4"].map(n => g.scene.getObjectByName(n));
  walls.forEach((w, i) => { const a = wallPose(i); w.position.copy(a.p); w.quaternion.copy(a.q); w.userData.i = i; });
  // в собранном кубе каркасы стенок спрятаны внутри — не рисуем их, чтобы ножки не проступали сквозь швы
  wallFrames.forEach(f => f.visible = false);
  const cg = new THREE.BoxGeometry(.4, .42, .4); cg.setAttribute("color", new THREE.Float32BufferAttribute(new Array(cg.attributes.position.count * 3).fill(.6), 3));
  core = new THREE.Mesh(cg, velvet.Velvet_Navy); core.position.y = .21; scene.add(core);
  if(pendingPair) setPair(pendingPair);
  scene.add(g.scene);
  document.getElementById("pufLoad").remove();
});

const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
function track(obj, keys, delay = 0){ return {obj, keys, delay}; }
function key(t, p, q){ return {t, p: p.clone(), q: q.clone()}; }
function play(tracks, done){
  const t0 = performance.now();
  anim = {tracks, t0, done, end: Math.max(...tracks.map(k => k.delay + k.keys.at(-1).t))};
}
function step(now){
  if(!anim) return;
  const T = (now - anim.t0) / 1000;
  for(const {obj, keys, delay} of anim.tracks){
    const t = Math.max(0, T - delay);
    let k = keys.findIndex(k => k.t >= t); if(k <= 0) k = k === 0 ? 1 : keys.length - 1;
    const a = keys[k-1], b = keys[k], u = ease(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t || 1))));
    obj.position.lerpVectors(a.p, b.p, u); obj.quaternion.slerpQuaternions(a.q, b.q, u);
  }
  if(T >= anim.end){ const d = anim.done; anim = null; d && d(); }
}
const up = y => new THREE.Vector3(0, y, 0), I = new THREE.Quaternion();

function apart(){
  if(anim || !lid) return; state = "moving"; ui(); wallFrames.forEach(f => f.visible = true); if(core) core.visible = false;
  const tr = walls.map((w, i) => { const a = wallPose(i), s = SPOTS[i], b = new THREE.Vector3(s[0], 0, s[1]);
    return track(w, [key(0, a.p, a.q), key(.45, a.p.clone().addScaledVector(a.n, OUT).add(up(.04)), a.q),
                     key(1.05, b.clone().add(up(.16)), I), key(1.35, b, I)], i * .12); });
  tr.push(track(lid, [key(0, up(LID0), I), key(.3, up(.12), I), key(1.2, up(.12), I), key(1.6, up(0), I)]));
  play(tr, () => { state = "apart"; azApart = controls.getAzimuthalAngle(); controls.autoRotate = false; ui();
    bubble.textContent = "Покрутите пуф — табуретки встанут в ряд"; bubble.classList.add("show"); setTimeout(() => bubble.classList.remove("show"), 3200); });
}
function together(){
  if(anim || !lid) return; state = "moving"; ui();
  const tr = walls.map((w, i) => { const a = wallPose(i), p = w.position.clone(), q = w.quaternion.clone();
    return track(w, [key(0, p, q), key(.3, p.clone().add(up(.16)), q),
                     key(.9, a.p.clone().addScaledVector(a.n, OUT).add(up(.04)), a.q), key(1.3, a.p, a.q)], i * .1); });
  const lp = lid.position.clone();
  tr.push(track(lid, [key(0, lp, lid.quaternion), key(.3, new THREE.Vector3(0, .12, 0), I), key(1.2, up(.12), I), key(1.75, up(LID0), I)]));
  play(tr, () => { state = "together"; wallFrames.forEach(f => f.visible = false); if(core) core.visible = true; ui(); });
  camGoal = 2.3;
}
function ui(){
  const done = state === "apart" || state === "row";
  btn.textContent = done ? "Собери обратно" : state === "moving" ? "Секунду…" : "Разбери меня";
  btn.disabled = state === "moving";
  btn.classList.toggle("pulse", state === "together");
  tip.textContent = state === "apart" ? "поверните пуф" : "крутите мышкой";
  count.hidden = !done;
}
btn.addEventListener("click", () => state === "together" ? apart() : together());
renderer.domElement.addEventListener("dblclick", () => state === "together" ? apart() : (state === "apart" || state === "row") && together());

// подсказка «кликни дважды» время от времени
setInterval(() => { if(state !== "together") return; bubble.textContent = "или кликните по пуфу дважды";
  bubble.classList.add("show"); setTimeout(() => bubble.classList.remove("show"), 2600); }, 7000);

// после разборки: стоит чуть повернуть пуф — табуретки сами встают в ряд
let azApart = 0;
const ROW = [[-1.04, 3], [-0.52, 0], [0, -1], [0.52, 1], [1.04, 2]]; // x и какая табуретка (−1 = центральная)
function toRow(){
  if(anim) return; state = "moving"; ui();
  const tr = ROW.map(([x, i], n) => { const o = i < 0 ? lid : walls[i], p = o.position.clone(), q = o.quaternion.clone(), b = new THREE.Vector3(x, 0, 0);
    return track(o, [key(0, p, q), key(.25, p.clone().add(up(.12)), q), key(.85, b.clone().add(up(.12)), I), key(1.1, b, I)], n * .09); });
  play(tr, () => { state = "row"; ui(); });
  camGoal = 3.5;
}
let camGoal = null;
controls.addEventListener("change", () => {
  if(state === "apart" && Math.abs(controls.getAzimuthalAngle() - azApart) > 0.35) toRow();
});

// цвет каркаса: тёмный / светлый (как в описании на сайте фабрики)
document.getElementById("frameSeg").addEventListener("click", e => { const b = e.target.closest("button"); if(!b) return;
  document.querySelectorAll("#frameSeg button").forEach(x => x.setAttribute("aria-pressed", x === b));
  frameMats.forEach(m => { m.color.set(b.dataset.c === "light" ? 0xC9CDD2 : 0x3A3E44); m.color.convertSRGBToLinear?.(); }); });

// рисуем только когда секцию видно
let visible = false;
new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
renderer.setAnimationLoop(now => { if(!visible) return; step(now);
  if(camGoal){ const d = cam.position.distanceTo(controls.target), nd = d + (camGoal - d) * .06;
    cam.position.sub(controls.target).setLength(nd).add(controls.target); if(Math.abs(nd - camGoal) < .01) camGoal = null; }
  controls.update(); renderer.render(scene, cam); });

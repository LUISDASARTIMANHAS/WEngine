import { Engine, InputSystem } from "../engine/index.js";
import { Raycaster3D, ParticleSystem3D, OrbitControls3D } from "../engine/3d/index.js";
import { register3DBuilders } from "./register3DBuilders.js";
import { TestScene3D } from "./scenes/TestScene3D.js";

// Inicializa a escuta de entradas no teclado
InputSystem.init();

// Obtém o elemento canvas WebGL
const canvas = document.getElementById("gameCanvas3D");

function resizeCanvas() {
  canvas.width = canvas.clientWidth || window.innerWidth;
  canvas.height = canvas.clientHeight || window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Instancia a WEngine em Modo 3D WebGL Nativo!
const engine = new Engine(canvas, {
  mode: "3d",
  fov: 60,
});

register3DBuilders(engine);

const scene = new TestScene3D();
engine.setScene(scene);

// Inicializa Controles de Câmera Orbitais com Mouse
const orbitControls = new OrbitControls3D(engine.camera3D, canvas);

// Raycaster 3D para Interação por Clique de Mouse
const raycaster = new Raycaster3D();

canvas.addEventListener("click", (e) => {
  if (!engine.currentScene || !engine.camera3D) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  raycaster.setFromCamera(mouseX, mouseY, canvas.width, canvas.height, engine.camera3D);
  const hits = raycaster.intersectScene(engine.currentScene);

  if (hits.length > 0) {
    const hit = hits[0];
    // Encontra sistema de partículas para gerar explosão no ponto clicado
    for (const ent of engine.currentScene.entities) {
      const ps = ent.getComponent(ParticleSystem3D);
      if (ps) {
        ps.burst(hit.point, 25);
        break;
      }
    }
  }
});

// Telemetria e Dashboard no HUD
const fpsVal = document.getElementById("fps-val");
const entityVal = document.getElementById("entity-val");
const modeVal = document.getElementById("mode-val");
const frameMsVal = document.getElementById("frame-ms-val");
const renderMsVal = document.getElementById("render-ms-val");
const updateMsVal = document.getElementById("update-ms-val");

// Debug de Input
let inputDebugCounter = 0;
engine.onDebug = (eng) => {
  if (fpsVal) fpsVal.textContent = eng.time.fps;
  if (entityVal) entityVal.textContent = eng.currentScene ? eng.currentScene.entities.length : 0;
  if (modeVal) modeVal.textContent = eng.mode.toUpperCase() + " (WebGL)";
  if (frameMsVal) frameMsVal.textContent = eng.lastPerformanceMetrics ? eng.lastPerformanceMetrics.totalFrameMs : 0.0;
  if (renderMsVal) renderMsVal.textContent = eng.lastPerformanceMetrics ? eng.lastPerformanceMetrics.renderMs : 0.0;
  if (updateMsVal) updateMsVal.textContent = eng.lastPerformanceMetrics ? eng.lastPerformanceMetrics.updateMs : 0.0;

  // Debug de input a cada 60 frames
  inputDebugCounter++;
  if (inputDebugCounter >= 60) {
    inputDebugCounter = 0;
    const pressedKeys = InputSystem.getPressedKeys();
    if (pressedKeys.length > 0) {
      console.log("[Input Debug] Teclas pressionadas:", pressedKeys.join(", "));
    }
  }
};

engine.start();

// ==================== INPUT DEBUG VISUAL ====================
// Cria painel visual de debug para mostrar teclas pressionadas
const inputDebugPanel = document.createElement("div");
inputDebugPanel.id = "input-debug-panel";
inputDebugPanel.style.cssText = `
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  color: #00ff00;
  z-index: 9999;
  border-radius: 4px;
`;

setInterval(() => {
  const keys = InputSystem.getPressedKeys();
  if (keys.length > 0) {
    inputDebugPanel.style.display = "block";
    inputDebugPanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">🎮 Input Debug</div>
      <div>Teclas: ${keys.join(", ")}</div>
    `;
  } else {
    inputDebugPanel.style.display = "none";
  }
}, 100);

document.body.appendChild(inputDebugPanel);
// ============================================================

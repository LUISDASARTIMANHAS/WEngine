import { Engine, InputSystem } from "../engine/index.js";
import { Raycaster3D, ParticleSystem3D } from "../engine/3d/index.js";
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

engine.onDebug = (eng) => {
  if (fpsVal) fpsVal.textContent = eng.time.fps;
  if (entityVal) entityVal.textContent = eng.currentScene ? eng.currentScene.entities.length : 0;
  if (modeVal) modeVal.textContent = eng.mode.toUpperCase() + " (WebGL)";
};

engine.start();

import { Engine } from "../engine/core/Engine.js";
import { InputSystem } from "../engine/systems/InputSystem.js";
import { register3DBuilders } from "./register3DBuilders.js";
import { TestScene3D } from "./scenes/TestScene3D.js";

// Inicializa a escuta de entradas no teclado
InputSystem.init();

// Obtém o elemento canvas WebGL
const canvas = document.getElementById("gameCanvas3D");

// Ajusta o tamanho do canvas para o contêiner
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

// Registra builders 3D na fábrica de entidades
register3DBuilders(engine);

// Cria e ativa a cena 3D
const scene = new TestScene3D();
engine.setScene(scene);

// Telemetria e Dashboard no HUD
const fpsVal = document.getElementById("fps-val");
const entityVal = document.getElementById("entity-val");
const modeVal = document.getElementById("mode-val");

engine.onDebug = (eng) => {
  if (fpsVal) fpsVal.textContent = eng.time.fps;
  if (entityVal) entityVal.textContent = eng.currentScene ? eng.currentScene.entities.length : 0;
  if (modeVal) modeVal.textContent = eng.mode.toUpperCase() + " (WebGL)";
};

// Inicia o motor
engine.start();

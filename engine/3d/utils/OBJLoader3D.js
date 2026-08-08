import { Mesh3D } from "../components/Mesh3D.js";

/**
 * Utilitário para ler e converter strings no formato Wavefront .obj em Mesh3D.
 */
export class OBJLoader3D {
  /**
   * Converte texto no formato Wavefront .obj para uma instância de Mesh3D.
   * @param {string} objText Conteúdo em texto do arquivo .obj
   * @param {number[]} [color=[0.7, 0.7, 0.8, 1.0]] Cor base RGBA
   * @returns {Mesh3D}
   */
  static parse(objText, color = [0.7, 0.7, 0.8, 1.0]) {
    const rawPositions = [];
    const rawNormals = [];
    const rawUVs = [];

    const outPositions = [];
    const outNormals = [];
    const outUVs = [];

    const lines = objText.split("\n");

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;

      const parts = line.split(/\s+/);
      const type = parts[0];

      if (type === "v") {
        rawPositions.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
      } else if (type === "vn") {
        rawNormals.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
      } else if (type === "vt") {
        rawUVs.push([parseFloat(parts[1]), parseFloat(parts[2])]);
      } else if (type === "f") {
        // Suporta triangulação f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
        const faceVertices = parts.slice(1);
        
        // Triangulação leiga se a face tiver > 3 vértices
        for (let i = 1; i < faceVertices.length - 1; i++) {
          const tri = [faceVertices[0], faceVertices[i], faceVertices[i + 1]];
          
          for (const vertStr of tri) {
            const indices = vertStr.split("/");
            const vIdx = parseInt(indices[0], 10) - 1;
            const vtIdx = indices[1] ? parseInt(indices[1], 10) - 1 : -1;
            const vnIdx = indices[2] ? parseInt(indices[2], 10) - 1 : -1;

            if (rawPositions[vIdx]) {
              outPositions.push(...rawPositions[vIdx]);
            }
            if (vnIdx >= 0 && rawNormals[vnIdx]) {
              outNormals.push(...rawNormals[vnIdx]);
            } else {
              outNormals.push(0, 1, 0);
            }
            if (vtIdx >= 0 && rawUVs[vtIdx]) {
              outUVs.push(...rawUVs[vtIdx]);
            } else {
              outUVs.push(0, 0);
            }
          }
        }
      }
    }

    return new Mesh3D({
      vertices: new Float32Array(outPositions),
      normals: new Float32Array(outNormals),
      uvs: new Float32Array(outUVs),
      color,
    });
  }
}

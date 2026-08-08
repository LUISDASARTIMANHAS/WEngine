# ErrorDisplaySystem - Sistema de Exibição de Erros

## Visão Geral

O `ErrorDisplaySystem` é um sistema nativo da WEngine que captura e exibe erros em tempo real em um painel visual na página do navegador. Todos os erros não tratados e promessas rejeitadas são automaticamente exibidas.

## Características

✅ **Captura Automática**: Erros globais não tratados são automaticamente capturados  
✅ **Painel Visual**: Overlay estilizado com lista de erros em tempo real  
✅ **Stack Traces**: Exibe stack traces dos erros para facilitar debugging  
✅ **Timestamps**: Mostra o horário exato de cada erro  
✅ **Limite de Erros**: Mantém um máximo de 10 erros exibidos (configurável)  
✅ **Botão Clear**: Permite limpar o painel manualmente  

## Como Usar

### 1. Captura Automática (Padrão)

O sistema é inicializado automaticamente quando você cria uma instância da `Engine`:

```javascript
const canvas = document.getElementById('gameCanvas');
const engine = new Engine(canvas, { mode: '3d' });

// O ErrorDisplaySystem já está ativo e capturando erros globais
```

### 2. Adicionar Erros Manualmente

Você pode adicionar erros manualmente usando o método `displayError()` da engine:

```javascript
// Formato básico
engine.displayError("Algo deu errado!");

// Com origem especificada
engine.displayError(
  "Erro ao carregar textura",
  "TextureLoader.js:42"
);

// Com stack trace completo
try {
  riskyOperation();
} catch (error) {
  engine.displayError(
    error.message,
    "MyScript.js:50",
    error.stack
  );
}
```

### 3. Acessar o Sistema Diretamente

Para casos mais avançados, acesse o sistema diretamente:

```javascript
const errorSystem = engine.getErrorDisplaySystem();

// Adicionar erro
errorSystem.addError("Erro crítico!", "Module:Line");

// Obter número de erros
const errorCount = errorSystem.getErrorCount();
console.log(`Total de erros: ${errorCount}`);

// Obter todos os erros
const allErrors = errorSystem.getAllErrors();
console.log(allErrors);

// Limpar erros
errorSystem.clearErrors();

// Destruir o painel (limpeza)
errorSystem.destroy();
```

## Estilo do Painel

O painel aparece no canto inferior direito com:
- **Borda vermelha** (#ff4444) indicando erros
- **Fundo escuro** para não interferir com o jogo
- **Scroll automático** para o erro mais recente
- **Botão Clear** para limpar todos os erros

## Exemplos Práticos

### Exemplo 1: Tratamento de Erro em Cena

```javascript
import { Scene } from "../engine/core/Scene.js";

export class MyScene extends Scene {
  start() {
    try {
      this.loadAssets();
    } catch (error) {
      // Exibir erro na tela
      this.engine.displayError(
        `Falha ao carregar assets: ${error.message}`,
        "MyScene.js:10"
      );
    }
  }

  loadAssets() {
    // sua lógica...
  }
}
```

### Exemplo 2: Validação com Feedback Visual

```javascript
// Em um script ou componente
function createEntity(type, data) {
  if (!type) {
    engine.displayError(
      "Tipo de entidade não especificado",
      "EntityCreator.js:5"
    );
    return null;
  }

  if (!data.position) {
    engine.displayError(
      "Posição não definida para entidade",
      "EntityCreator.js:10"
    );
    return null;
  }

  return entity;
}
```

### Exemplo 3: Monitoramento de Performance

```javascript
// Capturar erros de promessas (exemplo com fetch)
fetch('/assets/model.json')
  .then(response => response.json())
  .then(data => {
    // processar dados
  })
  .catch(error => {
    engine.displayError(
      `Falha ao carregar modelo: ${error.message}`,
      "AssetLoader.js:22",
      error.stack
    );
  });
```

## Configuração Avançada

### Alterar Limite de Erros

```javascript
const errorSystem = engine.getErrorDisplaySystem();
errorSystem.maxErrors = 20;  // Armazenar até 20 erros
```

## Boas Práticas

1. **Use mensagens descritivas**: Facilita o debugging
   ```javascript
   // ❌ Ruim
   engine.displayError("Erro!");
   
   // ✅ Bom
   engine.displayError(
     "Falha ao inicializar mesh: vértices não definidos",
     "Mesh3D.js:45"
   );
   ```

2. **Sempre inclua a origem**: Facilita localizar o problema
   ```javascript
   engine.displayError(
     "Valor inválido",
     "Transform.js:120"  // Especifique arquivo:linha
   );
   ```

3. **Use try-catch para operações críticas**:
   ```javascript
   try {
     this.renderScene();
   } catch (error) {
     engine.displayError(
       error.message,
       "RenderSystem.js:200",
       error.stack
     );
   }
   ```

4. **Valide dados na entrada**:
   ```javascript
   function setValue(value) {
     if (typeof value !== 'number') {
       engine.displayError(
         `Esperado número, recebido ${typeof value}`,
         "Component.js:50"
       );
       return;
     }
     this.value = value;
   }
   ```

## Captura Automática de Erros

O sistema captura automaticamente:

### Erros Globais
```javascript
// Automaticamente capturado e exibido
throw new Error("Algo deu errado!");
```

### Promessas Rejeitadas
```javascript
// Automaticamente capturado e exibido
Promise.reject("Erro em promessa");

// Ou
fetch('/invalid-url')
  .then(r => r.json())
  // Se falhar, é capturado automaticamente
```

## Limpeza

Para remover o painel completamente:

```javascript
engine.getErrorDisplaySystem().destroy();
```

---

**Nota**: O ErrorDisplaySystem está sempre ativo e não afeta o desempenho significativamente. Use-o livremente para debugging durante o desenvolvimento.

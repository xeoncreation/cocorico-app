# ASSETS PIPELINE (Sprites & Animaciones)

## Objetivo
Generar spritesheets y preparar animaciones ligeras (Lottie / WebGL) partiendo de imágenes que tú subes sin depender de motores de juego pesados (Unreal, etc.).

## Estructura

```
public/
  sprites/
    raw/              # Coloca aquí tus imágenes fuente (png/jpg/webp)
    sheet.png          # Salida generada
    sheet.json         # Metadatos (x,y,w,h por frame)
```

## Flujo para Sprites
1. Añade tus imágenes a `public/sprites/raw` (ideal cuadradas o con aspecto similar). 
2. Ejecuta:
   ```bash
   npm run generate:sprites
   ```
3. Usa el resultado en React:
   ```tsx
   import sheetMeta from '@/../public/sprites/sheet.json';

   // Ejemplo de un frame específico
   const frame = sheetMeta.frames[0];
   <div
     style={{
       width: frame.w,
       height: frame.h,
       backgroundImage: 'url(/sprites/sheet.png)',
       backgroundPosition: `-${frame.x}px -${frame.y}px`,
       backgroundRepeat: 'no-repeat'
     }}
   />
   ```

## Animación por pasos (CSS)
Para múltiples frames animados horizontalmente:
```css
.sprite-run {
  width: 256px;
  height: 256px;
  background: url('/sprites/sheet.png') no-repeat 0 0;
  animation: runSteps 1s steps(FRAME_COUNT) infinite;
}
@keyframes runSteps {
  to { background-position: -CALC_WIDTHpx 0; }
}
```
Sustituye `FRAME_COUNT` por el número de frames y `CALC_WIDTH` por `FRAME_COUNT * 256`.

## Lottie (Opcional)
Instalada dependencia `lottie-web`. Para usar con un JSON exportado de After Effects:
```tsx
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export function LottieHero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie/hero.json'
    });
    return () => anim.destroy();
  }, []);
  return <div ref={ref} style={{ width: 300, height: 300 }} />;
}
```

## WebGL / Three.js (Opcional)
Se añadió `three` para efectos 3D ligeros (por ejemplo un fondo animado). Ejemplo básico:
```tsx
// components/ThreeBackground.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff8833, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2,2,2);
    scene.add(light);
    function animate() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} />;
}
```

## Buenas Prácticas
| Aspecto | Recomendación |
|---------|---------------|
| Tamaño fuente | <= 512x512 antes de resize |
| Formato | PNG para transparencia, WebP para peso |
| Cantidad | Mantener spritesheet < 4096px de ancho para compatibilidad |
| Cache | Usar `Cache-Control` en producción |

## Extensiones Relacionadas (Opcional)
```vscode-extensions
gruntfuggly.svgviewer,aaron-bond.better-comments,usernamehw.errorlens
```

## Desinstalar Extensiones Irrelevantes
Ejecuta (manual):
```bash
code --uninstall-extension captncaps.ue4-snippets \
  dotjoshjohnson.xml firefox-devtools.vscode-firefox-debug \
  ms-edgedevtools.vscode-edge-devtools ph1p.zeit-co-vscode-schemas \
  donjayamanne.githistory ms-mssql.mssql ms-mssql.data-workspace-vscode \
  ms-mssql.sql-bindings-vscode ms-mssql.sql-database-projects-vscode \
  mtxr.sqltools ms-azuretools.vscode-containers ms-kubernetes-tools.vscode-kubernetes-tools \
  ms-python.python ms-python.debugpy ms-python.vscode-pylance ms-python.vscode-python-envs
```

## Próximo Paso
Sube algunas imágenes a `public/sprites/raw/` y genera tu primer sheet.

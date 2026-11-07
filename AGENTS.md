# AGENTS.md — Leo Jugando

Instrucciones para agentes de código (Codex u otros) que trabajen en este repositorio.

## Qué es
App web instalable (PWA) para que una niña de 4 años practique la lectura en español por el **método fonético/silábico**: conoce las vocales y las consonantes por su sonido y aprende a juntarlos (mmm + a → ma → mamá).
Público: niños de 3-6 años que **todavía no leen instrucciones**. Los padres usan un panel aparte.

## Principios (no romper)
1. **Todo se puede oír.** Cada letra, sílaba, palabra y dibujo suena al tocarlo. Las instrucciones para la niña se dan con voz, nunca solo con texto.
2. **Sonidos, no nombres de letras.** La M suena "mmm", nunca "eme" (salvo en la frase "Esta es la eme").
3. **Botones grandes (mín. 54 px), pocos elementos por pantalla, sin menús escondidos para la niña.**
4. **Nunca castigar.** Un fallo da un aviso suave y ayuda (leer sílaba a sílaba), nunca quita estrellas.
5. **Funciona sin internet** una vez instalada y sin cuentas ni datos personales. Todo se guarda en el propio móvil.
6. **Móvil primero** (vertical, ~360-430 px de ancho). Probar siempre en ese tamaño.

## Estructura
- `index.html` — toda la app (HTML + CSS + JS en un único archivo, sin dependencias ni paso de compilación).
- `sw.js` — service worker (caché para uso sin conexión). **Sube el número de `CACHE` en cada cambio** o los móviles seguirán viendo la versión vieja.
- `manifest.webmanifest`, `icon-*.png` — instalación como app.

## Arquitectura de index.html
- **Datos:** `ORDER` (orden de enseñanza de consonantes), `WORDS` (palabras separadas en sílabas + emoji), `LPIC` (palabra ejemplo por letra), `STICKERS`.
- **Audio, por orden de prioridad:**
  1. Grabación de los padres (IndexedDB, claves `snd:m`, `syl:ma`).
  2. Voz del sistema (Web Speech API, voz `es-*`) para sílabas, palabras y frases.
  3. Sintetizador propio de fonemas con Web Audio (`PH`, `voiced`, `noise`, `plosive`) para el sonido de cada letra.
  Funciones de alto nivel: `playSound(letra)`, `playSyl(silaba)`, `playWord(palabra)`, `sayIt(frase)`. Las secuencias van dentro de `run(async alive => …)`, que corta la anterior.
- **Progreso adaptativo:** `state.st[clave] = {ok, ko}`; `pickW` elige con más peso lo que falla; `similar()` elige distractores parecidos para obligar a leer de verdad.
- **Camino:** `session = {focus, count}`; al llegar a `GOAL` aciertos se completa la letra (`finishLetter`) y se añade a `state.letters`.
- **Estado:** `localStorage` clave `leoJugando2`. Si cambias su forma, mantén la compatibilidad con datos guardados.

## Pantallas
`home` (camino + menú), `lesson`, `sonidos`, `silabas`, `juntar`, `adivina` (¿Qué es?), `escucha` (sílaba o palabra), `album`. Panel de mayores: mantener pulsado ⚙️ 1 segundo.

## Cómo probar
- Servir la carpeta: `python3 -m http.server 8000` y abrir `http://localhost:8000` en modo móvil de las herramientas de desarrollo.
- Comprobar: sin errores en consola; que suene en Chrome Android; que siga funcionando en modo avión una vez instalada.
- Al añadir palabras: solo sílabas directas (consonante + vocal) salvo que se añada un nivel nuevo, y un emoji que se entienda sin dudas.

## Ideas pendientes (por prioridad)
1. Audios grabados de calidad para los 21 sonidos (sustituir el sintetizador por defecto).
2. Más palabras y frases cortas ("mi mamá me mima") cuando domine palabras.
3. Sílabas inversas y trabadas (al, pla, tra) como niveles nuevos del camino.
4. Juego de escribir: arrastrar sílabas para formar la palabra del dibujo.
5. Varios perfiles (hermanos).
6. Empaquetar como APK para Google Play (PWABuilder / Trusted Web Activity).

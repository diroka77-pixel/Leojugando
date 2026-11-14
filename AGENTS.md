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

## Idiomas
La app está en **castellano** y **catalán** (selector en Ajustes del panel de mayores).
- Datos por idioma en `LANGS` (`es`, `ca`): orden de letras, sílabas, nombres de letras, dibujos y palabras. Textos y frases habladas en `T`.
- El progreso (`letters`, `st`, `mast`, `voiceURI`) va por separado en `state.lp[idioma]`; las estrellas y las pegatinas son comunes.
- Catalán: `ny` y `ll` son una sola letra (`tok()`); `j` suena /ʒ/, `x` /ʃ/ y `z` /z/ (`PHX.ca`). Las grabaciones de los padres llevan el prefijo `ca:`.
- Para añadir un idioma: una entrada en `LANGS` y otra en `T`, sus sonidos en `PHX` si cambian, y la opción en `#langSel`.

## Vocabulario
- Unas 250 palabras en castellano y 240 en catalán. `*_WORDS` = nivel 1 (solo sílabas directas: consonante del camino + vocal). `*_ADV_WORDS` = nivel 2 (sílabas trabadas o cerradas, diptongos, h, ll, ch, qu, ç…).
- En el nivel 2 solo se exige que la niña conozca las letras que están en el camino (`ORDER`); h, y, k, q, w, ç no bloquean palabras.
- Cada palabra necesita su dibujo en `assets/pics/openmoji/<código>.svg` (OpenMoji, CC BY-SA). No repitas el mismo dibujo en dos palabras del mismo idioma.
- ¿Cómo empieza? descarta las palabras que empiezan por h, qu, ce/ci, ge/gi, ll o ch, porque su primera letra no suena como se enseña.

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
`home` (camino + menú), `lesson`, `sonidos`, `silabas`, `juntar`, `adivina` (¿Qué es?), `escucha` (sílaba o palabra), `inicio` (¿Cómo empieza?: sonido inicial), `formar` (ordenar sílabas), `globos` (explotar la sílaba que se oye), `parejas` (memoria palabra-dibujo), `unir` (Relacionar: unir 3-4 palabras con sus dibujos tocando o arrastrando; 4 y parecidas cuando ya va bien), `album`.
En el Camino, `nextRound()` va alternando todos los juegos. Panel de mayores: mantener pulsado ⚙️ 1 segundo.

## Pegatinas y logros
- `STK`: cada pegatina tiene emoji, nombre (es/ca), onomatopeya (es/ca), efecto sonoro (`FX`) y animación (clase `a-*`). Se gana una cada 5 estrellas.
- Al tocarla se abre el visor (`openViewer`): se agranda, se anima, suena el efecto y la voz dice la onomatopeya ("El perro hace guau, guau").
- `ACH`: logros con su condición; `checkAch()` se llama tras cada acierto. Contadores en `state.cnt`.
- Los premios van en cola (`queuePrize`), así nunca se pisan.

## Casa Tamagotchi
- `ROOMS`: salón (mimos), cocina (comida), baño (limpieza), dormitorio (sueño) y jardín (juego). Cada una tiene sus muebles fijos (`props`), su pared y su suelo, y sus objetos colocados (`state.room.rooms[id]`).
- `state.pet`: necesidades de Leo (0-100). Bajan con el tiempo (`petDecay`) pero nunca de 15: Leo nunca lo pasa mal ni se muere.
- Cuidar = leer: Leo pide algo escrito en su bocadillo (`CARE`) y hay que tocar el dibujo correcto. El 🔊 lo lee en voz alta como ayuda. Cada 8 cuidados, cofre de madera. Alimentar también da de comer a Leo.
- Leo vive solo (bucle cada 3,5 s): pasea, bosteza, le suena la tripa y pita como un Tamagotchi cuando algo está bajo.
- Comida: se arrastra el dibujo hasta Leo (o se toca). Las golosinas (`SWEET`) dan más diversión y más peso. Si está lleno, lo dice y no pide nada. Cada 3 comidas hace caca 💩 (también con el tiempo); se limpia tocándola.
- Baño: tras leer, se frota a Leo con el dedo (`scrubGame`) y se aclara con agua.
- Dormitorio: tras leer, Leo bosteza y hay que apagar la luz con el interruptor. Duerme de verdad: `state.pet.asleep` y la energía sube con el tiempo real; de noche (20-7 h) tiene más sueño.
- Jardín: minijuegos tras leer: que el juguete no caiga (`ballGame`) o explotar pompas (`bubbleGame`).
- Resfriado suave si está muy sucio: se cura leyendo la palabra (medicina, miel, bufanda, termómetro).
- Crece con los días (bebé, pequeño, mayor) y tiene peso; ficha con 📋.
- Leo se mueve con el dedo: arrastrarle (si se suelta en un borde, pasa a la habitación de al lado) o tocar el suelo para que vaya andando (`walkTo`).
- Deseos (`state.pet.wish`, `WISHES`): Leo pide por escrito ver la tele, un cuento, bailar, un abrazo o lo que más necesite. Se cumplen tocando la tele, el libro (lee una frase de `STORY` en voz alta), la radio o a Leo, o cuidándole en su habitación. Dan estrella y cariño.
- Las actividades (frotar, minijuegos, tele, cuento, baile) van con `activity()` y se cancelan con `endActivities()` al cambiar de habitación: nada puede quedarse colgado.
- Ojo: los botones con `transform` necesitan su propia regla `:active`, porque la regla general `button:active{transform:translateY(3px)}` los mueve y el toque se pierde.
- En el salón, el bocadillo dice por escrito lo que más necesita ("TENGO HAMBRE") y al tocarlo lleva a esa habitación.

## Casa en 2,5D y objetos usables
- Cada habitación tiene pared del fondo, paredes laterales y suelo en perspectiva. Coordenadas de suelo `fx` (0-100, izquierda-derecha) y `fz` (0-100, delante-fondo): `proj()` las pasa a pantalla (posición, escala y orden) y `unproj()` al revés. Objetos de pared: `wx`,`wy` con `wallPos()`.
- Leo (`petX`,`petZ`, guardado en `state.pet.pos`) se mueve con la cruceta (◀ ▶ ▲ al fondo ▼ adelante), el botón de saltar, tocando el suelo o arrastrándole.
- `DECOR` (más de 100 objetos): emoji, nombres es/ca, tipo (f suelo, w pared, p mascota, h ponible), sonido, raro, acción y tamaño. Al tocar un objeto colocado, Leo va hasta él y hace su acción (`ACTS`: sentarse, siesta, regar, montar, tocar música, comer, tobogán, cohete…). Los ponibles (`WEARPOS`) se los pone Leo desde "Mis cosas".
- Las animaciones de Leo van sobre `.lb` (cuerpo), para que lo que lleva puesto se mueva con él.
- Cofres: también uno cada día (`daily`, trae 2 cosas) y uno de madera cada 10 estrellas.

## Mi casita y cofres
- `DECOR`: objetos para decorar (emoji OpenMoji, nombre es/ca, tipo f=suelo/w=pared/p=mascota, efecto sonoro, raro). `THEMES`: papeles de pared y suelos.
- Cofres (`state.box.pending`): madera cada 3 palabras en Alimentar, oro cada 10, plata al terminar 5 partidas guiadas y arcoíris con cada logro nuevo. `rollChest()` decide qué sale (los de oro y arcoíris dan objetos raros).
- `state.room.placed` guarda dónde está cada objeto (x, y en %). Se arrastran con el dedo; arrastrar hacia abajo fuera de la casita lo guarda. Tocar un objeto lo anima y suena.
- Alimentar: siempre salen todas las sílabas de la palabra más dos trampas que no son de la palabra, en una cuadrícula de 3 columnas que cabe en pantalla.

## Android
- `MainActivity.java` fija `textZoom` a 100 (la letra grande del sistema no descoloca la app) y aplica los márgenes de la cámara y las barras del sistema. No quitarlo.

## Cómo probar
- Servir la carpeta: `python3 -m http.server 8000` y abrir `http://localhost:8000` en modo móvil de las herramientas de desarrollo.
- Comprobar: sin errores en consola; que suene en Chrome Android; que siga funcionando en modo avión una vez instalada.
- Al añadir palabras: solo sílabas directas (consonante + vocal) salvo que se añada un nivel nuevo, y un emoji que se entienda sin dudas.

## Ideas pendientes (por prioridad)
1. Audios grabados de calidad para los 21 sonidos (sustituir el sintetizador por defecto).
2. Más palabras y frases cortas ("mi mamá me mima") cuando domine palabras.
3. Sílabas inversas y trabadas (al, pla, tra) como niveles nuevos del camino.
5. Varios perfiles (hermanos).
6. Empaquetar como APK para Google Play (PWABuilder / Trusted Web Activity).

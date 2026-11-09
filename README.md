# Leo Jugando 📖⭐

App para aprender a leer jugando, pensada para niños de 3 a 6 años que aprenden por los sonidos de las letras.

- 🔊 **Sonidos:** cada letra suena como se pronuncia ("mmm", "sss").
- 🔤 **Sílabas:** los sonidos se juntan: mmm… a… ¡ma!
- 🧩 **Juntar:** une los trozos de una palabra y descubre el dibujo.
- 🖼️ **¿Qué es?:** lee la palabra y toca su dibujo.
- 👂 **Escucha:** oye una sílaba o palabra y encuéntrala.
- 🔠 **¿Cómo empieza?:** oye la palabra y elige su primera letra.
- 🧱 **Formar:** ordena las sílabas para formar la palabra del dibujo.
- 🎈 **Globos:** explota los globos con la sílaba que oyes.
- 🃏 **Parejas:** juego de memoria de palabras y dibujos.
- 🛤️ **Camino de letras** con repaso inteligente de lo que más cuesta.
- ▶️ **Jugar ahora:** prepara automáticamente partidas cortas de 3, 5 o 7 juegos.
- 📖 **Leo**, una mascota interactiva que guía, anima y vive en un rincón decorable.
- 🚂 Nuevos juegos: tren de sílabas, formar palabras para alimentar a Leo, atrapar sílabas en orden y completar frases leyendo.
- ✏️ El trazado comprueba que el dedo permanezca dentro de la letra y que se haya recorrido una parte suficiente.
- 🔊 Paquete local de sonidos y sílabas disponible sin conexión, con opción de grabar en casa sonidos, sílabas e instrucciones.
- 🎨 Ilustraciones OpenMoji coherentes y una nueva imagen infantil de Leo.
- 📚 Vocabulario progresivo y cuentos cortos interactivos que obligan a leer cada palabra antes de responder.
- 📈 Dificultad automática por progreso, con selección manual de sílabas, palabras o frases para la familia.
- 🎁 Piezas, cofres, mundos visuales y cosméticos desbloqueables sin castigos ni rachas obligatorias.
- ⭐ Estrellas, 52 pegatinas que se animan y suenan (cada animal hace su sonido) y 22 logros.
- 🎙️ Los padres pueden grabar su propia voz para cada sonido.
- 🌍 En **castellano** y **catalán**, también los sonidos (se cambia en Ajustes).
- 👨‍👩‍👧 Perfiles infantiles, recomendaciones para la familia y copia/restauración del progreso.
- 📲 Se instala en el móvil y funciona sin internet.

## Publicarla con GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En "Source" elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
3. En un par de minutos estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.
4. Ábrela en Chrome desde el móvil y pulsa **📲 Instalar la app** (o menú ⋮ → *Añadir a pantalla de inicio*).

La web sigue publicándose desde la raíz. La carpeta `www/` se genera para Android y no contiene el service worker.

## Instalar en Android

Cada cambio enviado a `main` compila un APK automáticamente. También se puede iniciar la compilación desde **Actions → Compilar APK Android → Run workflow**.

Para descargarlo desde el móvil:

1. Abre este repositorio en GitHub.
2. Entra en **Releases** y abre la versión más reciente de **Leo Jugando**.
3. Despliega **Assets** y pulsa **LeoJugando.apk**.
4. Abre el archivo descargado. Si Android bloquea la instalación, pulsa **Ajustes** en el aviso y activa **Permitir desde esta fuente** para Chrome o para la aplicación desde la que abriste el APK.
5. Vuelve atrás y pulsa **Instalar**. Puedes desactivar de nuevo ese permiso después.

Si no aparece todavía en Releases, entra en **Actions**, abre la última ejecución verde de **Compilar APK Android** y descarga el artefacto **LeoJugando-APK**. GitHub lo entrega como ZIP; abre el ZIP y toca `LeoJugando.apk`.

### Firma estable para instalar actualizaciones

Sin secretos configurados, el workflow siempre crea un APK debug instalable. Para que las versiones de Release mantengan una firma propia y estable, crea una única clave y guarda cuatro secretos. No subas nunca el archivo `.jks` al repositorio.

Desde el móvil puedes hacerlo en un Codespace:

1. En el repositorio pulsa **Code → Codespaces → Create codespace on main**. Si no aparece, abre GitHub en Chrome y activa **Sitio para ordenador**.
2. Abre el terminal del Codespace y ejecuta:

   ```bash
   keytool -genkeypair -v -keystore leo-jugando-release.jks -alias leo-jugando -keyalg RSA -keysize 2048 -validity 10000
   base64 -w 0 leo-jugando-release.jks
   ```

3. Guarda el archivo `leo-jugando-release.jks`, su contraseña y la contraseña de la clave en un lugar privado. La cadena larga que muestra el segundo comando es el contenido del keystore codificado.
4. En GitHub abre **Settings → Secrets and variables → Actions → New repository secret**. Crea estos secretos:

   - `ANDROID_KEYSTORE_BASE64`: la cadena larga generada por `base64`.
   - `ANDROID_KEYSTORE_PASSWORD`: la contraseña del archivo `.jks`.
   - `ANDROID_KEY_ALIAS`: `leo-jugando`.
   - `ANDROID_KEY_PASSWORD`: la contraseña de la clave.

5. Borra el Codespace cuando hayas guardado una copia privada del `.jks`.
6. Ve a **Actions → Compilar APK Android → Run workflow**. La nueva compilación detectará los cuatro secretos y generará un APK Release firmado.

Conserva siempre ese mismo keystore. Android no permite instalar una actualización encima de otra versión si la firma cambia.

## Desarrollo Android

El proyecto usa Capacitor con `com.leojugando.app`, Java 17 y la voz nativa de Android. Para sincronizar la versión web con Android:

```bash
npm ci
npm run android:sync
```

`npm run prepare:www` copia la aplicación y las fuentes locales a `www/`, omitiendo `sw.js`. El micrófono utiliza la petición de permisos del WebView de Capacitor y `RECORD_AUDIO` está declarado en el manifiesto.

## Para mayores
Mantén pulsado ⚙️ un segundo para ver el progreso, elegir las letras que ya conoce, grabar tu voz y cambiar los ajustes.

Si no se oyen las palabras: Ajustes del teléfono → Idioma → Texto a voz → descarga la voz en español.

Las ilustraciones de vocabulario usan [OpenMoji](https://openmoji.org/) bajo licencia CC BY-SA 4.0. La licencia se incluye en `assets/pics/openmoji/LICENSE.txt`.

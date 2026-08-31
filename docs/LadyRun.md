# Lady Run — Documentación

Minijuego "corre y esquiva" dentro de Lady Hungry. Componente aislado (`src/screens/modalRunner/RunnerScreen.jsx`), no depende del `gameState` principal salvo para las piezas de economía explícitamente conectadas (ver más abajo).

> Mantener este documento actualizado cada vez que se cierre un cambio real. Si algo de aquí queda desfasado, corregirlo en el momento, no dejarlo acumular.

## Accesos

- **Dentro de Pata y Pico**: botón "Carrera" en el hub de Raids (`RaidScreen.jsx`), gateado tras `import.meta.env.DEV` — no aparece en producción todavía.
- **Standalone**: `?lady-run` como query param (`App.jsx` → `LadyRunStandalone.jsx`). Carga solo lo necesario del Runner, no arrastra los ~500 assets del juego principal. Mismo guardado (`localStorage`) que el juego completo, así que la moneda se comparte entre los 2 accesos.
- Panel de debug de `GameRoot.jsx` también tiene un botón "abrir runner" redundante (dev-only).

## Modos

Pantalla única de selección con 3 botones: **Modo Libre**, **Historia**, **Tienda**. (Historia estuvo bloqueada un tiempo mientras se pulía Modo Libre; ya está desbloqueada.)

- **Modo Libre**: carrera infinita 1v1 contra un rival CPU — al dejarlo sin sus 3 vidas no termina la partida, rota a otro perro rival al azar (`rivalsDefeated`, contador con icono `Skull`). Sin poderes, sin boss. Sus fondos (`libre-1` a `libre-4`) incluyen uno con temática desierto (`libre-1`) — eso es solo un fondo de Modo Libre, no tiene relación con los capítulos de Historia.
- **Historia**: CPU 1v1 + poderes de sabotaje + fase boss al vencerla. **En curso: se va a organizar por capítulos**, cada uno con su propio escenario encadenado. Capítulo 1 = Mina, Capítulo 2 = Ciudad. El sistema de biomas (`BIOMES`, `BIOME_ORDER`, `checkpointOpen`, `biomeSelectOpen` en `RunnerScreen.jsx`) ya existía construido pero desconectado de la UI — solo tenía **Mina y Ciudad** como biomas reales (`desierto` nunca pasó de ser un comentario reservado en el código, sin escenarios propios ni obstáculos exclusivos — no confundir con el fondo "desierto" de Modo Libre, que es una cosa aparte). Diseño de la pantalla de capítulos: al entrar en Historia, se muestra una lista de capítulos pegada a la derecha (mismo estilo que la lista Modo Libre/Historia/Tienda de la pantalla anterior). Sin implementar todavía.

## Roster de perros

9 perros seleccionables. Bloqueados (candado, `icon-rewards/lock.webp`, esquina superior derecha de la tarjeta): **Lady, Tuka, Smoke, Zeus, Tokio, Nupito**. Libres: **Gordo, Muna, Druh**.

Motivo del bloqueo: el resto de perros (los bloqueados) todavía usan el sistema viejo de 4 imágenes sueltas (`gordo-1.webp`, `gordo-2.webp`, `gordo-3.webp`, `gordo-4.webp`...) que el código va alternando rápido para simular que corre — se ve un poco a saltos. Gordo, Muna y Druh en cambio usan un ÚNICO archivo webp que YA trae la animación de correr grabada dentro de él (se exportó así desde Aseprite), así que se ve fluido de verdad sin que el código tenga que alternar nada. Por eso estos 3 se desbloquearon primero: ya tienen el asset bueno.

Ejemplo concreto con Gordo: `gordo-1.webp` es el único archivo que se usa para TODO el ciclo de correr (se anima solo). `gordo-2.webp` (uno de los 4 antiguos) se reutiliza aparte, fijo, SOLO para la pose de salto (`DOG_JUMP_FRAME`) — si no se hiciera así, al saltar se vería corriendo en el aire en vez de con una pose de salto.

Cuando el usuario anime el resto de perros (exportando su ciclo de correr como un único webp animado, igual que Gordo), se desbloquean siguiendo el mismo patrón.

## Dificultad — Fácil / Medio / Difícil

El selector se movió de la pantalla inicial a la siguiente (junto al botón Empezar). Default: **Fácil**.

### Duración de tramos (velocidad de scroll)

Tramo = franja de velocidad. `SPEED_TIERS = [280, 320, 380, 440]` px/s para tramos 1-4, luego rampa continua (+20px/s cada 10s, tope 700px/s).

| Tramo | Fácil | Medio / Difícil |
|---|---|---|
| 1 | 15s | 5s |
| 2 | 10s | 10s |
| 3 | 5s | 10s |
| Rampa desde | 30s | 25s |

### Patrón de obstáculos (independiente de la duración de arriba)

- **Tramo 1-2**: ciclo de 2 — terrestre, aéreo, repite. Nunca hay pareja.
- **Tramo 3-8**: ciclo de 3 — [terrestre, aéreo, terrestre]. El aéreo nunca es pareja. Los terrestres SÍ pueden ser pareja (2 obstáculos pegados), según dificultad:
  - Fácil: nunca (0%)
  - Medio: 35% (`MEDIUM_PAIR_CHANCE`)
  - Difícil: siempre que le toque
- **Tramo 9+**: mismo ciclo de 3, pero el 2º terrestre (antes siempre solo) también puede ser pareja, misma regla de arriba.
- **Solo Fácil, tramo 10+ (`FACIL_HARD_SWITCH_TIER`)**: límite natural anti-farmeo — deja de ser "nunca pareja" y pasa a comportarse exactamente como Difícil. No termina la partida a la fuerza, pero la hace lo bastante dura como para que en la práctica casi nadie la alargue indefinidamente.

El ritmo de SPAWN (~1.1-1.9s entre obstáculos) es por TIEMPO, no depende del tramo ni de la dificultad — por eso alargar un tramo ya produce más obstáculos de forma natural, sin tocar el patrón.

## Economía — monedas

Lady Run tiene su propia jerarquía de monedas, en paralelo a la de Pata y Pico (oro no se usa aquí — el HUD standalone lo muestra igual porque comparte `gameState`, pero no se gana ni se gasta jugando):

1. **Chapas** (`gameState.chapas`, icono `icons/hud/chapas.webp`) — la más fácil de conseguir, sale con frecuencia durante el recorrido.
2. **Tavern Coin** (`gameState.tavernCoins`) — sale de vez en cuando (cada 4 tramos).
3. **Huesín** (`gameState.huesin`) — pendiente de diseñar: se entregaría solo al terminar la partida, escalando con lo lejos que llegues. No implementado todavía.

### Chapas — regalo de progresión

Se engancha al obstáculo real que le toca, en la posición CONTRARIA a la que exige esquivarlo (si el obstáculo es terrestre, la chapa sale arriba y solo se coge saltando; si es aéreo, sale abajo). Cantidad y espaciado escalan con la dificultad:

| Dificultad | Total | En qué obstáculo de la partida |
|---|---|---|
| Fácil | 3 | nº1 (terrestre), nº2 (aéreo), nº4 |
| Medio | 4 | nº1, nº2, nº4, nº5 |
| Difícil | 5 | nº1, nº2, nº4, nº5, nº6 |

El regalo completo se repite durante toda la partida en las 3 dificultades, no es solo al principio:

| Dificultad | Se repite cada | Tramos |
|---|---|---|
| Fácil | 10 tramos | 10, 20, 30... |
| Medio / Difícil | 5 tramos | 5, 10, 15... |

### Tavern Coin

Cada 4 tramos, se engancha al siguiente obstáculo real (separada en X para no coincidir nunca con la zona de peligro), altura al azar (no depende de esquivar bien, a diferencia de la chapa). Cantidad por disparo según dificultad: **1 en Fácil, 2 en Medio, 3 en Difícil**.

### Corazón extra (pickup en carrera)

Cada 20s a partir del segundo 25 de partida, se engancha al siguiente obstáculo real (misma lógica de posición contraria que la chapa). Suma +1 vida al instante, sin tope.

### Regalo de oro inicial — placeholder histórico

Nota de proceso: el regalo inicial de chapas se probó primero con un asset de oro genérico como placeholder de prueba, antes de que existiera el asset final de "chapas". Ya no queda ningún rastro de eso en el código.

### Recogibles: tamaño y animación al coger

Corazón, tavern coin y chapa son más pequeños que un obstáculo normal (`PICKUP_SIZE = 38px` vs 46px). Al recogerlos, se PARAN en el sitio (dejan de moverse con el scroll) y se encogen + desvanecen en 0.35s (`PICKUP_COLLECT_ANIM_MS`), en vez de seguir corriendo como un obstáculo normal.

## Límite diario anti-farmeo

Sin este límite, era posible farmear moneda casi gratis: la primera parte de una partida (sobre todo en Fácil) tiene riesgo real casi nulo, así que "empezar → coger el regalo inicial → morir/reiniciar → repetir" daba moneda con coste de tiempo mínimo.

**Diseño final** (tras descartar 2 versiones intermedias — ver "Historial de decisiones" abajo): cada dificultad (Fácil/Medio/Difícil) tiene su propio contador independiente de **3 partidas al día** con botín normal (`gameState.ladyRunDailyRuns.{facil,medio,dificil}`, reset a medianoche, mismo patrón `getHuntRotationKey` que el resto de dailies del juego). Jugar en una dificultad no gasta las partidas de las otras — a propósito, para animar a probar las 3.

A partir de la 4ª partida del día (por dificultad), esa run entra en modo **reducido**:
- Se sortea UNA VEZ al empezar la partida un tope de **1 o 2 chapas** en total para toda la run (en vez de las 3-5 normales según dificultad) — el resto de chapas de la progresión simplemente no se generan.
- Cada disparo de tavern coin da **0 o 1** al azar (en vez de 1-3 según dificultad).
- Lo que sí sale, vale su valor COMPLETO normal — no hay tirada de valor al recogerlo.
- Los corazones (vida extra) no se ven afectados por este límite, nunca lo estuvieron.

Debajo de "Empezar"/"Reintentar" se muestra "X/3 con botín completo hoy" o "Botín reducido hoy". Hay un botón dev-only (`import.meta.env.DEV`) para resetear el contador de la dificultad activa, útil para probar.

### Historial de decisiones (para no repetir el mismo error)

1. Primera versión: al recoger cada chapa/coin en partida reducida, tirada de 50% nada / 50% ~30% del valor normal — el objeto seguía apareciendo y con su animación de "recogido" igual siempre. Se descartó porque se sentía como "moneda fantasma": visualmente parecía que sí lo habías cogido aunque no sumara nada. **No volver a esta versión.**
2. Se consideró que directamente NO aparecieran objetos en partida reducida (cero visible) — tampoco es lo que se quería.
3. **Versión final (la de arriba)**: menos objetos, pero los que salen valen su valor completo. Sin sorpresas ocultas al recogerlos.

## Tienda ("Tienda" — nombre momentáneo)

Modal propio (`LadyRunShopModal.jsx` + CSS propio), pantalla completa (mismo patrón que Recompensas), separado a propósito del `SkinShopModal` de Pata y Pico para no tocar su economía/precios. 2 pestañas con estilo `.gds-tab` (texto plano, sin iconos, el mismo toggle que usa Misiones Minero/Forja):

- **Skins**: vacía, "Próximamente".
- **Objetos**: 2 filas, solo con precio visible por ahora:
  - **Corazón extra** — 50 chapas, comprable. Se acumula en `gameState.ladyRunPendingHearts` (consumible, sin tope). Al empezar la próxima partida, se suma entero a las vidas iniciales (3 + bonus) y se consume del todo, sea cual sea el resultado de esa partida. Se ve reflejado en tiempo real en la pantalla de selección (más corazones llenos de lo normal) en cuanto lo compras, sin necesidad de reiniciar. Funciona igual en Modo Libre e Historia (la lógica de vidas iniciales no distingue modo).
  - **Escudo** — 80 chapas, precio visible pero SIN lógica de compra ni de efecto todavía ("protege de hasta 2 fallos" es solo descripción, no implementado).

## Pendiente / ideas sin implementar

- Animar los sprites de correr de Lady, Smoke, Tokio, Tuka, Zeus, Nupito (mismo patrón que Gordo/Muna/Druh) para desbloquearlos.
- Huesín: recompensa de fin de partida, escalando con la distancia — sin diseñar.
- Escudo: mecánica real (¿absorbe golpes automáticamente? ¿se ve en HUD con contador?) — sin definir.
- Capítulos de Historia (Mina, Ciudad) — decidido que se reconecta bajo Historia, pantalla de lista de capítulos pegada a la derecha, sin implementar todavía (ver sección Historia arriba).
- Modo 1v1 online (sala + invitar amigo, vía Supabase) — solo diseño de alto nivel hablado, sin empezar. MVP factible: seed de obstáculos compartida entre los 2 clientes + solo eventos de vida/game-over por Realtime, sin sincronizar posición en vivo (eso sería la parte cara).
- Demo ambiental de CPU en la card de elegir modo (el perro de fondo pasaría a jugar solo de verdad) — solo idea anotada.
- Obstáculos que exijan doble salto — pendiente de retomar con el salto ya calibrado.
- Fondo con parallax + árboles/aves sueltos — a la espera de arte.

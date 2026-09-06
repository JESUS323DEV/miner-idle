# Lady Run — Documentación

Minijuego "corre y esquiva" dentro de Lady Hungry. Componente aislado (`src/screens/modalRunner/RunnerScreen.jsx`), no depende del `gameState` principal salvo para las piezas de economía explícitamente conectadas (ver más abajo).

> Mantener este documento actualizado cada vez que se cierre un cambio real. Si algo de aquí queda desfasado, corregirlo en el momento, no dejarlo acumular.

## Accesos

- **Dentro de Pata y Pico**: botón "Carrera" en el hub de Raids (`RaidScreen.jsx`), gateado tras `import.meta.env.DEV` — no aparece en producción todavía.
- **Standalone**: `?lady-run` como query param (`App.jsx` → `LadyRunStandalone.jsx`). Carga solo lo necesario del Runner, no arrastra los ~500 assets del juego principal. Mismo guardado (`localStorage`) que el juego completo, así que la moneda se comparte entre los 2 accesos.
- Panel de debug de `GameRoot.jsx` también tiene un botón "abrir runner" redundante (dev-only).

## Modos

Pantalla inicial de varias cards independientes (no un único bloque de botones): **Modo Libre** (jugable) + **Historia** (bloqueada, candado) en `.runner-mode-select`; **Tienda** en su propia card aparte (`.runner-mode-card-shop`) — **jugable/accesible, NO bloqueada** (esto quedó desactualizado en una versión anterior de esta doc); y 3 cards más bloqueadas con etiqueta "Próximamente": **Eventos**, **Torneo** y **Skins** (media card).

- **Modo Libre**: carrera infinita en solitario, sin rival CPU visible (la card de arriba no se renderiza en este modo, `isLibre`) ni poderes ni boss. 5 fondos con nombre propio en `escenarios-run-libre/` (`libre-bosque`, `libre-ciudad`, `libre-desierto`, `libre-minas`, `libre-pradera`; el de `libre-ciudad` también se reutiliza como 4º escenario del capítulo Ciudad en Historia). Se sortea 1 al pulsar Empezar, revelado con un efecto de ruleta (tira de fondos deslizándose en horizontal, frenando hasta pararse en el elegido) antes de arrancar la partida.
- **Historia** (bloqueada, ver arriba): CPU 1v1 + poderes de sabotaje → fase boss al vencerla, organizada en capítulos (Capítulo 1 = Mina, Capítulo 2 = Ciudad), cada uno con 3 escenarios encadenados y su propio checkpoint ("Continuar" entre escenarios, "Reclamar" solo en el último). Pendiente de un repaso a fondo de esta sección de la doc, desactualizada desde antes del trabajo de combate de boss de esta semana.

## Roster de perros

9 perros seleccionables, con 2 sistemas de bloqueo INDEPENDIENTES entre sí (uno por animación pendiente, otro por precio):

### Bloqueo por animación pendiente (`LOCKED_DOG_IDS`)

Bloqueados con candado + "Próximamente": **Smoke, Zeus, Tokio, Tuka**. Libres de este bloqueo (ya animados): **Lady, Gordo, Muna, Nupito, Druh**.

Motivo: los bloqueados todavía usan el sistema viejo de 4 imágenes sueltas (`gordo-1.webp`, `gordo-2.webp`, `gordo-3.webp`, `gordo-4.webp`...) que el código va alternando rápido para simular que corre — se ve un poco a saltos. Los ya animados usan un ÚNICO archivo webp que YA trae la animación de correr grabada dentro de él (se exportó así desde Aseprite), así que se ve fluido de verdad sin que el código tenga que alternar nada.

Ejemplo concreto con Gordo: `gordo-1.webp` es el único archivo que se usa para TODO el ciclo de correr (se anima solo). `gordo-2.webp` (uno de los 4 antiguos) se reutiliza aparte, fijo, SOLO para la pose de salto (`DOG_JUMP_FRAME`) — si no se hiciera así, al saltar se vería corriendo en el aire en vez de con una pose de salto.

Tuka tuvo su propio ciclo animado en algún momento y se desbloqueó, pero se volvió a bloquear (2026-09-06, pendiente de pulir) — no asumir que "ya animado" es un estado permanente para ningún perro hasta confirmarlo en `LOCKED_DOG_IDS` directamente en el código.

Cuando se anime el resto (exportando su ciclo de correr como un único webp animado, igual que Gordo), se desbloquean siguiendo el mismo patrón.

### Bloqueo por precio (`PAID_DOG_IDS`) — SOLO afecta a Historia

De los ya animados, **Lady, Muna, Nupito** tienen precio (10 huesín + 5 tavern coin, pago único, permanente, `gameState.ladyRunUnlockedDogs`) — el precio y el candado se muestran superpuestos sobre el propio icono del perro en el selector. **Gordo y Druh** son gratis siempre.

**Importante (2026-09-06):** este precio SOLO aplica en **Historia**. En **Modo Libre todos los perros ya animados son gratis**, sin excepción — se quiere que se prueben todos sin fricción ahí. Esto es un caso concreto de la regla general "los modos de Lady Run son independientes entre sí" (ver `feedback_lady_run_modos_independientes` en memoria): un sistema de un modo no se asume aplicado a otro sin pedirlo explícitamente.

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
3. **Huesín** (`gameState.huesin`) — YA IMPLEMENTADO (2026-09-06, la nota de "pendiente de diseñar" quedó obsoleta): sale del 3er tramo de cada fase de 3 (`RUN_MILESTONE_REWARDS`, ver tabla más abajo), nunca se genera suelto en la pista.
4. **Huesos** (pickup de pista, no es moneda por sí solo) — se convierte en chapas/coins al terminar la run, ver sección propia más abajo.

### Multiplicador de recompensas — "la pata" (`pawFill`)

Icono de pata que se va llenando (0-5, `PAW_FILL_MAX`) una vez por cada tramo/milestone cruzado en Modo Libre, sin tope de tiempo (sube toda la partida, nunca baja hasta que termina la run). Al morir, si `pawFill >= 2`, se aplica como multiplicador PLANO a todo lo acumulado de **coins, huesín y chapas de tramo** en esa run (`claimRunMilestoneRewards`) — con 5 tramos cruzados ya llegas al tope x5. El bono de huesos (ver abajo) queda FUERA de este multiplicador, siempre suma tal cual.

Se muestra en 2 sitios: una barra de progreso en pantalla (posición dentro de la fase actual, se reinicia visualmente cada 3 tramos aunque el nivel de la pata no baje) y, desde 2026-09-06, como primer elemento de la fila de recompensas en Game Over (ver "Revelado de Game Over" más abajo).

### Tabla de recompensas por tramo (`RUN_MILESTONE_REWARDS`)

| Dificultad | Tramo 1 | Tramo 2 | Tramo 3 |
|---|---|---|---|
| Fácil | +2 coins | +3 coins | +1 huesín |
| Medio | +3 coins | +4 coins | +2 huesín |
| Difícil | +4 coins | +5 coins | +3 huesín |

Se repite cada fase de 3 tramos, toda la partida (sin meta final). Solo se cobran los tramos que ese día, en esa dificultad, todavía no se hubieran cobrado ya (`dailyTramosClaimedToday`, contador independiente por dificultad) — si una run no llega más lejos que tu mejor marca del día, no da nada nuevo de tramos, pero tampoco pierdes el progreso ya guardado.

### Huesos (pickup en carrera, 2026-09-06)

A diferencia de corazón/chapa/coin (que aparecen por tramos o intervalos), el hueso es CONSTANTE durante toda la partida: ciclo de 4 spawns (3 con hueso + 1 hueco), en patrón "bocadillo" (uno antes del obstáculo real, otro después — nunca 2 pegados uno detrás de otro). No empieza hasta el 3er obstáculo de la run (para no coincidir con el regalo de chapa inicial). Exige la acción CONTRARIA al obstáculo real que acompaña, igual que el corazón.

Se acumula en un contador propio de la run (sin recompensa inmediata al cogerlo, solo un contador visible arriba a la derecha de la pista). Al terminar la run, se convierte en recompensa aparte (nunca multiplicada por la pata):

- Cada **20 huesos** → +1 chapa.
- Cada **100 huesos** → +2 chapas y +1 tavern coin EXTRA (se suma a lo anterior, no lo sustituye).
- Sin tope, sigue escalando cuantos más consigas.

### Corazón mágico de pista (pickup gratuito, 2026-09-06)

Distinto del "Corazón mágico" de la Tienda (ver sección Tienda): este aparece solo, cada 10 tramos, en las 3 dificultades. No se guarda en ningún inventario — al cogerlo en la pista, activa la invulnerabilidad de 5s al instante (mismo `MAGIC_HEART_INVULN_MS` que la versión de Tienda). Mismo emparejamiento de acción contraria que el resto de pickups.

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

### Revelado escalonado en Game Over (2026-09-06, solo Modo Libre)

En vez de mostrar todo de golpe, la pantalla de resultado revela por etapas: corazones+perro+nombre (inmediato) → Puntos → metros/récord → fila de recompensas. La fila de recompensas aparece en este orden, de izquierda a derecha, cada una con su propio efecto antes de pasar a la siguiente:

1. **Pata** (multiplicador): aparece vacía, crece al "comprobar", y si `pawFill > 0` se rellena paso a paso (sprite + tamaño +2px por paso) hasta el valor final. Va primero porque explica por qué los números que siguen ya vienen multiplicados.
2. **Huesos**: crece, y si hay alguno cuenta a saltos (no de 1 en 1 — el total puede ser grande) hasta el total, sin girar. El icono crece por centena alcanzada (tope +15px desde 400).
3. **Chapas**, 4. **Coins**, 5. **Huesín**: cada una crece, y si tiene algo gira + cuenta 1 a 1 hasta el total; si es 0, vuelve a su tamaño normal y pasa a la siguiente sin más.

Si una recompensa da 0, nunca hace su efecto (ni gira ni cuenta) — pasa directo a la siguiente. El contador de huesos de la pista (arriba a la derecha) se descuenta en espejo mientras el de abajo sube, hasta llegar a 0 en ambos.

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

Modal propio (`LadyRunShopModal.jsx` + CSS propio), pantalla completa, separado a propósito del `SkinShopModal` de Pata y Pico para no tocar su economía/precios. Reescrita el 2026-09-06: ya NO tiene pestañas ni sección Skins — una sola pantalla con una rejilla 2x2 de cards (`.lady-run-shop-content`, fondo `diamond.webp`), pegada justo debajo del título.

1. **Corazón extra** — 50 chapas. Se acumula en `gameState.ladyRunPendingHearts` (consumible, sin tope). Al empezar la próxima partida, se suma entero a las vidas iniciales (3 + bonus) y se consume del todo, sea cual sea el resultado de esa partida. Se ve reflejado en tiempo real en la pantalla de selección en cuanto lo compras. Funciona igual en Modo Libre e Historia.
2. **Corazón mágico** — 100 tavern coins, tope 2 guardados (`gameState.ladyRunMagicHearts`). Da 5s de invulnerabilidad al usarlo (botón satélite propio junto al de saltar, con contador de cargas), se mantiene entre partidas si no se usa. Distinto del "corazón mágico de pista" (gratis, ver Economía) — este es de pago y se activa cuando el jugador decide.
3. **Corazón verde** — 150 chapas, tope 5 guardados (`gameState.ladyRunGreenHearts`). Escudo: al empezar la run, todos los que tengas guardados se muestran como corazones EXTRA verdes pegados a la fila normal de 3 (también visibles en la pantalla inicial, antes de pulsar Empezar). Cada golpe que normalmente restaría 1 vida real, en vez de eso consume 1 corazón verde (si tienes alguno activo); solo cuando se agotan, los golpes vuelven a quitar vida real. Se pierden de verdad al gastarse, no se recuperan. Solo tiene efecto en Modo Libre (en Historia no se ha decidido todavía si se usará). El sistema de vidas normal (tiers 3/6/9) queda intacto, esto es una capa aparte.
4. **Bomba** — solo idea anotada, card visible sin funcionalidad (botón "Próx." deshabilitado, sin icono). Pensada para comportarse como el corazón mágico (comprable, tope 2, botón satélite) pero limpiando de la pantalla todos los obstáculos de peligro (terrestres y aéreos, no los pickups) al usarla — sin implementar, sin precio decidido.

Todos los botones de compra usan `.runner-start-btn` con estado `:disabled` visual (gris, sin brillo) cuando no llega el dinero o se alcanzó el tope — antes el botón se deshabilitaba por dentro pero se veía igual, se corrigió el 2026-09-06.

## Pendiente / ideas sin implementar

- Animar los sprites de correr de Smoke, Tokio, Tuka, Zeus (mismo patrón que Gordo/Muna/Nupito/Lady/Druh) para desbloquearlos.
- Bomba (Tienda): mecánica real de limpiar obstáculos de la pantalla — solo idea anotada, sin precio ni implementación.
- Capítulos de Historia (Mina, Ciudad) — decidido que se reconecta bajo Historia, pantalla de lista de capítulos pegada a la derecha, sin implementar todavía (ver sección Historia arriba).
- Modo 1v1 online (sala + invitar amigo, vía Supabase) — solo diseño de alto nivel hablado, sin empezar. MVP factible: seed de obstáculos compartida entre los 2 clientes + solo eventos de vida/game-over por Realtime, sin sincronizar posición en vivo (eso sería la parte cara).
- Demo ambiental de CPU en la card de elegir modo (el perro de fondo pasaría a jugar solo de verdad) — solo idea anotada.
- Obstáculos que exijan doble salto — pendiente de retomar con el salto ya calibrado.
- Fondo con parallax + árboles/aves sueltos — a la espera de arte.

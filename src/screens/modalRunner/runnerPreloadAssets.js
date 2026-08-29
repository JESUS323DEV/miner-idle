// Lista de assets propios de Lady Run para precargar en el acceso standalone (LadyRunStandalone).
// Archivo aparte (no dentro de RunnerScreen.jsx) porque exportar constantes junto a un
// componente rompe React Fast Refresh (react-refresh/only-export-components).

import ladyRun1 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-1.webp';
import ladyRun2 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-2.webp';
import ladyRun3 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-3.webp';
import ladyRun4 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-4.webp';
import gordoRun1 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-1.webp';
import gordoRun2 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-2.webp';
import gordoRun3 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-3.webp';
import gordoRun4 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-4.webp';
import munaRun1 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-1.webp';
import munaRun2 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-2.webp';
import munaRun3 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-3.webp';
import munaRun4 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-4.webp';
import nupitoRun1 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-1.webp';
import nupitoRun2 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-2.webp';
import nupitoRun3 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-3.webp';
import nupitoRun4 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-4.webp';
import smokeRun1 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-1.webp';
import smokeRun2 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-2.webp';
import smokeRun3 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-3.webp';
import smokeRun4 from '../../assets/ui/lady-sprite/sprite-run/smoke-run/smoke-4.webp';
import tokyoRun1 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-1.webp';
import tokyoRun2 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-2.webp';
import tokyoRun3 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-3.webp';
import tokyoRun4 from '../../assets/ui/lady-sprite/sprite-run/tokyo-run/tokyo-4.webp';
import tukaRun1 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-1.webp';
import tukaRun2 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-2.webp';
import tukaRun3 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-3.webp';
import tukaRun4 from '../../assets/ui/lady-sprite/sprite-run/tuka-run/tuka-4.webp';
import zeusRun1 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-1.webp';
import zeusRun2 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-2.webp';
import zeusRun3 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-3.webp';
import zeusRun4 from '../../assets/ui/lady-sprite/sprite-run/zeus-run/zeus-4.webp';
import druhRun1 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-1.webp';
import druhRun2 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-2.webp';
import druhRun3 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-3.webp';
import druhRun4 from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-4.webp';

import ladyIcon    from '../../assets/ui/icons-pets/mineros/lady-icon.webp';
import gordoIcon   from '../../assets/ui/icons-pets/mineros/gordo-icon.webp';
import munaIcon    from '../../assets/ui/icons-pets/mineros/muna-icon.webp';
import nupitoIcon  from '../../assets/ui/icons-pets/mineros/nupito-icon.webp';
import smokeIcon   from '../../assets/ui/icons-pets/mineros/smoke-icon.webp';
import tokyoIcon   from '../../assets/ui/icons-pets/mineros/tokyo-icon.webp';
import tukaIcon    from '../../assets/ui/icons-pets/mineros/tuka-icon.webp';
import zeusIcon    from '../../assets/ui/icons-pets/mineros/zeus-icon.webp';
import druhIcon    from '../../assets/ui/icons-pets/mineros/druh-icon.webp';

import obstaculo3 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/obstaculo3.webp';
import obstaculoAereo from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/obstaculo-aereo.webp';

import fuegoObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-fuego2.webp';
import electricoObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-electrico2.webp';
import aguaObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-hielo2.webp';
import tierraObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-tierra2.webp';
import oscuroObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-oscuro2.webp';

import batBoss from '../../assets/ui/icons-enemy/enemy-animation/bats/bat001.webp';

import runnerFondo1 from '../../assets/ui/icons-hud/hud-modals/game-run/fondo-1.webp';
import runnerFondoRun from '../../assets/ui/icons-hud/hud-modals/game-run/pruebas/nueva-escena-2.webp';

export const RUNNER_PRELOAD_IMAGES = [
    ladyRun1, ladyRun2, ladyRun3, ladyRun4,
    gordoRun1, gordoRun2, gordoRun3, gordoRun4,
    munaRun1, munaRun2, munaRun3, munaRun4,
    nupitoRun1, nupitoRun2, nupitoRun3, nupitoRun4,
    smokeRun1, smokeRun2, smokeRun3, smokeRun4,
    tokyoRun1, tokyoRun2, tokyoRun3, tokyoRun4,
    tukaRun1, tukaRun2, tukaRun3, tukaRun4,
    zeusRun1, zeusRun2, zeusRun3, zeusRun4,
    druhRun1, druhRun2, druhRun3, druhRun4,
    ladyIcon, gordoIcon, munaIcon, nupitoIcon, smokeIcon, tokyoIcon, tukaIcon, zeusIcon, druhIcon,
    obstaculo3, obstaculoAereo,
    fuegoObstacle, electricoObstacle, aguaObstacle, tierraObstacle, oscuroObstacle,
    batBoss,
    runnerFondo1, runnerFondoRun,
];

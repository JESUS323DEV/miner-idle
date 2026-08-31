// Lista de assets propios de Lady Run para precargar en el acceso standalone (LadyRunStandalone).
// Archivo aparte (no dentro de RunnerScreen.jsx) porque exportar constantes junto a un
// componente rompe React Fast Refresh (react-refresh/only-export-components).

import ladyRun1 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-1.webp';
import ladyRun2 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-2.webp';
import ladyRun3 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-3.webp';
import ladyRun4 from '../../assets/ui/lady-sprite/sprite-run/lady-run/lady-4.webp';
import gordoRun1 from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-1.webp';
import gordoJump from '../../assets/ui/lady-sprite/sprite-run/gordo-run/gordo-2.webp';
import munaRun1 from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-1.webp';
import munaJump from '../../assets/ui/lady-sprite/sprite-run/muna-run/muna-2.webp';
import nupitoRun1 from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-1.webp';
import nupitoJump from '../../assets/ui/lady-sprite/sprite-run/nupito-run/nupito-2.webp';
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
import druhJump from '../../assets/ui/lady-sprite/sprite-run/druh-run/druh-2.webp';

import ladyIcon    from '../../assets/ui/icons-pets/mineros/lady-icon.webp';
import gordoIcon   from '../../assets/ui/icons-pets/mineros/gordo-icon.webp';
import munaIcon    from '../../assets/ui/icons-pets/mineros/muna-icon.webp';
import nupitoIcon  from '../../assets/ui/icons-pets/mineros/nupito-icon.webp';
import smokeIcon   from '../../assets/ui/icons-pets/mineros/smoke-icon.webp';
import tokyoIcon   from '../../assets/ui/icons-pets/mineros/tokyo-icon.webp';
import tukaIcon    from '../../assets/ui/icons-pets/mineros/tuka-icon.webp';
import zeusIcon    from '../../assets/ui/icons-pets/mineros/zeus-icon.webp';
import druhIcon    from '../../assets/ui/icons-pets/mineros/druh-icon.webp';

import obstaculo2 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo2.webp';
import obstaculoRata from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo-rata.webp';
import obstaculoTopo1 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/mina/obstaculo-topo1.webp';
import obstaculo3 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/libre/obstaculo3.webp';
import obstaculo4 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/libre/obstaculo4.webp';
import obstaculo6 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/desierto/obstaculo6.webp';
import obstaculoGato1 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/ciudad/obstaculo-gato1.webp';
import obstaculoArmadillo from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/terrestres/desierto/obstaculo-armadillo.webp';
import obstaculoAereo from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/ciudad/obstaculo-aereo.webp';
import obstaculoAereo2 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/desierto/obstaculo-aereo2.webp';
import obstaculoAereo3 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/libre/obstaculo-aereo3.webp';
import obstaculoAereoCuevas from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/mina/obstaculo-aereo-cuevas.webp';
import obstaculoAereoCuevas2 from '../../assets/ui/icons-hud/hud-modals/game-run/obstaculos/aereos/mina/obstaculo-aereo-cuevas2.webp';

import fuegoObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-fuego2.webp';
import electricoObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-electrico2.webp';
import aguaObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-hielo2.webp';
import tierraObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-tierra2.webp';
import oscuroObstacle from '../../assets/ui/icons-hud/hud-modals/game-run/poderes-obstaculos/Sprite-oscuro2.webp';

import batBoss from '../../assets/ui/icons-enemy/enemy-animation/bats/bat001.webp';
import bat002 from '../../assets/ui/icons-enemy/enemy-animation/bats/bat002.webp';
import batBossFinal from '../../assets/ui/icons-enemy/enemy-animation/bats/bat-boss.webp';
import spider001 from '../../assets/ui/icons-enemy/enemy-animation/spider/spider001.webp';
import spider002 from '../../assets/ui/icons-enemy/enemy-animation/spider/spider002.webp';
import spiderBossFinal from '../../assets/ui/icons-enemy/enemy-animation/spider/spider-boss.webp';

import runnerFondo1 from '../../assets/ui/icons-hud/hud-modals/game-run/fondo-1.webp';
import runnerFondoRun from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-1.webp';
import runnerFondoRun2 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-2.webp';
import runnerFondoRun3 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-3.webp';
import runnerFondoRun4 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run-libre/libre-4.webp';
import escenarioMina1 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-1.webp';
import escenarioMina2 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-2.webp';
import escenarioMina3 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-1/escenario-mina-3.webp';
import escenarioCiudad1 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-1.webp';
import escenarioCiudad2 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-2.webp';
import escenarioCiudad3 from '../../assets/ui/icons-hud/hud-modals/game-run/escenarios-run/card-2/escenario-ciudad-3.webp';

import lockIcon from '../../assets/ui/icons-hud/hud-modals/rewards/icon-rewards/lock.webp';
import tavernCoinIcon from '../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import chapaIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/chapas.webp';

export const RUNNER_PRELOAD_IMAGES = [
    ladyRun1, ladyRun2, ladyRun3, ladyRun4,
    gordoRun1, gordoJump,
    munaRun1, munaJump,
    nupitoRun1, nupitoJump,
    smokeRun1, smokeRun2, smokeRun3, smokeRun4,
    tokyoRun1, tokyoRun2, tokyoRun3, tokyoRun4,
    tukaRun1, tukaRun2, tukaRun3, tukaRun4,
    zeusRun1, zeusRun2, zeusRun3, zeusRun4,
    druhRun1, druhJump,
    ladyIcon, gordoIcon, munaIcon, nupitoIcon, smokeIcon, tokyoIcon, tukaIcon, zeusIcon, druhIcon,
    lockIcon, tavernCoinIcon, chapaIcon,
    obstaculo2, obstaculo3, obstaculo4, obstaculo6, obstaculoRata, obstaculoTopo1,
    obstaculoGato1, obstaculoArmadillo,
    obstaculoAereo, obstaculoAereo2, obstaculoAereo3, obstaculoAereoCuevas, obstaculoAereoCuevas2,
    fuegoObstacle, electricoObstacle, aguaObstacle, tierraObstacle, oscuroObstacle,
    batBoss, bat002, batBossFinal, spider001, spider002, spiderBossFinal,
    runnerFondo1, runnerFondoRun, runnerFondoRun2, runnerFondoRun3, runnerFondoRun4,
    escenarioMina1, escenarioMina2, escenarioMina3, escenarioCiudad1, escenarioCiudad2, escenarioCiudad3,
];

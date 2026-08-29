// Lista de assets de la tienda de skins para precargar en el acceso standalone (LadyRunStandalone).
// Cubre las imagenes de cada skin (grid + preview). No incluye los sprites de la animacion de
// compra (PURCHASE_ANIM_FRAMES/SKIN_RUN_OVERRIDE en SkinShopModal.jsx): son ~90 imports mas que
// solo se ven unos segundos durante la animacion de comprar, se dejan cargar bajo demanda como hoy.

import { dogSkinAssets } from '../../game/utils/dogSkinAssets.js';

export const SKIN_SHOP_PRELOAD_IMAGES = Object.values(dogSkinAssets).flatMap(skins => Object.values(skins));

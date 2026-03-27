# Lady Hungry 🐾⛏️

> Idle clicker de minería con perros, forja y taberna. Mina, mejora tu pico, consigue materiales y desbloquea nuevas minas mientras tus mascotas trabajan por ti.

---

## ¿Qué es Lady Hungry?

Lady Hungry es un juego idle/clicker de navegador. El jugador mina venas de recursos (bronce, hierro, diamante), mejora su equipamiento, gestiona su stamina y desbloquea nuevas zonas progresivamente.

El loop principal es:
**Minar → Obtener materiales → Mejorar pico / stamina → Desbloquear minas más profundas → Repetir**

A medida que avanza, el jugador desbloquea sistemas adicionales: la forja para convertir materiales en lingotes, la taberna para conseguir perros mediante gacha, y los yacimientos para minado pasivo.

---

## Sistemas del juego

### ⛏️ Minado
- Click en venas para obtener materiales (bronce, hierro, diamante)
- Cada golpe consume **stamina** y reduce la **durabilidad del pico**
- Sistema de **combos**: clicks rápidos sucesivos aumentan el multiplicador de oro
- Ciclo **día/noche** con hora y contador de días

### 🪓 Pico
- Tiers de material: madera → bronce → hierro → diamante
- Cada tier tiene niveles de **refuerzo** (aumenta daño y durabilidad)
- Se repara con oro; la reparación sube de coste con el uso

### ⚡ Stamina
- Recurso limitado que se consume al minar
- Se puede mejorar el máximo con oro (upgrade progresivo)
- Se recarga manualmente o con snacks

### 🔥 Forja
- Tres hornos: bronce, hierro, diamante
- Convierte materiales en lingotes automáticamente
- Cada horno tiene niveles de mejora que reducen el tiempo de fundición
- Los perros asignados a la forja reducen el tiempo según sus estrellas

### 🍺 Taberna
- Sistema de **gacha** con sobres de distintas raridades (common, uncommon, rare, epic, legendary)
- Perros con rareza, poder de minado, velocidad y bonus por bioma
- Sistema de **estrellas** (0–5): se mejoran con fragmentos del mismo perro
- **Pity system**: garantiza rareza alta tras X tiradas sin obtenerla
- Monedas de taberna (🪙) como divisa secundaria para recompensas especiales

### 🗺️ Minas
- Mapa de biomas con minas de tres niveles por material (Bronce I/II/III, Hierro I/II/III, Diamante I/II/III)
- Las minas superiores requieren estrellas en minas anteriores para desbloquearse
- Sistema de **estrellas al completar**: según materiales obtenidos (básico / bueno / perfecto)
- **Yacimientos**: menas pasivas en cada bioma que el jugador puede excavar y asignar a perros

### 🐕 Perros
- Se consiguen en la taberna y se asignan a yacimientos o a la forja
- Cada perro tiene: poder de minado, velocidad, bonus por bioma, reducción de forja
- Las estrellas amplifican todas sus estadísticas mediante multiplicadores por tier

### 🍬 Snacks de mina
- **Automine**: el juego mina automáticamente por X segundos
- **Dinamita**: destruye todas las venas restantes de golpe
- **Toughness**: reduce el daño a la durabilidad del pico durante un tiempo
- Se compran con oro y tienen cargas limitadas

### 🏆 Recompensas
- Hitos de oro (minado, gastado, por segundo), clicks, stamina, pico, reparaciones, recargas
- Recompensas únicas de monedas de taberna por desbloquear minas, hornos y tipos de pico
- Recompensas progresivas de monedas por tiers de pico y mejoras de forja

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| React 19 | UI y componentes |
| Vite 7 + SWC | Bundler y compilación rápida |
| Context API | Estado global del juego (`GameContext`) |
| CSS modular | Estilos por pantalla/modal |
| Lucide React | Iconografía |

Sin backend. El estado vive en memoria durante la sesión.

---

## Estructura del proyecto

```
src/
├── assets/                  # Sprites, fondos, iconos
├── game/
│   ├── config/              # Configuración de minas, pico, perros, snacks
│   ├── context/             # GameContext — estado global y dispatch
│   ├── hooks/
│   │   ├── actions/         # Lógica por sistema (forja, perros, yacimientos...)
│   │   └── helpers/         # Utilidades (milestones, gacha...)
│   └── initialState/        # Estado inicial del juego y recompensas
└── screens/
    ├── modalMine/           # Pantalla de mina y mapa de minas
    ├── modalTavern/         # Taberna, sobres, perros
    └── ...                  # GameRoot, Forja, Recompensas
```

---

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

```bash
npm run build    # Build de producción
npm run preview  # Preview del build
```

---

## Pendiente / Roadmap

- [ ] Divisa secundaria (plata) para taberna y apuestas
- [ ] Evento ladrón de oro (`thiefRisk`)
- [ ] Filtro de perros por rareza en la taberna
- [ ] Persistencia de partida (localStorage / exportar guardado)
- [ ] Screenshots y capturas en este README

---

*Proyecto personal en desarrollo activo.*

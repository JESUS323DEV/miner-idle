import { useState, lazy, Suspense } from 'react';
import LandingScreen from './screens/LandingScreen.jsx'
import { usePreloader } from './components/Preloader.jsx'
import LadyRunStandalone from './screens/standalone/LadyRunStandalone.jsx'
import './styles/loading.css'

// Import perezoso: GameRoot arrastra todo Pata y Pico (Raids, Combate, Minas, Taberna...),
// así el acceso standalone de Lady Run (?lady-run) no descarga ese chunk ni corre el preloader completo.
const GameRoot = lazy(() => import('./screens/GameRoot.jsx'));

const isStandaloneLadyRun = new URLSearchParams(window.location.search).has('lady-run');

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-spinner" />
  </div>
);

function FullGame() {
  const loaded = usePreloader();
  const [gameActive, setGameActive] = useState(false);

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      <LandingScreen active={!gameActive} onPlay={() => setGameActive(true)} />
      <Suspense fallback={<LoadingScreen />}>
        <GameRoot onBack={() => setGameActive(false)} />
      </Suspense>
    </>
  );
}

function App() {
  if (isStandaloneLadyRun) {
    return <LadyRunStandalone />;
  }

  return <FullGame />;
}

export default App

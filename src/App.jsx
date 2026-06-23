import { useState } from 'react';
import GameRoot from './screens/GameRoot.jsx'
import LandingScreen from './screens/LandingScreen.jsx'
import { usePreloader } from './components/Preloader.jsx'
import './styles/loading.css'

function App() {
  const loaded = usePreloader();
  const [gameActive, setGameActive] = useState(false);

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <LandingScreen active={!gameActive} onPlay={() => setGameActive(true)} />
      <GameRoot onBack={() => setGameActive(false)} />
    </>
  );
}

export default App

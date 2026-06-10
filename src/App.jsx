import GameRoot from './screens/GameRoot.jsx'
import { usePreloader } from './components/Preloader.jsx'
import './styles/loading.css'

function App() {
  const loaded = usePreloader();

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return <GameRoot />;
}

export default App

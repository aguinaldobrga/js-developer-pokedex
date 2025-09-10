import { useState } from 'react';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { HomePage } from './pages/HomePage'; // Importe a sua nova página

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleAnimationEnd = () => {
    setShowSplash(false);
  };

  return (
    <div style={{ padding: '0', margin: '0' }}>
      {showSplash ? (
        <SplashScreen onAnimationEnd={handleAnimationEnd} />
      ) : (
        <>
          <Header />
          <HomePage />
        </>
      )}
    </div>
  );
}

export default App;
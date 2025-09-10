import { useEffect, useState } from 'react';
import './SplashScreen.css'; 
import PokedexLogo from '../../assets/img/icons8-ultra-ball-96.png';

interface SplashScreenProps {
  onAnimationEnd: () => void; // Função para chamar quando a animação terminar
}

export function SplashScreen({ onAnimationEnd }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setIsVisible(false); 
      onAnimationEnd();    
    }, 5000); 

    return () => clearTimeout(timer); 
  }, [onAnimationEnd]);

  if (!isVisible) return null; 

  return (
    <div className="splash-container">
      <img src={PokedexLogo} alt="Pokedex Logo" className="splash-logo" />
      <h1 className="splash-title">Pokédex</h1>
    </div>
  );
}
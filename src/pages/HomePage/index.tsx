import { useState } from 'react';
import { PokemonList } from '../../components/PokemonList';
import { PokemonDetail } from '../../components/PokemonDetail';
import './Home.css';

export function HomePage() {
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const handlePokemonSelect = (name: string) => {
    setSelectedPokemon(name);
  };

  const handleGoBack = () => {
    setSelectedPokemon(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      {selectedPokemon ? (
        <>
          <button className="btn-page" onClick={handleGoBack}>Voltar</button>
          <PokemonDetail
            pokemonName={selectedPokemon}
            onSelectPokemon={handlePokemonSelect}
          />
        </>
      ) : (
        <PokemonList onPokemonSelect={handlePokemonSelect} />
      )}
    </div>
  );
}

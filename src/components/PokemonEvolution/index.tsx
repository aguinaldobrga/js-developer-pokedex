// src/components/PokemonEvolution.tsx
import './PokemonEvolution.css';
import type { Pokemon } from '../../interfaces/pokemon';

interface PokemonEvolutionProps {
  evolutions: Pokemon[];
  onExploreClick: () => void;
}

export function PokemonEvolution({ evolutions, onExploreClick }: PokemonEvolutionProps) {
  if (!evolutions || evolutions.length === 0) return null;

  return (
    <div className="pokemon-evolutions-container">
      <h3>Linha Evolutiva</h3>
      <div className="evolution-line">
        {evolutions.map((evo) => (
          <div key={evo.id} className="evolution-card">
            <img src={evo.sprites.front_default} alt={evo.name} />
            <p><strong>{evo.name}</strong> Nº {String(evo.id).padStart(3, '0')}</p>
            <p>Tipo: {evo.types.map(t => t.type.name).join(', ')}</p>
          </div>
        ))}
      </div>
      <button className="explore-button" onClick={onExploreClick}>
        Explorar mais Pokémon
      </button>
    </div>
  );
}

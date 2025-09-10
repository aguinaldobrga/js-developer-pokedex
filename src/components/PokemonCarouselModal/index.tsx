import { useState } from 'react';
import './PokemonCarouselModal.css';
import type { Pokemon } from '../../interfaces/pokemon';
import { PokemonCardComponent } from '../PokemonCard';

interface Props {
  pokemons: Pokemon[];
  onClose: () => void;
  onSelectPokemon: (name: string) => void;
}

export function PokemonCarouselModal({ pokemons, onClose, onSelectPokemon }: Props) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % pokemons.length);
  const prev = () => setIndex((prev) => (prev - 1 + pokemons.length) % pokemons.length);

  const current = pokemons[index];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="carousel">
          <button onClick={prev}>◀</button>
          <ul className="carousel-card">
            <PokemonCardComponent
              pokemon={{
                id: current.id,
                name: current.name,
                types: current.types,
                photo: current.sprites.front_default
              }}
              onClick={() => {
                onSelectPokemon(current.name);
                onClose(); // fecha o modal ao abrir os detalhes
              }}
            />
          </ul>
          <button onClick={next}>▶</button>
        </div>
      </div>
    </div>
  );
}

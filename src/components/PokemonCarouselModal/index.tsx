import './PokemonCarouselModal.css';
import type { Pokemon } from '../../interfaces/pokemon';
import { PokemonCardComponent } from '../PokemonCard';
import { useRef, useEffect } from 'react';

interface Props {
  pokemons: Pokemon[];
  onClose: () => void;
  onSelectPokemon: (name: string) => void;
}

export function PokemonCarouselModal({ pokemons, onClose, onSelectPokemon }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Clique e arraste
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.classList.add('dragging');
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove('dragging');
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove('dragging');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Scroll com setas
  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={scrollLeft}>◀</button>
          <div className="carousel-container" ref={carouselRef}>
            <ul className="carousel-track">
              {pokemons.map(pokemon => (
                <li key={pokemon.id} className="carousel-card">
                  <PokemonCardComponent
                    pokemon={{
                      id: pokemon.id,
                      name: pokemon.name,
                      types: pokemon.types,
                      photo: pokemon.sprites.front_default
                    }}
                    onClick={() => {
                      onSelectPokemon(pokemon.name);
                      onClose();
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <button className="carousel-arrow right" onClick={scrollRight}>▶</button>
        </div>
      </div>
    </div>
  );
}

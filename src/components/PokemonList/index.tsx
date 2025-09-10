import { useState, useEffect } from 'react';
import { PokemonCardComponent } from '../PokemonCard';
import { fetchPokemonList } from '../../services/pokeapi';
import type { PokemonCard } from '../../interfaces/pokemon-card';
import './PokemonList.css';

interface PokemonListProps {
  onPokemonSelect: (pokemonName: string) => void;
}

const POKEMON_LIMIT = 12;

export function PokemonList({ onPokemonSelect }: PokemonListProps) {
  const [pokemonList, setPokemonList] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const loadList = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPokemonList(POKEMON_LIMIT, offset);
        
        // Remove duplicatas por ID antes de adicionar à lista
        const uniqueNewPokemons = data.filter(
          (newPokemon, index, self) => 
            index === self.findIndex(t => t.id === newPokemon.id)
        );

        setPokemonList(prevList => {
          const combinedList = [...prevList, ...uniqueNewPokemons];
          // E também remove duplicatas da lista combinada, por segurança
          const finalUniqueList = combinedList.filter(
            (pokemon, index, self) => 
              index === self.findIndex(t => t.id === pokemon.id)
          );
          return finalUniqueList;
        });

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro desconhecido.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, [offset]);

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + POKEMON_LIMIT);
  };

  if (loading && offset === 0) return <p>Carregando lista...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <section className="content">
      <ol className="pokemons">
        {pokemonList.map(pokemon => (
            <PokemonCardComponent
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => onPokemonSelect(pokemon.name)}
            />
        ))}
      </ol>

      <div className="pagination">
        {loading ? (
            <p>Carregando mais...</p>
        ) : (
            <button id="loadMoreButton" type="button" onClick={handleLoadMore}>
                Load More
            </button>
        )}
      </div>
    </section>
  );
}
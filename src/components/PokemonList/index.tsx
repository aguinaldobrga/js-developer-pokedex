import { useState, useEffect } from 'react';
import { fetchPokemonList } from '../../services/pokeapi';

interface PokemonListProps {
  onPokemonSelect: (pokemonName: string) => void;
}

export function PokemonList({ onPokemonSelect }: PokemonListProps) {
  const [pokemonList, setPokemonList] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadList = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPokemonList();
        setPokemonList(data);
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
  }, []); // O array vazio garante que o useEffect rode apenas uma vez

  if (loading) return <p>Carregando lista...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h2>Lista de Pokémon</h2>
      <ul>
        {pokemonList.map(pokemon => (
          <li 
            key={pokemon.name} 
            onClick={() => onPokemonSelect(pokemon.name)} 
            style={{ cursor: 'pointer', textTransform: 'capitalize' }}
          >
            {pokemon.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
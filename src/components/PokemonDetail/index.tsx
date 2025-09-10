import { useState, useEffect } from 'react';
import type { Pokemon } from '../../interfaces/pokemon';
import { fetchPokemonByName } from '../../services/pokeapi';

interface PokemonDetailProps {
  pokemonName: string;
}

export function PokemonDetail({ pokemonName }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonName) {
      setLoading(false);
      return;
    }

    const loadPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchPokemonByName(pokemonName);
        setPokemon(data);

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

    loadPokemon();
  }, [pokemonName]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!pokemon) return <p>Nenhum Pokémon selecionado.</p>;

  return (
    <div>
      <h2>{pokemon.name}</h2>
      <p>ID: {pokemon.id}</p>
      <p>Peso: {pokemon.weight}</p>
      {pokemon.types.map(typeInfo => (
        <span key={typeInfo.slot}>{typeInfo.type.name}</span>
      ))}
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      {/* Continue renderizando o restante dos dados aqui */}
    </div>
  );
}
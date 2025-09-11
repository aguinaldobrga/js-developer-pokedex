import { useState, useEffect } from 'react';
import type { Pokemon, PokemonSpecies } from '../../interfaces/pokemon';
import { fetchFullPokemonDetails, fetchPokemonList } from '../../services/pokeapi';
import { PokemonEvolution } from '../../components/PokemonEvolution';
import { PokemonCarouselModal } from '../../components/PokemonCarouselModal';
import './PokemonDetail.css';

interface PokemonDetailProps {
  pokemonName: string;
  onSelectPokemon: (name: string) => void;
}

const EXTRA_POKEMON_LIMIT = 9;

export function PokemonDetail({ pokemonName, onSelectPokemon }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [evolutions, setEvolutions] = useState<Pokemon[]>([]);
  const [extraPokemons, setExtraPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (pokemonName) {
          const { details, species, weaknesses } = await fetchFullPokemonDetails(pokemonName);
          setPokemon(details);
          setSpecies(species);
          setWeaknesses(weaknesses);

          const evolutionNames: string[] = [];


          // Evoluções
          if (species?.evolution_chain?.url) {
            const response = await fetch(species.evolution_chain.url);
            const evolutionData = await response.json();

            let current = evolutionData.chain;
            while (current) {
              evolutionNames.push(current.species.name);
              current = current.evolves_to[0];
            }

            const evolutionDetails = await Promise.all(
              evolutionNames.map(name =>
                fetchFullPokemonDetails(name).then(res => res.details)
              )
            );

            setEvolutions(evolutionDetails);
          }

          // Pokémon extras
          const extraList = await fetchPokemonList(EXTRA_POKEMON_LIMIT, 0);
          const filtered = extraList.filter(p => !evolutionNames.includes(p.name));
          const extraDetails = await Promise.all(
            filtered.map(p =>
              fetchFullPokemonDetails(p.name).then(res => res.details)
            )
          );

          setExtraPokemons(extraDetails);
        } else {
          setPokemon(null);
          setSpecies(null);
          setWeaknesses([]);
          setEvolutions([]);
          setExtraPokemons([]);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [pokemonName]);

  if (loading) return <p>Carregando detalhes...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!pokemon || !species) return <p>Nenhum Pokémon selecionado.</p>;

  const flavorEntry = species.flavor_text_entries.find(
    entry => entry.language.name === 'pt'
  ) || species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );

  const flavorText = flavorEntry?.flavor_text
    .replace(/[\n\f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const malePercentage = species.gender_rate === -1 ? 'N/A' : (8 - species.gender_rate) * 12.5;
  const femalePercentage = species.gender_rate === -1 ? 'N/A' : species.gender_rate * 12.5;

  const combinedPokemons = [...evolutions, ...extraPokemons];

  return (
    <div className="pokemon-detail-container">
      <h2 className="pokemon-detail-header">
        {pokemon.name} Nº {String(pokemon.id).padStart(3, '0')}
      </h2>

      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-detail-photo"
      />

      {flavorText && <p className="pokemon-description">{flavorText}</p>}

      <div className="pokemon-stats-container">
        <h3>Estatísticas</h3>
        <ul className="pokemon-stats-list">
          {pokemon.stats.map(stat => (
            <li key={stat.stat.name}>
              <span>{stat.stat.name.toUpperCase()}</span>
              <span>{stat.base_stat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pokemon-info-container">
        <h3>Informações</h3>
        <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
        <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
        <p><strong>Sexo:</strong> Macho {malePercentage}% | Fêmea {femalePercentage}%</p>
        <p><strong>Tipo:</strong> {pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Fraquezas:</strong> {weaknesses.join(', ')}</p>
        <p><strong>Habilidades:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
        <p><strong>Grupos de Ovos:</strong> {species.egg_groups.map(group => group.name).join(', ')}</p>
      </div>

      <PokemonEvolution evolutions={evolutions} onExploreClick={() => setShowModal(true)} />

      {showModal && (
        <PokemonCarouselModal
          pokemons={combinedPokemons}
          onClose={() => setShowModal(false)}
          onSelectPokemon={(name) => {
            onSelectPokemon(name);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

import type { Pokemon, PokemonSpecies } from '../interfaces/pokemon';
import type { PokemonCard } from '../interfaces/pokemon-card';

const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon';

// Interfaces para os dados retornados pela API
interface PokemonListItem {
    name: string;
    url: string;
}

interface PokemonTypeData {
    damage_relations: {
        double_damage_from: { name: string; url: string; }[];
    };
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`${POKEMON_LIST_URL}/${name}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar o Pokémon.');
  }

  const data: Pokemon = await response.json();
  return data;
}

export async function fetchPokemonList(limit: number = 12, offset: number = 0): Promise<PokemonCard[]> {
    const response = await fetch(`${POKEMON_LIST_URL}?offset=${offset}&limit=${limit}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar a lista de Pokémon.');
    }

    const data = await response.json();
    const results: PokemonListItem[] = data.results;

    const pokemonPromises = results.map(pokemon => 
        fetchPokemonByName(pokemon.name)
    );

    const pokemonData = await Promise.all(pokemonPromises);
    
    return pokemonData.map((p: Pokemon) => ({
      id: p.id,
      name: p.name,
      photo: p.sprites.front_default,
      types: p.types,
    }));
}

export async function fetchFullPokemonDetails(name: string): Promise<{
  details: Pokemon;
  species: PokemonSpecies;
  weaknesses: string[];
}> {
  const [detailsResponse, speciesResponse] = await Promise.all([
    fetch(`${POKEMON_LIST_URL}/${name}`),
    // Corrigido: Usando a constante para a URL da espécie
    fetch(`${POKEMON_LIST_URL}-species/${name}`)
  ]);


  if (!detailsResponse.ok || !speciesResponse.ok) {
    throw new Error('Erro ao buscar os detalhes do Pokémon.');
  }

  const details: Pokemon = await detailsResponse.json();
  const species: PokemonSpecies = await speciesResponse.json();

  const weaknessesPromises = details.types.map(async (type) => {
    const typeResponse = await fetch(type.type.url);
    const typeData: PokemonTypeData = await typeResponse.json();
    return typeData.damage_relations.double_damage_from.map(weakness => weakness.name);
  });

  const weaknesses = (await Promise.all(weaknessesPromises)).flat();
  
  return { details, species, weaknesses };
}
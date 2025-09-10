// src/services/pokeapi.ts

import type { Pokemon } from '../interfaces/pokemon';

const API_BASE_URL = import.meta.env.VITE_POKEAPI_URL;
const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151'; // Limite para os 151 originais

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`${API_BASE_URL}/${name}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar o Pokémon.');
  }

  const data: Pokemon = await response.json();
  return data;
}

// Nova função para buscar a lista
export async function fetchPokemonList(): Promise<{ name: string; url: string }[]> {
  const response = await fetch(POKEMON_LIST_URL);

  if (!response.ok) {
    throw new Error('Erro ao buscar a lista de Pokémon.');
  }

  const data = await response.json();
  return data.results;
}
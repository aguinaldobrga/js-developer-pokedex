export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: {
    front_default: string;
  };
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

// Interfaces adicionais para os detalhes que você solicitou
export interface PokemonSpecies {
  gender_rate: number;
  egg_groups: { name: string; url: string; }[];
  flavor_text_entries: { flavor_text: string; language: { name: string; }; }[];
  evolution_chain: { url: string };
}

export interface PokemonEvolution {
  species_name: string;
  evolves_to: PokemonEvolution[];
}
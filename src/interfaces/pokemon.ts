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
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}
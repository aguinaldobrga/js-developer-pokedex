// src/interfaces/pokemon-card.ts

export interface PokemonCard {
    id: number;
    name: string;
    photo: string;
    types: {
      slot: number;
      type: {
        name: string;
      };
    }[];
}
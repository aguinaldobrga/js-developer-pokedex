
import { type PokemonCard } from '../../interfaces/pokemon-card';
import './PokemonCard.css';

interface PokemonCardProps {
    pokemon: PokemonCard;
    onClick: () => void;
}

export function PokemonCardComponent({ pokemon, onClick }: PokemonCardProps) {
    return (
        <li 
            className={`pokemon-card ${pokemon.types[0].type.name}`}
            onClick={onClick}
        >
            <span className="number">#{String(pokemon.id).padStart(3, '0')}</span>
            <span className="name">{pokemon.name}</span>

            <div className="detail">
                <ol className="types">
                    {pokemon.types.map(type => (
                        <li key={type.slot} className="type">{type.type.name}</li>
                    ))}
                </ol>

                <img 
                    src={pokemon.photo}
                    alt={pokemon.name}
                    className="photo"
                />
            </div>
        </li>
    );
}
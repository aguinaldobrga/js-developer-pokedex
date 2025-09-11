import './Footer.css';

export function Footer() {
    return (
        <footer className="footer-container">
            <p className="footer-text">
                &copy; {new Date().getFullYear()} Pokémon Pokedex. Todos os direitos reservados.
            </p>
            <p className="footer-text">
                Dados fornecidos pela <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokeAPI</a>.
            </p>
        </footer>
    );
}
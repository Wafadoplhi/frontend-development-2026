import { Pokemon } from "../types/Pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 w-80 text-center">
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="mx-auto w-32 h-32"
      />

      <h2 className="text-2xl font-bold capitalize mt-2">
        {pokemon.name}
      </h2>

      <p className="mt-2">
        <strong>Height:</strong> {pokemon.height}
      </p>

      <p>
        <strong>Weight:</strong> {pokemon.weight}
      </p>

      <p className="mt-2">
        <strong>Type:</strong>{" "}
        {pokemon.types.map((t) => t.type.name).join(", ")}
      </p>
    </div>
  );
};

export default PokemonCard;
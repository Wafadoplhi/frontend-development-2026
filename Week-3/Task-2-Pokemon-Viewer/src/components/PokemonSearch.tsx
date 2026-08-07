import { useState } from "react";
import { fetchPokemon } from "../services/pokemonApi";
import { Pokemon } from "../types/Pokemon";
import PokemonCard from "./PokemonCard";

const PokemonSearch = () => {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const data = await fetchPokemon(search);
      setPokemon(data);
      setError("");
    } catch {
      setPokemon(null);
      setError("Pokémon not found!");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Pokémon name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-64"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {pokemon && <PokemonCard pokemon={pokemon} />}
    </div>
  );
};

export default PokemonSearch;
import axios from "axios";
import { Pokemon } from "../types/Pokemon";

export const fetchPokemon = async (
  name: string
): Promise<Pokemon> => {
  const response = await axios.get<Pokemon>(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
  );

  return response.data;
};
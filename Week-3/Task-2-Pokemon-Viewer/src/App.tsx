import PokemonSearch from "./components/PokemonSearch";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-blue-700 mb-10">
        Pokémon Viewer
      </h1>

      <PokemonSearch />
    </div>
  );
}

export default App;
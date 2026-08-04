import { useState } from "react";
import { fetchGitHubUser } from "../services/githubApi";
import { User } from "../types/User";
import UserCard from "./UserCard";

function GitHubSearch() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const data = await fetchGitHubUser(username);
      setUser(data);
    } catch (error) {
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        GitHub User Search
      </h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-lg p-3 w-72"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-6">Loading...</p>}

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {user && <UserCard user={user} />}
    </div>
  );
}

export default GitHubSearch;
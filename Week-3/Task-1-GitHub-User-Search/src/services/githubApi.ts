import { User } from "../types/User";

export async function fetchGitHubUser(username: string): Promise<User> {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    throw new Error("User not found");
  }

  const data = await response.json();

  return data;
}
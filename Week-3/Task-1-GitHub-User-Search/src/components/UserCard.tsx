import { User } from "../types/User";

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 max-w-md w-full">
      <div className="flex flex-col items-center">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-28 h-28 rounded-full"
        />

        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>

        <p className="text-gray-500">@{user.login}</p>

        <p className="text-center mt-3">
          {user.bio || "No bio available"}
        </p>

        <div className="flex justify-between w-full mt-6">
          <div className="text-center">
            <p className="font-bold">{user.followers}</p>
            <p className="text-gray-500">Followers</p>
          </div>

          <div className="text-center">
            <p className="font-bold">{user.following}</p>
            <p className="text-gray-500">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
import { UserCircle } from "lucide-react";

function FriendList({ users, onlineUsers, goToChat }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-100">
        Your Friends:
      </h2>
      {users.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {users.map((user, index) => {
            const isOnline = onlineUsers.includes(user);

            return (
              <button
                key={index}
                onClick={() => goToChat(user)}
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition relative"
              >
                <div className="relative w-12 h-12">
                  <UserCircle className="w-full h-full text-white" />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-[3px] border-zinc-800 rounded-full"></span>
                  )}
                </div>
                <span className="text-white font-semibold text-lg">{user}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center">
          <p className="text-sm text-gray-400 font-bold italic">
            No friends yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default FriendList;

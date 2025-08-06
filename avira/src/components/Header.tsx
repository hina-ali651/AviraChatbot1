import { Sparkles, UserCircle, Menu } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  return (
    <header className="fixed top-0 left-0 w-full z-20 h-16 flex items-center px-4 sm:px-6 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 shadow-lg border-b border-gray-800 box-border">
      {/* Mobile/tablet menu icon */}
      <div className="flex sm:hidden absolute left-4 top-1/2 -translate-y-1/2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md bg-gray-800/80 hover:bg-gray-700 transition shadow-lg focus:outline-none"
          >
            <Menu className="w-7 h-7 text-white" />
          </button>
        )}
      </div>
      {/* Centered logo and app name on mobile/tablet, left on desktop */}
      <div className="flex-1 flex items-center justify-center sm:justify-start">
        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-lg animate-pulse flex-shrink-0" />
        <span className="ml-2 text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow block">
          Avira Chat
        </span>
      </div>
      {/* Right side login button (hidden on mobile/tablet) */}
      <div className="hidden sm:flex items-center ml-auto">
        {!session ? (
          <button
            className="px-4 py-2 rounded-xl bg-white text-pink-600 font-semibold shadow hover:bg-gray-100 transition-all flex items-center gap-2"
            onClick={() => signIn(undefined, { callbackUrl: "/" })}
          >
            <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            <span className="font-semibold">Login</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full border-2 border-pink-500 shadow"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-pink-500" />
            )}
            <span className="font-semibold text-white max-w-[120px] truncate">
              {session.user?.name || session.user?.email}
            </span>
            <button
              className="px-3 py-1 rounded-xl bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition-all"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

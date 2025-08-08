"use client";
import { getProviders, signIn } from "next-auth/react";
import type { ClientSafeProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  // Typed provider state to match getProviders return type
  const [
    providers,
    setProviders,
  ] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });
    if (res?.error) setError("Invalid email or password");
    else if (res?.ok) window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-pink-600 rounded-full p-3 shadow-lg mb-2 animate-bounce">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="#fff"
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
              />
              <path
                fill="#fff"
                d="M12 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 4.5c-2.21 0-4 1.57-4 3.5v.25A1.25 1.25 0 0 0 9.25 15h5.5A1.25 1.25 0 0 0 16 14.25v-.25c0-1.93-1.79-3.5-4-3.5Z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight drop-shadow mb-1">
            Sign in to{" "}
            <span className="text-pink-400">Avira</span>
          </h1>
          <p className="text-gray-300 text-sm">
            Welcome back! Please sign in to continue.
          </p>
        </div>
        <div className="space-y-4 w-full">
          {error && (
            <div className="text-red-400 text-sm mb-2 text-center">
              {error}
            </div>
          )}
          {providers &&
            Object.values(providers).map((provider) => {
              const typedProvider = provider as ClientSafeProvider;
              return typedProvider.id === "credentials" ? (
                <form
                  key="credentials"
                  className="flex flex-col gap-3"
                  onSubmit={handleCredentialsSignIn}
                >
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 rounded-xl shadow-lg transition"
                  >
                    Sign in with Email
                  </button>
                </form>
              ) : (
                <button
                  key={typedProvider.name as string}
                  onClick={() => signIn(typedProvider.id as string, { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-2 rounded-xl shadow-lg hover:bg-blue-50 transition border border-blue-200"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_17_40)">
                      <path
                        d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.12h13.008c-.56 3.016-2.24 5.576-4.768 7.288v6.04h7.712c4.52-4.164 7.1-10.292 7.1-17.744z"
                        fill="#4285F4"
                      />
                      <path
                        d="M24.48 48c6.48 0 11.92-2.148 15.888-5.84l-7.712-6.04c-2.148 1.44-4.892 2.288-8.176 2.288-6.28 0-11.6-4.24-13.512-9.944H2.56v6.24C6.52 43.44 14.04 48 24.48 48z"
                        fill="#34A853"
                      />
                      <path
                        d="M10.968 28.464A14.98 14.98 0 0 1 9.44 24c0-1.552.268-3.056.752-4.464v-6.24H2.56A23.98 23.98 0 0 0 0 24c0 3.872.92 7.544 2.56 10.704l8.408-6.24z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M24.48 9.56c3.528 0 6.656 1.216 9.136 3.6l6.84-6.84C36.392 2.148 30.96 0 24.48 0 14.04 0 6.52 4.56 2.56 11.056l8.408 6.24c1.912-5.704 7.232-9.944 13.512-9.944z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_17_40">
                        <path fill="#fff" d="M0 0h48v48H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                  Sign in with {typedProvider.name as string}
                </button>
              );
            })}
        </div>
      </div>
      <div className="mt-8 text-gray-400 text-xs text-center opacity-80">
        &copy; {new Date().getFullYear()} Avira Chat. All rights reserved.
      </div>
    </div>
  );
}

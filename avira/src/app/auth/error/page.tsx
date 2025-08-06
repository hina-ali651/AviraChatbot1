"use client";
export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="mb-4">Something went wrong with your login. Please try again.</p>
      <a href="/auth/signin" className="text-pink-500 underline">Back to Sign In</a>
    </div>
  );
}

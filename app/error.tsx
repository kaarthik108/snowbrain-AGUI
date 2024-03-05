"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Please Try again</button>
    </div>
  );
}

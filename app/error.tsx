'use client'


interface ErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-4">
      <h2 className="text-2xl font-semibold text-center">{error?.message}</h2>
      <button
        className="bg-blue-600 text-white font-medium text-[15px] py-2.5 px-6 rounded-md"
        onClick={reset}
      >
        Go back home
      </button>
    </div>
  );
}

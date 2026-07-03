"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {

  return (

    <main
      className="
        min-h-screen
        bg-[#F8F1EB]
        flex
        items-center
        justify-center
        px-6
      "
    >

      <div className="text-center max-w-md">

        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-[#A17F72]
          "
        >
          Connection Issue
        </span>

        <h1
          className="
            mt-6
            text-[58px]
            font-[family:var(--font-cormorant)]
            leading-[0.9]
            tracking-[-0.06em]
          "
        >
          Something
          Went Wrong
        </h1>

        <p
          className="
            mt-6
            text-[#8E7468]
          "
        >
          {error.message}
        </p>

        <button
          onClick={reset}
          className="
            mt-10
            h-[58px]
            px-10
            rounded-full
            bg-[#7A2E3A]
            text-white
          "
        >
          Try Again
        </button>

      </div>

    </main>

  );

}
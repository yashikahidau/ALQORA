"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {

  useEffect(() => {

    console.error(error);

  }, [error]);

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

      <div
        className="
          text-center
          max-w-[600px]
        "
      >

        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-[#A17F72]
          "
        >
          Unexpected Error
        </span>

        <h1
          className="
            mt-6
            text-[64px]
            md:text-[90px]
            leading-[0.85]
            tracking-[-0.08em]
            text-[#2D211D]
            font-[family:var(--font-cormorant)]
          "
        >
          Something
          Broke
        </h1>

        <p
          className="
            mt-6
            text-[#8E7468]
            leading-[2]
          "
        >
          We couldn't complete your request.
          Please try again.
        </p>

        <button
          onClick={() =>
            reset()
          }
          className="
            mt-10
            h-[58px]
            px-10
            rounded-full
            bg-[#7A2E3A]
            text-white
            uppercase
            tracking-[0.35em]
            text-[10px]
            transition-all
            duration-500
            hover:scale-[1.03]
          "
        >
          Try Again
        </button>

      </div>

    </main>

  );

}
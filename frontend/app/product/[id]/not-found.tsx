import Link from "next/link";

export default function ProductNotFound() {

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
          max-w-lg
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
          Product Not Found
        </span>

        <h1
          className="
            mt-6
            text-[70px]
            leading-[0.9]
            tracking-[-0.06em]
            text-[#2D211D]
            font-[family:var(--font-cormorant)]
          "
        >
          This Beauty
          Doesn't Exist
        </h1>

        <p
          className="
            mt-6
            text-[#8E7468]
            leading-[2]
          "
        >
          The product you're looking for
          may have been removed or never existed.
        </p>

        <Link
          href="/shop"
          className="
            inline-flex
            mt-10
            h-[58px]
            px-10
            items-center
            justify-center
            rounded-full
            bg-[#7A2E3A]
            text-white
            uppercase
            tracking-[0.35em]
            text-[10px]
          "
        >
          Back To Collection
        </Link>

      </div>

    </main>

  );

}
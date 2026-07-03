"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Script from "next/script";

export default function DashboardLayout({
children,
}: {
children: React.ReactNode;
}) {

const pathname = usePathname();

const navItems = [
{
name: "Overview",
href: "/dashboard",
},
{
name: "Orders",
href: "/dashboard/orders",
},
{
name: "Profile",
href: "/dashboard/profile",
},
];

const isActiveRoute = (
href: string
) => {


if (href === "/dashboard") {
  return pathname === href;
}

return pathname.startsWith(href);


};

return (


<ProtectedRoute>

  <main
    className="
      relative
      min-h-screen
      bg-[#F8F1EB]
      overflow-hidden
      pt-32
      pb-24
      px-6
      md:px-12
      lg:px-20
    "
  >

    {/* BLOBS */}

    <div
      className="
        absolute
        top-[-15%]
        right-[-5%]
        h-[500px]
        w-[500px]
        rounded-full
        bg-[#E8C9B8]/20
        blur-[140px]
      "
    />

    <div
      className="
        absolute
        bottom-[-10%]
        left-[-10%]
        h-[420px]
        w-[420px]
        rounded-full
        bg-[#7A2E3A]/[0.04]
        blur-[140px]
      "
    />

    <div
      className="
        relative
        z-10
        max-w-[1600px]
        mx-auto
      "
    >

      <div
        className="
          grid
          lg:grid-cols-[220px_1px_1fr]
          gap-10
          xl:gap-16
          items-start
        "
      >

        {/* SIDEBAR */}

        <aside >

          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.45em]
              text-[#A17F72]
            "
          >
            Dashboard
          </span>

          <nav
            className="
              mt-12
              flex
              flex-col
            "
          >

            {navItems.map((item) => {

              const active =
                isActiveRoute(
                  item.href
                );

              return (

                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    group
                    relative
                    py-5
                    pl-6
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    overflow-hidden
                  "
                >

                  {/* HOVER / ACTIVE LINE */}

                  <span
                    className={`
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2
                      transition-all
                      duration-300
                      bg-[#7A2E3A]

                      ${
                        active
                          ? "h-[70%] w-[2px]"
                          : "h-0 w-[2px] group-hover:h-[70%]"
                      }
                    `}
                  />

                  <span
                    className={`
                      transition-all
                      duration-500

                      ${
                        active
                          ? "text-[#7A2E3A]"
                          : "text-[#2D211D]/70 group-hover:text-[#2D211D]"
                      }
                    `}
                  >
                    {item.name}
                  </span>

                </Link>

              );

            })}

          </nav>

        </aside>

        {/* DIVIDER */}

        <div
          className="
            hidden
            lg:block
            self-stretch
            bg-[#DCCBC1]
          "
        />

        {/* CONTENT */}

        <section
          className="
            min-w-0
            lg:pl-8
          "
        >
          {children}
        </section>

      </div>

    </div>

  </main>

</ProtectedRoute>


);

}

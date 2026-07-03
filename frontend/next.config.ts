import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL;

let backendProtocol = "http";
let backendHost = "localhost";
let backendPort = "5000";

if (backendUrl) {
  const parsedUrl = new URL(backendUrl);
  backendProtocol = parsedUrl.protocol.replace(":", "");
  backendHost = parsedUrl.hostname;
  backendPort = parsedUrl.port || "";
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: backendProtocol as "http" | "https",
        hostname: backendHost,
        port: backendPort,
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
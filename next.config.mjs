/** @type {import('next').NextConfig} */
const gameApiBase = (
  process.env.GAMELLITO_APP_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  async rewrites() {
    return [
      {
        source: "/api/jogo/:path*",
        destination: `${gameApiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;


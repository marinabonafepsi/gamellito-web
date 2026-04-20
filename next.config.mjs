/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  images: { unoptimized: true },
  basePath: isGitHubPages ? "/gamellito-web" : "",
  assetPrefix: isGitHubPages ? "/gamellito-web/" : "",
};

export default nextConfig;

/** @type {import('next').NextConfig} */
// output: "export" foi removido para habilitar API routes e server components com cookies,
// necessários para o Supabase Auth (DIA-002). O deploy agora deve ser feito via Vercel
// (que suporta Next.js completo nativamente) em vez de GitHub Pages.
// O workflow .github/workflows/deploy.yml pode ser desativado ou mantido para outros fins.

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  images: { unoptimized: true },
};

export default nextConfig;

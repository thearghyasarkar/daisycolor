/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isPages ? "/daisycolor" : "",
  assetPrefix: isPages ? "/daisycolor/" : "",
  images: { unoptimized: true },
};

export default nextConfig;

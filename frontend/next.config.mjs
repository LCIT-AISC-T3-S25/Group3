/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_TRANSFORMER_API_URL: process.env.NEXT_PUBLIC_TRANSFORMER_API_URL,
    NEXT_PUBLIC_GAN_API_URL: process.env.NEXT_PUBLIC_GAN_API_URL,
    NEXT_PUBLIC_GLIDE_API_URL: process.env.NEXT_PUBLIC_GLIDE_API_URL,
    NEXT_PUBLIC_RAG_API_URL: process.env.NEXT_PUBLIC_RAG_API_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

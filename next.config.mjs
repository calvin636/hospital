/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    AGORA_APP_ID: process.env.AGORA_APP_ID,
  },
}

export default nextConfig

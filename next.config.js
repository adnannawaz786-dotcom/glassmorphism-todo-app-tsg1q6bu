/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false
  },
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/glassmorphism-todo-app' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/glassmorphism-todo-app' : '',
  env: {
    CUSTOM_KEY: 'glassmorphism-todo-app'
  }
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['lh3.googleusercontent.com'], // Add your image domains here
    },
    reactStrictMode: true,
    swcMinify: true, // Optional, if you want to use SWC for faster builds
  };
  
  module.exports = nextConfig;
  
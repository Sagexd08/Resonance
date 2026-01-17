// next.config.js for the Next.js frontend
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Enable experimental app directory if needed (Next 14 uses it by default)
    experimental: {
        appDir: true,
    },
};
module.exports = nextConfig;

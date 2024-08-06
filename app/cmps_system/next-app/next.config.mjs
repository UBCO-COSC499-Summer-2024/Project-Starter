/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ['special-barnacle-6r67v9q4w4xhx65p-3000.app.github.dev',"localhost:3000"],
        },
      }
};

export default nextConfig;

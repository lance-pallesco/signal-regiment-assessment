import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/projects",
        destination: "/api/projects",
      },
      {
        source: "/projects/:id*",
        destination: "/api/projects/:id*",
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      { source: "/studio.html", destination: "/workshop" },
      { source: "/workshop.html", destination: "/workshop" },
      { source: "/treasury.html", destination: "/treasury" },
      { source: "/commons.html", destination: "/codex" },
      { source: "/galaxy.html", destination: "/" },
      { source: "/index.html", destination: "/" },
      { source: "/you.html", destination: "/dashboard" },
      { source: "/soul-map.html", destination: "/vault" },
      { source: "/auth-callback.html", destination: "/login" },
    ];
  },
};

export default nextConfig;

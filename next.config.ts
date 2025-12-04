import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    WORKER_URL: process.env.WORKER_URL,
  },
}

export default nextConfig

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_NAVER_MAP_CLIENT_ID:
      process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID,
    NAVER_MAP_CLIENT_SECRET: process.env.NAVER_MAP_CLIENT_SECRET,
  },
};

export default nextConfig;

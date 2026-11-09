import type { NextConfig } from "next";
import { statSync } from "node:fs";
import path from "node:path";

const localApk = statSync(path.join(process.cwd(), "public/downloads/beefit.apk"), { throwIfNoEntry: false });
const hostedApkUrl = process.env.NEXT_PUBLIC_BEEFIT_APK_URL?.trim() || "";

if (hostedApkUrl && new URL(hostedApkUrl).protocol !== "https:") {
  throw new Error("NEXT_PUBLIC_BEEFIT_APK_URL must be a complete HTTPS download URL.");
}

const apkUrl = hostedApkUrl || (localApk?.isFile() && localApk.size > 0 ? "/downloads/beefit.apk" : "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BEEFIT_APK_URL: apkUrl,
  },
  async headers() {
    return [{
      source: "/downloads/beefit.apk",
      headers: [
        { key: "Content-Type", value: "application/vnd.android.package-archive" },
        { key: "Content-Disposition", value: 'attachment; filename="beefit.apk"' },
      ],
    }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/yuhonas/free-exercise-db@*/exercises/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

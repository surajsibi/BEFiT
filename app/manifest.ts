import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RepReady Workout Guide",
    short_name: "RepReady",
    description: "873 exercise guides with sub-muscle filters, form images, muscles worked and clear movement instructions.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f1e8",
    theme_color: "#171916",
  };
}

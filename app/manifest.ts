import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pure Motion Golf Academy",
    short_name: "Pure Motion Golf",
    description: "Book and manage golf coaching with Pure Motion Golf Academy.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3ef",
    theme_color: "#f36f31",
    icons: [
      {
        src: "/brand/pm-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

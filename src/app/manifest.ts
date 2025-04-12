//src/app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Life Ledger",
    short_name: "LifeLedger",
    description: "Life Ledger",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5c86a9",
    icons: [
      {
        src: "/lifeledger.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/lifeledger.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
}
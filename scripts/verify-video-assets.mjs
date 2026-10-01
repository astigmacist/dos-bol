import { stat } from "node:fs/promises";

const videos = [
  "public/videos/isolation.mp4",
  "public/videos/cyberbullying-teens.mp4",
  "public/videos/cyberculture.mp4",
];

for (const video of videos) {
  const info = await stat(video).catch(() => null);
  if (!info || !info.isFile() || info.size < 1_000_000) {
    throw new Error(`Required video asset is missing or incomplete: ${video}`);
  }
}

console.log(`Verified ${videos.length} video assets.`);

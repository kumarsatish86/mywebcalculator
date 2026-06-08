/**
 * Removes `.next` so the next dev/build starts from a clean cache.
 * Use when you see JSON.parse errors, 500s on random routes, or webpack ENOENT pack rename warnings.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const nextDir = path.join(root, ".next");

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  process.stdout.write(`Removed ${path.relative(root, nextDir)}\n`);
} else {
  process.stdout.write("No .next directory to remove.\n");
}

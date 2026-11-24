// Copies the web app (the folder above) into www/, which is what goes inside the iPhone app.
// Run it before every iPhone build: npm run sync
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");
const out = join(here, "www");
const files = [
  "index.html", "styles.css", "app.js", "data.js", "reader.js", "celebrate.js", "legal.js",
  "config.js", "native.js", "friends.js", "manifest.webmanifest", "feis.json", "feis-found.json"
];
const folders = ["icons", "vendor"];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of files) if (existsSync(join(site, f))) cpSync(join(site, f), join(out, f));
for (const d of folders) cpSync(join(site, d), join(out, d), { recursive: true });
console.log("Copied the web app into ios-app/www");

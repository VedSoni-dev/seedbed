// Serves the engine itself at /seedbed.js so anyone can drop it in with one script tag.
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public", { recursive: true });
copyFileSync("lib/seedbed.js", "public/seedbed.js");

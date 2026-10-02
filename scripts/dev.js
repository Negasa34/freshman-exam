import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const viteEntry = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const children = [
  spawn(process.execPath, ["server/api.js"], { cwd: root, stdio: "inherit", env: process.env }),
  spawn(process.execPath, [viteEntry, "--host", "127.0.0.1"], { cwd: root, stdio: "inherit", env: process.env }),
];
let shuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill();
  }
  process.exitCode = exitCode;
};

for (const child of children) {
  child.on("error", (error) => {
    console.error("Failed to start a development server:", error);
    shutdown(1);
  });
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (signal) {
      console.error(`A development server exited after ${signal}.`);
      shutdown(1);
    } else if (code !== 0) {
      console.error(`A development server exited with code ${code}.`);
      shutdown(code ?? 1);
    }
  });
}

process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());

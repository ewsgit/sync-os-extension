import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as fs from "fs";
import electron from "vite-electron-plugin";
import { customStart, loadViteEnv, } from "vite-electron-plugin/plugin";
import renderer from "vite-plugin-electron-renderer";
import { viteRequire } from "vite-require";

export default defineConfig(({ command }) => {
  fs.rmSync("dist-electron", { recursive: true, force: true });

  const sourcemap = command === "serve" || !!process.env.VSCODE_DEBUG;

  return {
    plugins: [
      react(),
      electron({
                 include: [ "electron" ],
                 transformOptions: {
                   treeShaking: true,
                   sourcemap: "inline",
                   logLevel: "verbose"
                 },
                 plugins: [
                   ...(!!process.env.VSCODE_DEBUG
                       ? [
                         customStart(
                             debounce(() => console.log("[startup] Electron App"))
                         ),
                       ]
                       : []),
                   loadViteEnv(),
                 ],
               }),
      renderer({ nodeIntegration: true }),
      viteRequire({dynamic: { loose: true }}),
    ],
    server: {
      port: 5002,
    },
    base: process.env.IS_DEV !== "true" ? "./" : "/",
    build: {
      outDir: "app/build",
    },
  };
});

function debounce<Fn extends (...args: any[]) => void>(
    fn: Fn,
    delay = 299
): Fn {
  let t: NodeJS.Timeout;
  return ((...args: Parameters<Fn>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  }) as Fn;
}

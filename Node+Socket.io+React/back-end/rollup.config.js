import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from "rollup-plugin-auto-external";

export default {
  input: "src/server.ts",
  output: {
    file: "build/bundle.cjs",
    format: "cjs",
    sourcemap: true,
    compact: true,
  },
  plugins: [
    typescript({ sourceMap: true }),
    json(),
    resolve(),
    commonjs(),
    autoExternal(),
  ],
};

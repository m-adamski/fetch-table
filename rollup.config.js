import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/table.bundle.js",
            format: "iife",
            name: "FetchTable"
        },
        {
            file: "dist/table.bundle.min.js",
            format: "iife",
            name: "FetchTable",
            plugins: [ terser() ]
        }
    ],
    plugins: [ typescript(), nodeResolve() ]
};

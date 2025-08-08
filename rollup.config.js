import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/table.bundle.js",
            format: "umd",
            name: "FetchTable"
        },
        {
            file: "dist/table.bundle.min.js",
            format: "umd",
            name: "FetchTable",
            plugins: [ terser() ]
        },
        {
            file: "dist/table.bundle.esm.js",
            format: "es",
        },
        {
            file: "dist/table.bundle.esm.min.js",
            format: "es",
            plugins: [ terser() ]
        },
    ],
    plugins: [ typescript(), nodeResolve() ]
};

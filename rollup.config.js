import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/table.bundle.js",
        format: "iife",
        name: "AjaxTable"
    },
    plugins: [ typescript(), nodeResolve() ]
};

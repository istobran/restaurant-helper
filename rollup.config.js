import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/main.js',
  plugins: [terser()],
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  watch: {
    include: 'src/**'
  }
};

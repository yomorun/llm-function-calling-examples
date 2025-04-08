export default {
  typescript: {
    rewritePaths: {
      "src/": "dist/"
    },
    compile: false,
  },
  // extensions: [
  //   "ts"
  // ],
  require: [
    "ts-node/register"
  ],
  files: [
    "**/*.test.ts"
  ],
  nodeArguments: [
    "--loader=ts-node/esm"
  ]
};
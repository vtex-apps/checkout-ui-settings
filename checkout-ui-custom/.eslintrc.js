module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jquery: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-param-reassign': 0,
    'max-len': ['error', { code: 1200 }], // TODO change to 120
    'object-curly-newline': 0,
    // TODO remove these after stable.
    'comma-dangle': 0,
    'comma-spacing': 0,
    'block-spacing': 0,
    'operator-linebreak': 0
  },
};

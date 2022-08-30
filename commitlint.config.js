const Configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'upper-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'BUILD' /* Changes that affect the build system or external dependencies (example scopes: yarn, docker, kubernetes) */,
        'CHORE',
        'CI' /* Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) */,
        'DOCS' /* Documentation only changes */,
        'FEAT' /* A new feature */,
        'FIX' /* A bug fix */,
        'PERF' /* A code change that improves performance */,
        'REFACTOR' /* A code change that neither fixes a bug nor adds a feature */,
        'REVERT',
        'STYLE' /* Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) */,
        'TEST' /* Adding missing tests or correcting existing tests */,
        'SECURITY',
        'WIP' /* Work in progress */,
      ],
    ],
  },
  helpUrl:
    'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
}

module.exports = Configuration

const path = require('path');

module.exports = {
  // Type check
  '**/*.(ts|tsx)': () => 'tsc --noEmit',

  // Lint
  '**/*.(ts|tsx|js)': (filenames) =>
    `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`,

  // Format
  '**/*.(ts|tsx|js|md|json)': (filenames) =>
    `prettier --write ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`,
};

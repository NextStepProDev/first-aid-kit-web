const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../../VERSION');
const outputFile = path.join(__dirname, '../src/version.ts');

try {
  const version = fs.readFileSync(versionFile, 'utf-8').trim();
  const content = `// Auto-generated from VERSION file - do not edit manually
export const APP_VERSION = '${version}';
`;

  fs.writeFileSync(outputFile, content);
  console.log(`✓ Generated version.ts with version ${version}`);
} catch (error) {
  console.error('Failed to generate version.ts:', error.message);
  const fallback = `// Auto-generated fallback
export const APP_VERSION = 'dev';
`;
  fs.writeFileSync(outputFile, fallback);
}

const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../../VERSION');
const versionTsFile = path.join(__dirname, '../src/version.ts');
const packageJsonFile = path.join(__dirname, '../package.json');

try {
  const version = fs.readFileSync(versionFile, 'utf-8').trim();
  
  // Generate version.ts
  const tsContent = `// Auto-generated from VERSION file - do not edit manually
export const APP_VERSION = '${version}';
`;
  fs.writeFileSync(versionTsFile, tsContent);
  
  // Update package.json version
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf-8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log(`✓ Generated version.ts and updated package.json with version ${version}`);
} catch (error) {
  console.error('Failed to generate version files:', error.message);
  const fallback = `// Auto-generated fallback
export const APP_VERSION = 'dev';
`;
  fs.writeFileSync(versionTsFile, fallback);
}

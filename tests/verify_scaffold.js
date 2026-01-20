const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '../kinkswipe');
const packageJsonPath = path.join(projectDir, 'package.json');
const appTsxPath = path.join(projectDir, 'src/App.tsx');

console.log('Verifying project scaffold...');

if (!fs.existsSync(projectDir)) {
  console.error('FAILED: Project directory kinkswipe does not exist.');
  process.exit(1);
}

if (!fs.existsSync(packageJsonPath)) {
  console.error('FAILED: package.json does not exist.');
  process.exit(1);
}

if (!fs.existsSync(appTsxPath)) {
  console.error('FAILED: src/App.tsx does not exist.');
  process.exit(1);
}

const packageJson = require(packageJsonPath);
if (!packageJson.dependencies && !packageJson.devDependencies) {
    console.error('FAILED: package.json does not contain dependencies.');
    process.exit(1);
}

console.log('PASSED: Project scaffold verified.');

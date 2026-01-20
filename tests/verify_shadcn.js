const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '../kinkswipe');
const componentsJsonPath = path.join(projectDir, 'components.json');
const utilsPath = path.join(projectDir, 'src/lib/utils.ts');
const tailwindConfigPath = path.join(projectDir, 'tailwind.config.js');
const indexCssPath = path.join(projectDir, 'src/index.css');
const packageJsonPath = path.join(projectDir, 'package.json');

console.log('Verifying shadcn/ui setup...');

// 1. Check components.json
if (!fs.existsSync(componentsJsonPath)) {
  console.error('FAILED: components.json does not exist.');
  process.exit(1);
}
const componentsJson = require(componentsJsonPath);
if (componentsJson.aliases.utils !== '@/lib/utils') {
    console.error('FAILED: components.json alias configuration is incorrect.');
    process.exit(1);
}

// 2. Check src/lib/utils.ts
if (!fs.existsSync(utilsPath)) {
  console.error('FAILED: src/lib/utils.ts does not exist.');
  process.exit(1);
}

// 3. Check tailwind.config.js content
const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
if (!tailwindConfig.includes('tailwindcss-animate')) {
  console.error('FAILED: tailwind.config.js does not include tailwindcss-animate plugin.');
  process.exit(1);
}

// 4. Check src/index.css content
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
if (!indexCss.includes('--background')) {
  console.error('FAILED: src/index.css does not include CSS variables.');
  process.exit(1);
}

// 5. Check dependencies
const packageJson = require(packageJsonPath);
const requiredDeps = ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react', 'tailwindcss-animate'];
const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length > 0) {
  console.error(`FAILED: Missing dependencies: ${missingDeps.join(', ')}`);
  process.exit(1);
}

console.log('PASSED: shadcn/ui setup verified.');

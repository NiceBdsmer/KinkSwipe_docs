const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '../kinkswipe');
const componentsDir = path.join(projectDir, 'src/components/ui');

const requiredComponents = [
  'button.tsx',
  'card.tsx',
  'dialog.tsx',
  'accordion.tsx',
  'tooltip.tsx',
  'progress.tsx',
  'select.tsx',
  'checkbox.tsx'
];

console.log('Verifying shadcn components...');

const missingComponents = requiredComponents.filter(comp => !fs.existsSync(path.join(componentsDir, comp)));

if (missingComponents.length > 0) {
  console.error(`FAILED: Missing components: ${missingComponents.join(', ')}`);
  process.exit(1);
}

console.log('PASSED: All required shadcn components found.');

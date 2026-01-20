import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

function runTest() {
  console.log('Verifying Tailwind CSS initialization...');
  
  // Check tailwind.config.js
  const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
  if (!fs.existsSync(tailwindConfigPath)) {
    console.error('FAIL: tailwind.config.js not found');
    process.exit(1);
  }
  
  const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf-8');
  if (!tailwindConfigContent.includes("darkMode: 'class'")) {
    console.error('FAIL: tailwind.config.js does not contain darkMode: "class"');
    process.exit(1);
  }
  
  // Check postcss.config.js
  const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
  if (!fs.existsSync(postcssConfigPath)) {
    console.error('FAIL: postcss.config.js not found');
    process.exit(1);
  }

  // Check src/index.css
  const indexCssPath = path.join(projectRoot, 'src', 'index.css');
  if (!fs.existsSync(indexCssPath)) {
    console.error('FAIL: src/index.css not found');
    process.exit(1);
  }
  
  const indexCssContent = fs.readFileSync(indexCssPath, 'utf-8');
  if (!indexCssContent.includes('@tailwind base') || 
      !indexCssContent.includes('@tailwind components') || 
      !indexCssContent.includes('@tailwind utilities')) {
    console.error('FAIL: src/index.css does not contain @tailwind directives');
    process.exit(1);
  }

  console.log('PASS: Tailwind CSS initialized correctly');
}

runTest();

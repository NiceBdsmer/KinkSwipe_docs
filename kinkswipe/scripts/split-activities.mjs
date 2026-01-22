import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, '../src/data/activities-en.ts');
const outputDir = path.join(__dirname, '../src/data/activities-en');

const content = fs.readFileSync(inputFile, 'utf-8');

const categories = {
  'basics': [],
  'bondage': [],
  'impact': [],
  'sensory': [],
  'power-exchange': [],
  'edge': [],
  'sexual': [],
  'fetishes': [],
  'humiliation': []
};

const activityRegex = /  \{[^]*?categoryId:\s*['"]([^'"]+)['"][^]*?\n  \},?/g;
let match;
let count = 0;

while ((match = activityRegex.exec(content)) !== null) {
  const catId = match[1];
  const activityCode = match[0];

  if (categories[catId]) {
    categories[catId].push(activityCode);
    count++;
  } else {
    console.warn('Unknown category:', catId);
  }
}

console.log(`Found ${count} activities total`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const [catId, activities] of Object.entries(categories)) {
  if (activities.length === 0) {
    console.log(`Warning: No activities found for ${catId}`);
    continue;
  }

  const activitiesList = activities
    .filter(a => a && a.trim().length > 0)
    .map(a => {
      let code = a.trim();
      if (code.endsWith(',')) {
        code = code.slice(0, -1);
      }
      return code;
    });

  const fileContent = `import type { ActivityDef } from '../../types';

export const activities: ActivityDef[] = [
${activitiesList.join(',\n\n')},
];
`;

  const outputFile = path.join(outputDir, `${catId}.ts`);
  fs.writeFileSync(outputFile, fileContent);
  console.log(`Created ${catId}.ts with ${activitiesList.length} activities`);
}

console.log('\nDone! Activity files created.');

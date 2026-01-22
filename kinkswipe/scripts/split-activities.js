const fs = require('fs');
const path = require('path');

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

const lines = content.split('\n');
let currentActivity = null;
let braceCount = 0;
let inArray = false;

for (const line of lines) {
  if (line.trim() === 'export const activitiesEn: ActivityDef[] = [') {
    inArray = true;
    continue;
  }

  if (!inArray) continue;

  if (line.match(/^  \{$/)) {
    if (braceCount === 0) {
      currentActivity = [line];
      braceCount = 1;
    } else {
      currentActivity.push(line);
      braceCount++;
    }
  } else if (currentActivity) {
    currentActivity.push(line);
    if (line.match(/^\},?$/) && braceCount === 1) {
      const activityCode = currentActivity.join('\n');
      const idMatch = activityCode.match(/categoryId: ['\"]([^'\"]+)['\"]/);

      if (idMatch) {
        const catId = idMatch[1];
        if (categories[catId]) {
          categories[catId].push(activityCode);
        } else {
          console.warn('Unknown category:', catId);
        }
      }

      currentActivity = null;
      braceCount = 0;
    } else if (line.match(/\{$/)) {
      braceCount++;
    } else if (line.match(/\}$/) && braceCount > 0) {
      braceCount--;
    }
  }
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const [catId, activities] of Object.entries(categories)) {
  if (activities.length === 0) {
    console.log(`Warning: No activities found for ${catId}`);
    continue;
  }

  const fileContent = `import type { ActivityDef } from '../../types';

export const activities: ActivityDef[] = [
${activities.join(',\n\n')},
];
`;

  const outputFile = path.join(outputDir, `${catId}.ts`);
  fs.writeFileSync(outputFile, fileContent);
  console.log(`Created ${catId}.ts with ${activities.length} activities`);
}

console.log('\\nDone! Activity files created.');

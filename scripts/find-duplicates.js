const fs = require('fs');
const content = fs.readFileSync('src/app/blog/[slug]/page.tsx', 'utf8');
const lines = content.split('\n');

const keyPattern = /^\s+'([a-z-]+)':\s*\{/;
const keys = {};

lines.forEach((line, index) => {
  const match = line.match(keyPattern);
  if (match) {
    const key = match[1];
    if (!keys[key]) {
      keys[key] = [];
    }
    keys[key].push(index + 1);
  }
});

const duplicates = Object.entries(keys).filter(([key, lines]) => lines.length > 1);

if (duplicates.length > 0) {
  console.log('중복된 키 발견:');
  duplicates.forEach(([key, lineNumbers]) => {
    console.log(`  ${key}: ${lineNumbers.join(', ')}`);
  });
} else {
  console.log('중복된 키 없음');
}


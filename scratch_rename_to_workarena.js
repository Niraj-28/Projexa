const fs = require('fs');
const path = require('path');

const targetDir = 'z:\\Projects\\WorkArea\\client';

const replacements = [
  { old: /Enclave/g, new: 'WorkArena' },
  { old: /WorkArea/g, new: 'WorkArena' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        processDir(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (['.jsx', '.js', '.css', '.html'].includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        for (const r of replacements) {
          if (r.old.test(content)) {
            r.old.lastIndex = 0; // reset
            content = content.replaceAll(r.old, r.new);
            changed = true;
          }
        }
        if (changed) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Renamed brand in: ${filePath}`);
        }
      }
    }
  }
}

// Also process client/index.html specifically if it isn't covered or to be safe
const indexHtmlPath = path.join(targetDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let content = fs.readFileSync(indexHtmlPath, 'utf8');
  let changed = false;
  for (const r of replacements) {
    if (r.old.test(content)) {
      r.old.lastIndex = 0;
      content = content.replaceAll(r.old, r.new);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(indexHtmlPath, content, 'utf8');
    console.log(`Renamed brand in: ${indexHtmlPath}`);
  }
}

console.log('Starting brand rename to WorkArena...');
processDir(targetDir);
console.log('Brand rename completed successfully!');

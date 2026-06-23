const fs = require('fs');
const path = require('path');

const targetDir = 'z:\\Projects\\WorkArea\\client';

const replacements = [
  // 1. Primary Brand Colors (Indigo to Steel Blue)
  { old: /#4f46e5/gi, new: '#124559' },
  
  // 2. Interactive Hovers (Indigo hover to Dark Teal)
  { old: /#4338ca/gi, new: '#01161E' },
  
  // 3. Primary Text and Headings (Slate 900 to Dark Teal)
  { old: /#0f172a/gi, new: '#01161E' },
  
  // 4. Secondary Label and Detail Texts (Slate 600 to Muted Blue)
  { old: /#475569/gi, new: '#598392' },
  
  // 5. Border Hover Highlights inside style constants
  { old: /borderHover:\s*"#94A3B8"/gi, new: 'borderHover: "#AEC3B0"' },
  { old: /borderHover:\s*"#94a3b8"/gi, new: 'borderHover: "#AEC3B0"' },

  // 6. Hover Menu / Row highlight states (Slate hover to Soft Sage hover)
  { old: /hover:bg-\[#F1F5F9\](\/20)?/gi, new: 'hover:bg-[#EFF6E0]/40' },
  { old: /hover:bg-\[#f1f5f9\](\/20)?/gi, new: 'hover:bg-[#EFF6E0]/40' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.gemini') {
        processDir(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (['.jsx', '.js', '.css', '.html'].includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        for (const r of replacements) {
          if (r.old.test(content)) {
            r.old.lastIndex = 0; // reset RegExp state
            content = content.replace(r.old, r.new);
            changed = true;
          }
        }
        if (changed) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated theme colors in: ${filePath}`);
        }
      }
    }
  }
}

console.log('Starting global theme migration to WorkArena Brand palette...');
processDir(targetDir);
console.log('Migration to WorkArena Brand completed successfully!');

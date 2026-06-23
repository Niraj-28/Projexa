import fs from 'fs';
import path from 'path';

const directory = './src';

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (stat.isFile() && (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css'))) {
      let content = fs.readFileSync(filePath, 'utf8');
      let replaced = false;

      // Replace bg-white with bg-[#124559] in specific button patterns
      if (content.includes('bg-white hover:bg-[#01161E] text-white')) {
        content = content.replace(/bg-white hover:bg-\[#01161E\] text-white/g, 'bg-[#124559] hover:bg-[#01161E] text-white');
        replaced = true;
      }
      
      // Also check any instances of indigo- remaining
      if (filePath.endsWith('AnalyticsView.jsx') && content.includes('bg-indigo-500/10 text-indigo-400 border border-indigo-500/20')) {
        content = content.replace('bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', 'bg-[#124559]/10 text-[#124559] border border-[#124559]/20');
        replaced = true;
      }

      if (replaced) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

walkDir(directory);
console.log('Theme fix completed.');

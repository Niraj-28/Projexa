const fs = require('fs');
const path = require('path');

const targetDir = 'z:\\Projects\\WorkArea\\client';

const replacements = [
  // 1. Sidebar Nav active links in DashboardLayout
  { old: /'bg-\[#CCD0CF\]\s+text-\[#F8FAFC\]\s+font-semibold'/gi, new: "'bg-[#4F46E5] text-white font-semibold'" },
  { old: /"bg-\[#CCD0CF\]\s+text-\[#F8FAFC\]\s+font-semibold"/gi, new: '"bg-[#4F46E5] text-white font-semibold"' },
  { old: /bg-\[#CCD0CF\]\s+text-\[#F8FAFC\]/gi, new: 'bg-[#4F46E5] text-white' },

  // 2. Navigation items hovers
  { old: /hover:bg-\[#FFFFFF\]/gi, new: 'hover:bg-[#F1F5F9]' },
  { old: /hover:bg-\[#ffffff\]/gi, new: 'hover:bg-[#F1F5F9]' },

  // 3. Workspace displays and shell panels
  { old: /bg-\[#FFFFFF\]\/40/gi, new: 'bg-[#F8FAFC]' },
  { old: /bg-\[#ffffff\]\/40/gi, new: 'bg-[#F8FAFC]' },
  { old: /bg-\[#0B0B0B\]/gi, new: 'bg-[#F8FAFC]' },
  { old: /bg-\[#0b0b0b\]/gi, new: 'bg-[#F8FAFC]' },

  // 4. Input borders: replacing white borders with soft Slate 200 gray
  { old: /border-\[#FFFFFF\]/gi, new: 'border-[#E2E8F0]' },
  { old: /border-\[#ffffff\]/gi, new: 'border-[#E2E8F0]' },
  { old: /border-t\s+border-\[#FFFFFF\]/gi, new: 'border-t border-[#E2E8F0]' },
  { old: /border-t\s+border-\[#ffffff\]/gi, new: 'border-t border-[#E2E8F0]' },
  { old: /border-b\s+border-\[#FFFFFF\]/gi, new: 'border-b border-[#E2E8F0]' },
  { old: /border-b\s+border-\[#ffffff\]/gi, new: 'border-b border-[#E2E8F0]' },
  { old: /border-y\s+border-\[#FFFFFF\]/gi, new: 'border-y border-[#E2E8F0]' },
  { old: /border-y\s+border-\[#ffffff\]/gi, new: 'border-y border-[#E2E8F0]' },

  // 5. Input focus highlights: replacing silver with Indigo
  { old: /focus:border-\[#9BA8B3\]/gi, new: 'focus:border-[#4F46E5]' },
  { old: /focus:border-\[#9ba8b3\]/gi, new: 'focus:border-[#4F46E5]' },

  // 6. UI icons, progress bars and SVG fills
  { old: /bg-\[#9BA8B3\]/gi, new: 'bg-[#4F46E5]' },
  { old: /bg-\[#9ba8b3\]/gi, new: 'bg-[#4F46E5]' },
  { old: /fill="\#9BA8B3"/gi, new: 'fill="#4F46E5"' },
  { old: /fill="\#9ba8b3"/gi, new: 'fill="#4F46E5"' },
  { old: /border-\[#9BA8B3\]/gi, new: 'border-[#4F46E5]' },
  { old: /border-\[#9ba8b3\]/gi, new: 'border-[#4F46E5]' },

  // 7. Landing Page Selection & Highlights
  { old: /selection:bg-\[#CCD0CF\]/gi, new: 'selection:bg-[#4F46E5]' },
  { old: /selection:text-\[#F8FAFC\]/gi, new: 'selection:text-[#FFFFFF]' },
  { old: /stopColor="\#CCD0CF"/gi, new: 'stopColor="#4F46E5"' },
  { old: /bg-\[#CCD0CF\]\s+text-\[#F8FAFC\]\s+hover:bg-white/gi, new: 'bg-[#4F46E5] text-white hover:bg-[#4338CA]' },
  
  // 8. Logo updates: let text use primary text (dark slate) instead of white in Light Sidebar/Footer
  { old: /Logo\s+light=\{true\}/gi, new: 'Logo light={false}' },
  
  // 9. Pricing professional plan highlighted card custom conversions
  { 
    old: /bg-\[#CCD0CF\]\s+text-\[#F8FAFC\]\s+border-2\s+border-\[#CCD0CF\]\s+rounded-\[20px\]/gi, 
    new: 'bg-[#4F46E5] text-white border-2 border-[#4F46E5] rounded-[20px]' 
  },
  { old: /text-\[#F8FAFC\]\/60/gi, new: 'text-indigo-200' },
  { old: /text-\[#F8FAFC\]/gi, new: 'text-white' },
  { old: /border-t\s+border-\[#F8FAFC\]\/10/gi, new: 'border-t border-white/20' },
  { old: /bg-\[#F8FAFC\]\s+text-\[#0F172A\]\s+hover:bg-\[\#FFFFFF\]/gi, new: 'bg-white text-[#4F46E5] hover:bg-slate-50' }
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
            content = content.replace(r.old, r.new);
            changed = true;
          }
        }
        if (changed) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Polished colors in: ${filePath}`);
        }
      }
    }
  }
}

console.log('Starting light theme polish and layout cleanup...');
processDir(targetDir);
console.log('Light theme polish completed successfully!');

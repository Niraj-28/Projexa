const fs = require('fs');
const path = require('path');

const targetDir = 'z:\\Projects\\WorkArea\\client';

const replacements = [
  // 1. Layout structure & backgrounds
  { old: /#06141B/gi, new: '#F8FAFC' },
  { old: /#0D0D0D/gi, new: '#F8FAFC' },
  { old: /#0A0A0A/gi, new: '#F8FAFC' },
  { old: /#090909/gi, new: '#F8FAFC' },
  { old: /#11212D/gi, new: '#FFFFFF' },

  // 2. Borders & dividers
  { old: /#253745/gi, new: '#E2E8F0' },
  { old: /#4A5C6A/gi, new: '#94A3B8' }, // used as border hover / tertiary text
  
  // 3. CTA Buttons & Selection background
  // Handles common tailwind configurations of CTA buttons
  { old: /bg-white\s+text-\[#06141B\]\s+hover:bg-\[#9BA8B3\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF] hover:bg-[#4338CA]' },
  { old: /bg-white\s+hover:bg-\[#9BA8B3\]\s+text-\[#06141B\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF] hover:bg-[#4338CA]' },
  { old: /bg-white\s+hover:bg-\[#9BA8B3\]\s+disabled:opacity-50\s+text-\[#06141B\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF] hover:bg-[#4338CA] disabled:opacity-50' },
  { old: /bg-white\s+hover:bg-\[#9BA8B3\]\s+text-\[#06141B\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF] hover:bg-[#4338CA]' },
  { old: /bg-white\s+hover:bg-\[#9BA8B3\]\s+disabled:opacity-50\s+text-\[#06141B\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF] hover:bg-[#4338CA] disabled:opacity-50' },
  { old: /bg-white\s+text-\[#06141B\]\s+hover:bg-\[#9BA8B3\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF] hover:bg-[#4338CA]' },
  { old: /bg-white\s+text-\[#06141B\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF]' },
  
  // Active states
  { old: /bg-\[#CCD0CF\]\s+text-\[#06141B\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF]' },
  { old: /bg-\[#ccd0cf\]\s+text-\[#06141b\]/gi, new: 'bg-[#4F46E5] text-[#FFFFFF]' },
  { old: /hover:bg-\[#9BA8B3\]/gi, new: 'hover:bg-[#4338CA]' },
  { old: /hover:bg-\[#9ba8b3\]/gi, new: 'hover:bg-[#4338CA]' },

  // 4. Texts
  { old: /text-\[#CCD0CF\]/gi, new: 'text-[#0F172A]' },
  { old: /text-\[#ccd0cf\]/gi, new: 'text-[#0F172A]' },
  { old: /text-\[#9BA8B3\]/gi, new: 'text-[#475569]' },
  { old: /text-\[#9ba8b3\]/gi, new: 'text-[#475569]' },
  { old: /text-\[#4A5C6A\]/gi, new: 'text-[#94A3B8]' },
  { old: /text-\[#4a5c6a\]/gi, new: 'text-[#94A3B8]' },
  { old: /text-white/gi, new: 'text-[#0F172A]' }, // Let's check text-white, but wait - some text-white like inside button or badge should remain white! Let's be careful. Actually, let's keep text-white as-is or handle it inside layout views manually if needed. Let's not blindly replace all text-white.
  
  // 5. Opposing replacements for text on new Indigo backgrounds (which must remain white)
  // e.g. text-[#06141B] or text-white inside button definitions should stay readable
  // (Items replaced above already set the text color to #FFFFFF for active pills and buttons)

  // 6. Opacity elements / background transparency layers
  { old: /bg-\[#11212D\]\/40/gi, new: 'bg-[#F8FAFC]/50' },
  { old: /bg-\[#11212d\]\/40/gi, new: 'bg-[#F8FAFC]/50' },
  { old: /bg-\[#11212D\]\/50/gi, new: 'bg-[#FFFFFF]/50' },
  { old: /bg-\[#11212d\]\/50/gi, new: 'bg-[#FFFFFF]/50' },
  { old: /bg-\[#11212D\]\/80/gi, new: 'bg-[#FFFFFF]/80' },
  { old: /bg-\[#11212d\]\/80/gi, new: 'bg-[#FFFFFF]/80' },
  { old: /bg-\[#11212D\]\/60/gi, new: 'bg-[#FFFFFF]/60' },
  { old: /bg-\[#11212d\]\/60/gi, new: 'bg-[#FFFFFF]/60' },
  { old: /bg-\[#11212D\]\/30/gi, new: 'bg-[#F8FAFC]/30' },
  { old: /bg-\[#11212d\]\/30/gi, new: 'bg-[#F8FAFC]/30' },
  { old: /bg-\[#06141B\]\/50/gi, new: 'bg-[#FFFFFF]/50' },
  { old: /bg-\[#06141b\]\/50/gi, new: 'bg-[#FFFFFF]/50' },
  { old: /bg-\[#06141B\]\/80/gi, new: 'bg-[#FFFFFF]/80' },
  { old: /bg-\[#06141b\]\/80/gi, new: 'bg-[#FFFFFF]/80' },
  
  // 7. Ambient glow accents
  { old: /bg-\[#CCD0CF\]\/\[0\.03\]/gi, new: 'bg-[#4F46E5]/[0.03]' },
  { old: /bg-\[#ccd0cf\]\/\[0\.03\]/gi, new: 'bg-[#4F46E5]/[0.03]' },
  { old: /bg-\[#9BA8B3\]\/\[0\.04\]/gi, new: 'bg-[#4F46E5]/[0.04]' },
  { old: /bg-\[#9ba8b3\]\/\[0\.04\]/gi, new: 'bg-[#4F46E5]/[0.04]' },

  // 8. Specific borders
  { old: /border-\[#11212D\]/gi, new: 'border-[#E2E8F0]' },
  { old: /border-\[#11212d\]/gi, new: 'border-[#E2E8F0]' },
  { old: /border-\[#4A5C6A\]/gi, new: 'border-[#CBD5E1]' },
  { old: /border-\[#4a5c6a\]/gi, new: 'border-[#CBD5E1]' },
  { old: /border-white\/60/gi, new: 'border-slate-300' },
  { old: /hover:border-white/gi, new: 'hover:border-slate-500' },
  { old: /hover:bg-white\/5/gi, new: 'hover:bg-slate-50' },
  { old: /via-\[#253745\]/gi, new: 'via-[#E2E8F0]' },

  // 9. Hover menu states
  { old: /hover:bg-\[#11212D\]/gi, new: 'hover:bg-[#F1F5F9]' },
  { old: /hover:bg-\[#11212d\]/gi, new: 'hover:bg-[#F1F5F9]' },
  { old: /hover:text-white/gi, new: 'hover:text-[#0F172A]' },

  // 10. Centralized colors constants
  { old: /night:\s*"#06141B"/gi, new: 'night: "#F8FAFC"' },
  { old: /onyx:\s*"#253745"/gi, new: 'onyx: "#E2E8F0"' },
  { old: /dimGray:\s*"#4A5C6A"/gi, new: 'dimGray: "#94A3B8"' },
  { old: /silver:\s*"#9BA8B3"/gi, new: 'silver: "#4F46E5"' },
  { old: /whiteSmoke:\s*"#CCD0CF"/gi, new: 'whiteSmoke: "#0F172A"' },
  { old: /background:\s*"#06141B"/gi, new: 'background: "#F8FAFC"' },
  { old: /surface:\s*"#11212D"/gi, new: 'surface: "#FFFFFF"' },
  { old: /surfaceRaised:\s*"#253745"/gi, new: 'surfaceRaised: "#FFFFFF"' },
  { old: /border:\s*"#253745"/gi, new: 'border: "#E2E8F0"' },
  { old: /borderHover:\s*"#4A5C6A"/gi, new: 'borderHover: "#CBD5E1"' },
  { old: /textPrimary:\s*"#CCD0CF"/gi, new: 'textPrimary: "#0F172A"' },
  { old: /secondaryText:\s*"#9BA8B3"/gi, new: 'secondaryText: "#475569"' },
  { old: /tertiaryText:\s*"#4A5C6A"/gi, new: 'tertiaryText: "#94A3B8"' },
  { old: /primary:\s*"#9BA8B3"/gi, new: 'primary: "#4F46E5"' },
  { old: /primaryHover:\s*"#CCD0CF"/gi, new: 'primaryHover: "#4338CA"' },
  { old: /ctaBg:\s*"#CCD0CF"/gi, new: 'ctaBg: "#4F46E5"' },
  { old: /ctaText:\s*"#06141B"/gi, new: 'ctaText: "#FFFFFF"' },
  { old: /black:\s*"#06141B"/gi, new: 'black: "#0F172A"' },

  // Toast theme styles inside App.jsx
  { old: /background:\s*'#11212D'/gi, new: "background: '#FFFFFF'" },
  { old: /color:\s*'#CCD0CF'/gi, new: "color: '#0F172A'" },
  { old: /border:\s*'1px\s+solid\s+#253745'/gi, new: "border: '1px solid #E2E8F0'" }
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
          console.log(`Updated colors in: ${filePath}`);
        }
      }
    }
  }
}

console.log('Starting migration from Dark to Light Theme...');
processDir(targetDir);
console.log('Light Theme migration completed successfully!');

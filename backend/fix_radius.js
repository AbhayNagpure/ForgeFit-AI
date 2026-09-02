const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace borderRadius: '12px' etc with 'var(--radius)'
      // But avoid 50% and 999px
      content = content.replace(/borderRadius:\s*'(\d+)px'/g, (match, p1) => {
        if (p1 === '50' && match.includes('%')) return match; // just in case
        if (p1 === '999') return match; // pill shape, maybe keep? The user wants consistency, maybe pills are okay, but I'll change pills to var(--radius) just to be strictly consistent, wait no, pills and circles should remain.
        return "borderRadius: 'var(--radius)'";
      });

      content = content.replace(/borderRadius:\s*'(\d+)px (\d+)px 0 0'/g, "borderRadius: 'var(--radius) var(--radius) 0 0'");

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, '../frontend/src/features'));
processDir(path.join(__dirname, '../frontend/src/components'));

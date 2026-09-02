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
      
      content = content.replace(/borderRadius:\s*'4px'/g, "borderRadius: 'var(--radius)'");
      content = content.replace(/borderRadius:\s*'2px'/g, "borderRadius: 'var(--radius-sm)'");

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, '../frontend/src/features'));
processDir(path.join(__dirname, '../frontend/src/components'));

const fs = require('fs');
const path = require('path');

const srcDir = 'D:\\project\\srijandev_platform_hub\\public';
const destDir = 'D:\\project\\stitch_security_field_force_manager (web portal)\\dist';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`Copying clean SrijanDev Platform Hub files from ${srcDir} -> ${destDir}...`);
copyRecursiveSync(srcDir, destDir);
console.log('✓ Dist folder synchronized successfully!');

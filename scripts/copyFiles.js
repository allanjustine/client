const fs = require('fs');
const path = require('path');

function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
  console.log(`Copied ${source} to ${destination}`);
}

// Paths relative to the project root
const buildDir = path.resolve(__dirname, '../build');
const indexHtml = path.resolve(buildDir, 'index.html');
const notFoundHtml = path.resolve(buildDir, '404.html');

copyFile(indexHtml, notFoundHtml);

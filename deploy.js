const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const buildPath = path.resolve(__dirname, 'build');

if (!fs.existsSync(buildPath)) {
  console.error('Error: build folder does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Create a temporary directory with a short path to avoid Windows path length issues
const tempDir = path.join(os.tmpdir(), 'gh-pages-deploy');
const tempBuildPath = path.join(tempDir, 'build');

console.log('Copying build files to temporary location...');

// Clean up temp directory if it exists
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Create temp directory and copy build folder
fs.mkdirSync(tempDir, { recursive: true });

// Copy files recursively (compatible with older Node versions)
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(buildPath, tempBuildPath);

// Add .nojekyll file for GitHub Pages
const nojekyllPath = path.join(tempBuildPath, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
}

console.log('Deploying to GitHub Pages...');

try {
  // Deploy from the temporary location
  // gh-pages needs to run from the git repo root, but point to temp build folder
  execSync(
    `npx gh-pages -d ${tempBuildPath} --no-history`,
    { stdio: 'inherit', shell: true }
  );
  
  
  console.log('\n✅ Deployment complete!');
  console.log('Your site should be live in a few minutes.');
  
  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('Temporary files cleaned up.');
} catch (error) {
  console.error('\n❌ Deployment failed.');
  // Clean up on error
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  process.exit(1);
}

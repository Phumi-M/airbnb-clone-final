const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const dateFnsSource = path.join(projectRoot, 'node_modules', 'date-fns');
const rdrNodeModules = path.join(projectRoot, 'node_modules', 'react-date-range', 'node_modules');
const dateFnsTarget = path.join(rdrNodeModules, 'date-fns');

if (!fs.existsSync(dateFnsSource)) {
  console.warn('ensure-date-fns: date-fns not found at', dateFnsSource);
  process.exit(0);
}

if (fs.existsSync(dateFnsTarget)) {
  process.exit(0);
}

fs.mkdirSync(rdrNodeModules, { recursive: true });

try {
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  const target = process.platform === 'win32' ? dateFnsSource : path.relative(rdrNodeModules, path.resolve(dateFnsSource));
  fs.symlinkSync(target, dateFnsTarget, type);
  console.log('ensure-date-fns: linked date-fns for react-date-range');
} catch (err) {
  console.warn('ensure-date-fns: symlink failed', err.message);
}

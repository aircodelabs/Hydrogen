const fs = require('fs');

const packageJson = {
  name: 'my-aircode-app',
  version: '0.0.0',
  private: true,
  scripts: {
    start: 'cross-env AC_FAAS_ROOT=functions AC_PORT=3000 aircode-run --init',
    test: 'echo "Error: no test specified" && exit 1',
  },
  dependencies: {
    hydrogen: '^5.0.0',
    'cross-env': '^7.0.3',
  }
};

const dirname = process.argv[2] || 'my-aircode-app';
if(!fs.existsSync(dirname)) {
  fs.mkdirSync(dirname);
}

fs.chdirSync(dirname);
if(!fs.existsSync('package.json')) {
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}

console.log('Created a new aircode app in ' + dirname);
console.log('To get started, run the following commands:');
console.log('  cd ' + dirname);
console.log('  npm install');
console.log('  npm start');

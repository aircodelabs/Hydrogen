const fs = require('node:fs');
const path = require('node:path');
const command = process.argv[2];

process.env.AC_FAAS_ROOT = process.env.AC_FAAS_ROOT || 'functions';
process.env.AC_PUBLIC_DIR = process.env.AC_PUBLIC_DIR || 'public';

const template = `// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

module.exports = async function (params, context) {
  console.log('Received params:', params);
  return {
    message: 'Hi, AirCode.',
  };
};
`;

if(command === '--init') {
  if(!fs.existsSync(process.env.AC_FAAS_ROOT)) {
    fs.mkdirSync(process.env.AC_FAAS_ROOT);
    const helloFile = path.join(process.env.AC_FAAS_ROOT, 'hello.js');
    fs.writeFileSync(helloFile, template);
  }
  if(!fs.existsSync(process.env.AC_PUBLIC_DIR)) {
    fs.mkdirSync(process.env.AC_PUBLIC_DIR);
  }
}

const {start, file} = require('../src/index.js');

const app = start();

if(fs.existsSync(file('hello.js'))) {
  require('open')(`http://localhost:${app.PORT}/hello`);
}

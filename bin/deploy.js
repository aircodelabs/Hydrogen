#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const root = path.resolve('.', process.env.AC_FAAS_ROOT);
const packageJSONPath = path.resolve('.', 'package.json');

const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath));

const dependencies = packageJSON.dependencies;
delete dependencies['@aircodelabs/hydrogen'];
dependencies['aircode'] = 'latest';

const destPackageJSONPath = path.resolve(root, 'package.json');
fs.writeFileSync(destPackageJSONPath, JSON.stringify({dependencies}, null, 2));

const isTypeScript = fs.existsSync(path.resolve('.', 'tsconfig.json'));

const defaultAircodeConfig = `{
  "name": "${packageJSON.name}",
  "runtime": "node/v16",
  "timeout": 60,
  "region": "US",
  "envs": [],
  "typescript": ${isTypeScript}
}`;
const aircodeConfigPath = path.resolve(root, 'aircode.config.json');
try {
  const read = JSON.parse(fs.readFileSync(aircodeConfigPath, 'utf-8'));
  const final = `{
  "name": "${read.name || packageJSON.name}",
  "runtime": "${read.runtime || 'node/v16'}",
  "timeout": ${read.timeout || 60},
  "region": "${read.region || 'US'}",
  "envs": ${read.envs || []},
  "typescript": ${read.typescript || isTypeScript}
}`;
  fs.writeFileSync(aircodeConfigPath, final);
} catch {
  fs.writeFileSync(aircodeConfigPath, defaultAircodeConfig);
}

if(packageJSON.repository && packageJSON.repository.type === 'git') {
  let repository = packageJSON.repository.url;
  if(repository.startsWith('git+')) {
    repository = repository.substring(4);
  }
  if(repository.startsWith('https://github.com/')) {
    repository = repository.replace('https://github.com/', '');
  }
  const parts = repository.split('/');
  const owner = parts[0];
  const repo = parts[1].replace('.git', '');
  const deployUrl = `https://aircode.io/dashboard?owner=${owner}&repo=${repo}&branch=main&path=${process.env.AC_FAAS_ROOT}&appname=${packageJSON.name}`;

  const readmeTpl = `# ${packageJSON.name}

${packageJSON.name} github repo deploy to [AirCode](https://aircode.io).

## One-Click Deployment

[![Deploy with AirCode](https://aircode.io/aircode-deploy-button.svg)](${deployUrl})
`;

  const readmePath = path.resolve(root, 'README.md');
  if(!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readmeTpl);
  }
}

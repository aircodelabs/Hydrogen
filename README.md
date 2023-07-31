# Hydrogen

<img width="168" alt="未标题-3" src="https://github.com/AirCodeLabs/Hydrogen/assets/316498/202f3b93-fd85-4708-9e77-54ed52223389">

The serverless framework creates web servers that can run anywhere.

## Features

- 🐇 Swift development with Hot Module Replacement (HMR) 🔥
- 📦 Supports CommonJS (.js .cjs), ES modules (.mjs), and TypeScript (.ts) functions out of the box.
- 🧸 Requires almost zero configurations.
- 🗄️ Comes with a built-in, ready-to-use text database and file API.
- 📁 Follows intuitive directory structure conventions.
- 🤏 Written in Pure JavaScript with a sleek and minimalist design.
- ⚡️ Optimized for runtime performance, regardless of development or production environments.
- 🧊 Compatible and capable of running your app seamlessly on the AirCode platform.

## Getting Started

1. Create an aircode app

```bash
npx create-aircode-app@latest my-aircode-app && cd my-aircode-app
```

2. Install dependencies and run

```bash
npm i && npm start
```

## Build Cloud Functions

You can easily build functions in `./functions` directory.

1. With `*.js` or `*.cjs`

```js
// myfun.js
const aircode = require('aircode');

module.exports = async function(params, context) {
  console.log('Received params:', params);
  return {
    message: 'Hi, AirCode.'
  };
}
```

2. Or with `*.mjs`

```js
import aircode from 'aircode';

export default async function (params, context) {
  console.log('Received params:', params);
  return {
    message: 'Hi, AirCode.',
  };
};
```

3. Or with `*.ts`

```js
import aircode from 'aircode';

export default async function (params: any, context: any) {
  console.log('Received params:', params);
  return {
    message: 'Hi, AirCode.',
  };
};
```

Simply visit your built functions with `http://localhost:3000/<your_func_name>`.

## Documentation

See [AirCode Docs](https://docs-cn.aircode.io/).

## Configurations

There are servial options that you can pass through process.env.

```js
process.env.AC_FAAS_ROOT = process.env.AC_FAAS_ROOT || 'functions';
process.env.AC_PUBLIC_DIR = process.env.AC_PUBLIC_DIR || 'public';
process.env.AC_PORT = process.env.AC_PORT || 3000;
```

## Integration

TBD...

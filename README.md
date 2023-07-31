# Hydrogen

A serverless framework create web servers that run anywhere. 

## Features

- 🐇 Rapid development with HMR 🔥
- 📦 Built-in support for CommonJS (.js .cjs), ES module (.mjs), and TypeScript (.ts) cloud functions.
- 🧸 Almost zero configurations.
- 🗄️ Built-in out-of-the-box text database and file API.
- 📁 Directory structure conventions.
- 🤏 Minimal design.
- 🧊 Compatible and capable of running swiftly on the AirCode platform.

## Setup

1. Create an aircode app

```bash
npx create-aircode-app@latest my-aircode-app
```

2. Install dependencies and run

```bash
npm i && npm start
```

## Documentation

See [AirCode Docs](https://docs-cn.aircode.io/).

## Configurations

```js
process.env.AC_FAAS_ROOT = process.env.AC_FAAS_ROOT || 'functions';
process.env.AC_PUBLIC_DIR = process.env.AC_PUBLIC_DIR || 'public';
process.env.AC_PORT = process.env.AC_PORT || 3000;
```

## Integration

TBD...

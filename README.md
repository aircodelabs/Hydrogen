# Hydrogen

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

There are servial options that you can pass through process.env.

```js
process.env.AC_FAAS_ROOT = process.env.AC_FAAS_ROOT || 'functions';
process.env.AC_PUBLIC_DIR = process.env.AC_PUBLIC_DIR || 'public';
process.env.AC_PORT = process.env.AC_PORT || 3000;
```

## Integration

TBD...

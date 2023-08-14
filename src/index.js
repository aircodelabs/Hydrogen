const path = require('node:path');
const fs = require('node:fs');
const Koa = require('koa');
const mime = require('mime');

const { koaBody } = require('koa-body');
const Logger = require('think-logger3');
const serve = require('koa-static');

const cookie = require('cookie');

const { build, file } = require('./faas-builder');

const logger = new Logger();

const _symbolReceviedTime = Symbol('request-received.startTime');

const app = new Koa();
app.use(async (ctx, next) => {
  logger.info(`<<< ${ctx.method} ${ctx.url}`);
  ctx[_symbolReceviedTime] = Date.now();
  await next();
});
app.use(koaBody({
  multipart: true,
  jsonLimit: '4.5mb',
  formLimit: '4.5mb',
  textLimit: '4.5mb',
  formidable: {
    maxFileSize: 4.5 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
  },
}));

if(fs.existsSync('./.aircoderc.js')) {
  require(path.resolve('.', '.aircoderc.js'));
}

process.env.AC_APP_ID = process.env.AC_APP_ID || 'aircode-hydrogen';
process.env.AC_MEMORY_SIZE = process.env.AC_MEMORY_SIZE || '1024';
process.env.AC_EXECUTION_TIMEOUT =process.env.AC_EXECUTION_TIMEOUT || 60;
process.env.AC_DEPLOYMENT_VERSION = -1;
process.env.AC_REGION = process.env.AC_REGION || 'local';
process.env.AC_NODE_JS_VERSION = process.version.match(/^v(\d+\.\d+)/)[1];
process.env.AC_FAAS_ROOT = process.env.AC_FAAS_ROOT || 'functions';
process.env.AC_PUBLIC_DIR = process.env.AC_PUBLIC_DIR || 'public';

build(process.env.AC_FAAS_ROOT);

const moduleAlias = require('module-alias');
moduleAlias.addAliases({
  'aircode': path.resolve(__dirname, 'runtime'),
});

require('aircode'); // for cache

function requireModule(faasname) {
  let module = faasname;
  if(!require.cache[module]) {
    module = `${faasname}.js`;
  }
  if(!require.cache[module]) {
    module = `${faasname}.cjs`;
  }
  try {
    let _module = require(module);
    if(typeof _module !== 'function' && typeof _module.default === 'function') {
      _module = _module.default;
    }
    return _module;
  } catch (ex) {
    return require.cache[module];
  }
}

// public dir
app.use(async (ctx, next) => {
  if(ctx.url.slice(1).startsWith(`${process.env.AC_PUBLIC_DIR}/`))
    await serve('.')(ctx, next);
  else
    await next();
});

// json/yaml/yml
if(process.env.AC_EXPOSE_CONFIG) {
  app.use(async (ctx, next) => {
    const ext = path.extname(ctx.url);

    if (['.json', '.yaml', '.yml'].includes(ext)) {
      logger.info(`response ${ext} file`);
      const faas = ctx.request.path.slice(1) || 'index';
      const filepath = file(faas);
      logger.info(`sendFile filepath: ${filepath}`);
      const mimetype = mime.getType(filepath);
      ctx.set('Content-type', mimetype);
      ctx.body = fs.readFileSync(filepath, 'utf-8');
      return;
    }

    next();
  });
}

// patch files to body
app.use(async (ctx, next) => {
  const files = ctx.request.files;
  if(files) {
    for(const [key, file] of Object.entries(files)) {
      ctx.request.body[key] = file;
      Object.defineProperties(file, {
        buffer: {
          get() {
            if(!this._buffer) {
              const filepath = this.filepath;
              this._buffer = fs.readFileSync(filepath);
            }
            return this._buffer;
          },
          enumerable: true,
        },
        name: {
          get() {
            return this.originalFilename;
          },
          enumerable: true,
        },
        type: {
          get() {
            return this.mimetype;
          },
          enumerable: true,
        },
      });
    }
  }
  await next();
});

// response
app.use(async (ctx, next) => {
  const {method} = ctx.request;
  const params = method === 'GET' ? ctx.request.query : ctx.request.body;
  const context = {
    headers: ctx.request.headers,
    method,
    query: ctx.request.query,
    tirgger: 'HTTP',
    set: (field, value) => ctx.set(field, value),
    remove: (field) => ctx.remove(field),
    status: (code) => {
      if(code) ctx.response.status = code;
      return ctx.response.status;
    },
    cookie: (name, value, options) => {
      ctx.cookies.set(name, value, options);
    },
    clearCookie: (name) => {
      ctx.cookies.set(name, '', { expires: new Date(1) });
    },
    url: ctx.request.url,
    path: ctx.request.path,
    host: ctx.request.host,
    protocal: ctx.protocol,
    req: ctx.request,
    res: ctx.response,
    cookies: cookie.parse(ctx.request.headers.cookie || ''),
  };
  const faas = ctx.request.path.slice(1) || 'index';
  // console.log(faas);
  if(faas && !faas.startsWith('.')) {
    const faasname = file(faas);
    try {
      let module = requireModule(faasname);
      if(typeof module !== 'function' && typeof module.default === 'function') {
        module = module.default;
      }
      if(typeof module === 'function') {
        try {
          ctx.body = await module(params, context);
        } catch(ex) {
          logger.error(ex);
        }
      }
    } catch (ex) {
      // do nothing
    }
  } else if(faas.startsWith('.files/')) {
    const filepath = file(faas);
    // console.log(filepath);
    if(fs.existsSync(filepath)) {
      const filestream = fs.createReadStream(filepath);
      // const filename = path.basename(filepath);
      // ctx.set('Content-disposition', 'attachment; filename=' + filename);
      const mimetype = mime.getType(filepath);
      ctx.set('Content-type', mimetype);
      ctx.body = filestream;
    } else {
      ctx.body = '404 Not Found File.';
    }
  } else {
    ctx.body = '404 Not Found.';
  }
  await next();
});

app.use(async (ctx) => {
  logger.info(`>>> ${ctx.method} ${ctx.url} ${ctx.response.status} ${Date.now() - ctx[_symbolReceviedTime]}ms`);
});

function start(port = process.env.AC_PORT || 3000) {
  app.listen(port);
  app.PORT = port;
  logger.info(`Server running at http://127.0.0.1:${port}`);
  logger.info(`Public root: `);
  logger.info(`FaaS root: ${process.env.AC_FAAS_ROOT}`);
  return app;
}

module.exports = {
  start,
  file,
};

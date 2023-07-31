const path = require('node:path');
const fs = require('node:fs');

const esbuild = require('esbuild');

const Logger = require('think-logger3');
const logger = new Logger();

const modules = new Set();

function moduleRequire(filepath) {
  modules.add(filepath);
  if(filepath.endsWith('.mjs')) {
    const outfile = filepath.replace(/\.mjs$/, '.cjs');
    if(fs.existsSync(outfile)) {
      throw new Error(`File ${outfile} already exists.`);
    }
    esbuild.buildSync({
      entryPoints: [filepath],
      bundle: true,
      platform: 'node',
      outfile,
      external: ['aircode', 'node:*'],
    });
    let ret = null;
    try {
      ret = require(outfile);
    } catch(ex) {
      logger.error(ex.message);
    } finally {
      fs.unlinkSync(outfile);
    }
    return ret;
  } else {
    return require(filepath);
  }
}

function clearRequireCache() {
  for(let module of modules) {
    if(module.endsWith('.mjs')) {
      module = module.replace(/\.mjs$/, '.cjs');
    }
    delete require.cache[module];
  }
}

function reloadAllModules() {
  for(const module of modules) {
    moduleRequire(module);
  }
}

module.exports = function(root = 'src') {
  const dir = path.resolve('.', root);
  const chokidar = require('chokidar');
  chokidar.watch(dir, {
    ignored: [/node_modules\//, /\.client\.(mjs|cjs|js|ts)$/],
  }).on('all', (event, filepath) => {
    if(filepath.endsWith('.js') || filepath.endsWith('.cjs') || filepath.endsWith('.mjs')) {
      if(event === 'add' || event === 'change') {
        try {
          if(modules.has(filepath)) {
            // reload all modules 
            clearRequireCache();
            reloadAllModules();
          } else {
            moduleRequire(filepath);
          }
        } catch (ex) {
          // console.error(ex);
        }
      } else if(event === 'unlink') {
        let modulePath = filepath;
        if(filepath.endsWith('.mjs')) {
          modulePath = filepath.replace(/\.mjs$/, '.cjs');
        }
        delete require.cache[modulePath];
      }
    }
  });
};

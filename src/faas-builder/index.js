const path = require('node:path');
const fs = require('node:fs');

const esbuild = require('esbuild');

const Logger = require('think-logger3');
const logger = new Logger();

const modules = new Set();

let isESMProject = false;
if(fs.existsSync('./package.json')) {
  const pkg = require(path.resolve('.', 'package.json'));
  isESMProject = pkg.type === 'module';
}

function isModule(filepath) {
  return filepath.endsWith('.mjs') || filepath.endsWith('.ts') || isESMProject && filepath.endsWith('.js');
}

function moduleRequire(filepath) {
  modules.add(filepath);
  if(isModule(filepath)) {
    const outfile = filepath.replace(/\.(mjs|ts|js)$/, '.cjs');
    if(fs.existsSync(outfile)) {
      throw new Error(`File ${outfile} already exists.`);
    }
    const options = {
      entryPoints: [filepath],
      bundle: true,
      platform: 'node',
      outfile,
      external: ['aircode', 'node:*'],
    };
    if(filepath.endsWith('.ts')) {
      options.loader = {
        '.ts': 'ts',
      };
      // const config = path.resolve('.', 'tsconfig.json');
      // if(fs.existsSync(config)) {
      //   options['tsconfig-raw'] = new Function(`return ${fs.readFileSync(config, 'utf-8')}`)();
      // }
    }
    esbuild.buildSync(options);
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
    if(isModule(module)) {
      module = module.replace(/\.(mjs|ts|js)$/, '.cjs');
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
    if(filepath.endsWith('.js') || filepath.endsWith('.cjs')
      || filepath.endsWith('.mjs') || filepath.endsWith('.ts')) {
      if(event === 'add' || event === 'change') {
        // logger.info(`[${event}] ${filepath}`);
        try {
          if(modules.has(filepath)) {
            // reload all modules 
            clearRequireCache();
            reloadAllModules();
          } else {
            moduleRequire(filepath);
          }
        } catch (ex) {
          // logger.error(ex.message);
          let modulePath = filepath;
          if(isModule(filepath)) {
            modulePath = filepath.replace(/\.(mjs|ts)$/, '.cjs');
          }
          require.cache[modulePath] = async () => {return {error: ex.message};};
        }
      } else if(event === 'unlink') {
        let modulePath = filepath;
        if(isModule(filepath)) {
          modulePath = filepath.replace(/\.(mjs|ts)$/, '.cjs');
        }
        delete require.cache[modulePath];
      }
    }
  });
};

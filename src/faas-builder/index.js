const path = require('node:path');
const fs = require('node:fs');

const esbuild = require('esbuild');

function moduleRequire(filepath) {
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
    const ret = require(outfile);
    fs.unlinkSync(outfile);
    return ret;
  } else {
    return require(filepath);
  }
}

module.exports = function(root = 'src') {
  const dir = path.resolve('.', root);
  const chokidar = require('chokidar');
  chokidar.watch(dir).on('all', (event, filepath) => {
    if(filepath.endsWith('.js') || filepath.endsWith('.cjs') || filepath.endsWith('.mjs')) {
      let modulePath = filepath;
      if(filepath.endsWith('.mjs')) {
        modulePath = filepath.replace(/\.mjs$/, '.cjs');
      }
      if(event === 'add' || event === 'change') {
        let tempModule;
        try {
          tempModule = require.cache[modulePath];
          delete require.cache[modulePath];
          moduleRequire(filepath);
        } catch (ex) {
          if(tempModule) {
            require.cache[modulePath] = tempModule;
          }
          console.error(ex);
        }
      } else if(event === 'unlink') {
        delete require.cache[modulePath];
      }
    }
  });
};

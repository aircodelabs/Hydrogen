const path = require('node:path');

module.exports = function(root = 'src') {
  const dir = path.resolve('.', root);
  const chokidar = require('chokidar');
  chokidar.watch(dir).on('all', (event, filepath) => {
    if(filepath.endsWith('.js') || filepath.endsWith('.cjs')) { 
      if(event === 'add' || event === 'change') {
        let tempModule;
        try {
          tempModule = require.cache[filepath];
          require(filepath);
          delete require.cache[filepath];
        } catch (ex) {
          if(tempModule) {
            require.cache[filepath] = tempModule;
          }
          console.error(ex);
        }
      } else if(event === 'unlink') {
        delete require.cache[filepath];
      }
    }
  });
};

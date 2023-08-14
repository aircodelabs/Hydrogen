const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL, fileURLToPath } = require('node:url');
const fetch = require('node-fetch');
const {generateID} = require('../utils');
const mime = require('mime');
const { file } = require('../faas-builder');

function randomString(length = 8) {
  return Math.random().toString(36).substring(2, length + 2);
}

function createFilePath(name, type) {
  const basedir = path.resolve('.', process.env.AC_FAAS_ROOT, '.files');
  const dir = generateID();
  const ext = mime.getExtension(type);
  const filename = name || `${randomString()}.${ext}`;
  
  return path.join(basedir, dir, filename);
}

module.exports = class {
  constructor(table) {
    this.table = table;
  }

  async upload(content, name = null, options = {}) {
    let filepath = createFilePath(name, options.type);
    const dir = path.dirname(filepath);
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if(typeof content === 'string') {
      fs.writeFileSync(filepath, content, { encoding: 'utf-8' });
    } else if(content instanceof Buffer) {
      fs.writeFileSync(filepath, content);
    } else if(content instanceof fs.ReadStream) {
      const filestream = fs.createWriteStream(filepath);
      content.pipe(filestream);
    } else if(content.url) {
      const res = await fetch(content.url);
      if(!name && !options.type) {
        const type = res.headers.get('content-type');
        const ext = mime.getExtension(type);
        filepath = path.resolve(dir, `${randomString()}.${ext}`);
      }
      const data = await res.buffer();
      fs.writeFileSync(filepath, data);
    }
    const relativePath = path.relative(path.resolve(process.env.AC_FAAS_ROOT), filepath);
    const url = pathToFileURL(path.join('/', relativePath)).toString().replace('file://', '');
    const additions = options.additions || {};
    const data = {
      url,
      name: path.basename(filepath),
      type: options.type || mime.getType(filepath),
      size: fs.statSync(filepath).size,
      ...additions,
    };

    return await this.table.save(data);
  }

  async download(condition, options = {}) {
    const type = options.dateType || 'string';
    const onProgress = options.onProgress;
    const fileRecord = await this.table.where(condition).findOne();

    if(fileRecord) {
      const filepath = file(fileRecord.url.slice(1));
      // console.log('filepath', filepath);
      
      const filestream = fs.createReadStream(filepath);
      const totalSize = fileRecord.size;
      let currentSize = 0;

      if(onProgress)  {
        filestream.on('data', (chunk) => {
          currentSize += chunk.length;
          const percentage = Math.round(currentSize / totalSize * 100);
          const remainSize = totalSize - currentSize;
          onProgress(percentage, remainSize);
        });
      }

      if(type === 'stream') {
        return filestream;
      } else if(type === 'string' || type === 'buffer') {
        return new Promise((resolve, reject) => {
          const chunks = [];
          filestream.on('data', (chunk) => chunks.push(chunk));
          filestream.on('end', () => resolve(type === 'string' ? Buffer.concat(chunks).toString('utf-8') : Buffer.concat(chunks)));
          filestream.on('error', (err) => reject(err));
        });
      }
    }
  }

  async delete(condition = {}) {
    const fileRecord = await this.table.where(condition).findOne();
    if(fileRecord) {
      let filepath = fileURLToPath(`file://${fileRecord.url}`);
      filepath = path.resolve(process.env.AC_FAAS_ROOT, filepath.slice(1));
      fs.unlinkSync(filepath);
      fs.rmSync(path.dirname(filepath), { recursive: true });
      return await this.table.where({_id: fileRecord._id}).delete();
    }
    return null;
  }
};
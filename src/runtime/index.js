const path = require('path');
const { OkeyDB } = require('okeydb');

const FileService = require('./file-service');

const db = new OkeyDB({
  root: path.join(process.env.AC_FAAS_ROOT, '.db'),
  meta: path.join(process.env.AC_FAAS_ROOT, '.meta'),
});

const files = new FileService(db.table('_files'));

module.exports = {
  db,
  files,
};

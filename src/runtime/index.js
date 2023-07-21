const path = require('path');
const AirDB = require('airdb-lite/dist/airdb-lite.cjs').default;

const FileService = require('./file-service');

const db = new AirDB({
  root: path.join(process.env.AC_FAAS_ROOT, '.db'),
  meta: path.join(process.env.AC_FAAS_ROOT, '.meta'),
});

const files = new FileService(db.table('_files'));

module.exports = {
  db,
  files,
};

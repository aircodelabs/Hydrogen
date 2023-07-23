const { randomUUID } = require('node:crypto');
const path = require('node:path');

function generateID() {
  return randomUUID({ disableEntropyCache: true });
}

function file(faas) {
  return path.resolve('.', process.env.AC_FAAS_ROOT, faas);
}

module.exports = {
  generateID,
  file,
};
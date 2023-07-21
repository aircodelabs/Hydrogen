const { randomUUID } = require('node:crypto');

function generateID() {
  return randomUUID({ disableEntropyCache: true });
}

module.exports = {
  generateID,
};
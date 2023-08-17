// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

module.exports = async function (params, context) {
  console.log('Received params:', params);
  throw new Error('def');
  return {
    message: 'Hi, AirCode. ~~',
  };
};

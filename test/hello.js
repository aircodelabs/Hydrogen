// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

module.exports = async function (params, context) {
  console.log('Received params:', params);
  // console.log(context);
  return {
    cookies: context.cookies,
    message: 'Hi, AirCode.',
  };
};

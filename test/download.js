const aircode = require('aircode');

module.exports = async (params, context) => {
  context.set('content-type', 'application/json');
  const file = await aircode.files.download(
    {url : '/.files/00d44100-0c3c-49b8-a747-24cecc8582fb/pp0i65qn.css'},
  );
  
  return {
    file,
  };
};

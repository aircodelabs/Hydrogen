const aircode = require('aircode');

module.exports = async (params, context) => {
  context.set('content-type', 'application/json');
  const _id = params._id;
  const res = await aircode.files.delete(
    {_id},
  );
  
  return {
    res,
  };
};

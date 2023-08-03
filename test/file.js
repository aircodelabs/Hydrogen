module.exports = async (params, context) => {
  context.set('content-type', 'application/json');
  console.log(params.myFile.buffer);
  // console.log(context.req.files);
  return {
    all: 423,
    params,
  };
};
module.exports = async (params, context) => {
  context.set('content-type', 'application/json');
  context.status(400);
  return {
    all: 423,
    params,
  };
};

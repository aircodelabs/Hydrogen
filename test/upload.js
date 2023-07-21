const aircode = require('aircode');

module.exports = async (params, context) => {
  context.set('content-type', 'application/json');
  const file = await aircode.files.upload(
    // 'Hello World',
    // 'hello.txt',
    {url : 'https://unpkg.com/highlight.js@11.8.0/styles/github.css'},
    null,
    {
      // type: 'text/plain',
      additions: {
        owner: 'Micheal'
      }
    }
  );
  
  return {
    file,
  };
};

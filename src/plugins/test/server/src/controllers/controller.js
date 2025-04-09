// src/plugins/test/server/src/controllers/controller.js
module.exports = {
  async hello(ctx) {
    ctx.send({ message: 'Hello from custom plugin!' });
  }
};

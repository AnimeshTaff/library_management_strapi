'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => ({
  
  async find(ctx) {
    const books = await strapi.entityService.findMany('api::book.book', {
      populate: { author: true } // Explicitly populate the author relation
    });

    const modifiedData = books.map(book => ({
      id: book.id,
      title: book.Title,
      author: book.author ? book.author.Name : null // Return only author name
    }));

    return { data: modifiedData };
  },

  async findOne(ctx) {
    const book = await strapi.entityService.findOne('api::book.book', ctx.params.id, {
      populate: { author: true }
    });

    if (!book) return ctx.notFound();

    const modifiedData = {
      id: book.id,
      title: book.Title,
      author: book.author ? book.author.Name : null
    };

    return { data: modifiedData };
  }

}));

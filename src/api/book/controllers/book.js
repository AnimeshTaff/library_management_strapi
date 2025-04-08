'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => ({

  // Get all books without author (supports locale)
  async booksOnly(ctx) {
    const locale = ctx.query.locale || 'en';
    const books = await strapi.entityService.findMany('api::book.book', {
      locale,
    });
    return ctx.send({ data: books });
  },

  // Get a single book by documentId (supports locale)
  async getBookById(ctx) {
    const { id } = ctx.params;
    const locale = ctx.query.locale || 'en';

    if (!id) {
      return ctx.badRequest('Document ID is required');
    }

    const book = await strapi.db.query('api::book.book').findOne({
      where: { documentId: id },
      populate: { author: true },
      locale,
    });

    if (!book) {
      return ctx.notFound('Book not found');
    }

    return ctx.send({ data: book });
  },

  // Get books with author and filters (supports locale)
  async booksWithAuthor(ctx) {
    const { query } = ctx.request;
    const locale = query.locale || 'en';
    const filters = {};

    if (query.title) {
      filters.Title = { $containsi: query.title };
    }

    if (query.rating) {
      filters.Rating = { $gte: Number(query.rating) };
    }

    if (query.priceMin && query.priceMax) {
      filters.Price = {
        $gte: Number(query.priceMin),
        $lte: Number(query.priceMax),
      };
    }

    if (query.authorName) {
      const author = await strapi.db.query('api::author.author').findOne({
        where: {
          name: {
            $containsi: query.authorName,
          },
        },
      });

      if (!author) {
        return ctx.send({ data: [] });
      }

      filters.author = author.id;
    }

    const books = await strapi.db.query('api::book.book').findMany({
      where: filters,
      populate: {
        author: {
          fields: ['name'],
        },
      },
      locale,
    });

    return ctx.send({ data: books });
  },

  // Create a new book
  async createBook(ctx) {
    try {
      const { Title, isbn, Published_date, Desc, Price, Rating, author, locale } = ctx.request.body;

      if (!Title || !isbn || !Published_date || !Desc || !Price || !Rating) {
        return ctx.badRequest("Missing required fields.");
      }

      const newBook = await strapi.entityService.create('api::book.book', {
        data: {
          Title,
          isbn,
          Published_date,
          Desc,
          Price,
          Rating,
          author,
          locale: locale || 'en',
        },
      });

      return ctx.send({ message: "Book created successfully", data: newBook });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Failed to create book");
    }
  },

  // Update a book by documentId
  async updateBook(ctx) {
    try {
      const { id } = ctx.params;
      const locale = ctx.query.locale || 'en';

      const book = await strapi.db.query('api::book.book').findOne({
        where: { documentId: id },
        locale,
      });

      if (!book) {
        return ctx.notFound("Book not found");
      }

      const updatedBook = await strapi.entityService.update('api::book.book', book.id, {
        data: ctx.request.body,
        locale,
      });

      return ctx.send({ data: updatedBook });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Failed to update book");
    }
  },

  // Delete a book by documentId
  async deleteBook(ctx) {
    try {
      const { id } = ctx.params;
      const locale = ctx.query.locale || 'en';

      const book = await strapi.db.query('api::book.book').findOne({
        where: { documentId: id },
        locale,
      });

      if (!book) {
        return ctx.notFound("Book not found");
      }

      const deletedBook = await strapi.entityService.delete('api::book.book', book.id, {
        locale,
      });

      return ctx.send({ message: "Book deleted successfully", data: deletedBook });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Failed to delete book");
    }
  }

}));

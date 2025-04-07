'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => ({

  // Get all books without author
  async booksOnly(ctx) {
    const books = await strapi.entityService.findMany('api::book.book');
    return ctx.send({ data: books });
  },

  // Get a single book by ID
  async getBookById(ctx) {
    const { id } = ctx.params;
    if (!id) {
      return ctx.badRequest('Book ID is required');
    }

    const book = await strapi.entityService.findOne('api::book.book', id, {
      populate: { author: true },
    });

    if (!book) {
      return ctx.notFound('Book not found');
    }

    return ctx.send({ data: book });
  },

  // Get books with author and filters
  async booksWithAuthor(ctx) {
    const { query } = ctx.request;

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
      filters.author = {
        name: {
          $eqi: query.authorName,
        },
      };
    }

    const books = await strapi.db.query('api::book.book').findMany({
      where: filters,
      populate: {
        author: {
          fields: ['name'],
        },
      },
    });

    return ctx.send({ data: books });
  },

  // Create a new book
  async createBook(ctx) {
    try {
      const { Title, isbn, Published_date, Desc, Price, Rating, author } = ctx.request.body;

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
        },
      });

      return ctx.send({ message: "Book created successfully", data: newBook });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Failed to create book");
    }
  },

  // Update a book
  async updateBook(ctx) {
    try {
      const { id } = ctx.params;

      const updatedBook = await strapi.entityService.update('api::book.book', id, {
        data: ctx.request.body,
      });

      return ctx.send({ data: updatedBook });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Failed to update book");
    }
  },

  // Delete a book
  async deleteBook(ctx) {
    try {
      const { id } = ctx.params;

      const deletedBook = await strapi.entityService.delete('api::book.book', id);

      return ctx.send({ message: "Book deleted successfully", data: deletedBook });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Failed to delete book");
    }
  }

}));

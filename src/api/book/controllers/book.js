'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => {
  return {
    // Fetch all books (without author)
    async booksOnly(ctx) {
      const books = await strapi.entityService.findMany('api::book.book');
      return ctx.send({ data: books });
    },

    // Fetch a single book by ID
    async getBookById(ctx) {
      const { id } = ctx.params;

      if (!id) {
        return ctx.badRequest('Book ID is required');
      }

      const book = await strapi.entityService.findOne('api::book.book', id);

      if (!book) {
        return ctx.notFound('Book not found');
      }

      return ctx.send({ data: book });
    },

    // Fetch books with author details
    async booksWithAuthor(ctx) {
      const books = await strapi.entityService.findMany('api::book.book', {
        populate: { author: true },
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
        return ctx.badRequest("Failed to create book", error);
      }
    },

    // Update book
    async updateBook(ctx) {
      try {
        const { id } = ctx.params;
        const updatedBook = await strapi.entityService.update('api::book.book', id, {
          data: ctx.request.body,
        });
        return ctx.send({ data: updatedBook });
      } catch (error) {
        return ctx.badRequest("Failed to update book", error);
      }
    },

    // Delete book
    async deleteBook(ctx) {
      try {
        const { id } = ctx.params;
        const deletedBook = await strapi.entityService.delete('api::book.book', id);
        return ctx.send({ message: "Book deleted successfully", data: deletedBook });
      } catch (error) {
        return ctx.badRequest("Failed to delete book", error);
      }
    },
  };
});

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => ({
  
  // ✅ Fetch only books (without author)
  async booksOnly(ctx) {
    const books = await strapi.entityService.findMany('api::book.book');
    return ctx.send({ data: books });
  },

  // ✅ Fetch books with author details
  async booksWithAuthor(ctx) {
    const books = await strapi.entityService.findMany('api::book.book', {
      populate: { author: true }
    });
    return ctx.send({ data: books });
  },

  // ✅ Create a new book
  async createBook(ctx) {
    try {
      const { Title, isbn, Published_date, Desc, Price, Rating, author } = ctx.request.body;

      // 🛑 Validate required fields
      if (!Title || !isbn || !Published_date || !Desc || !Price || !Rating) {
        return ctx.badRequest("Missing required fields.");
      }

      // ✅ Create book entry
      const newBook = await strapi.entityService.create('api::book.book', {
        data: {
          Title,
          isbn,
          Published_date,
          Desc,
          Price,
          Rating,
          author,
        }
      });

      return ctx.send({ message: "Book created successfully", data: newBook });

    } catch (error) {
      return ctx.badRequest("Failed to create book", error);
    }
  },

  // ✅ Update an existing book
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

  // ✅ Delete a book by ID
  async deleteBook(ctx) {
    try {
      const { id } = ctx.params;
      const deletedBook = await strapi.entityService.delete('api::book.book', id);
      return ctx.send({ message: "Book deleted successfully", data: deletedBook });
    } catch (error) {
      return ctx.badRequest("Failed to delete book", error);
    }
  }

}));

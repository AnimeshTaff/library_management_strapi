'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => ({
  // Get all books without author (supports locale)
  async getBooksByLocale(ctx) {
    const locale = ctx.query.locale || 'en';
    const books = await strapi.entityService.findMany('api::book.book', {
      locale,
    });
    return ctx.send({ data: books });
  },

  // Filter books by title, rating, price, and author
  async getBooksByFilter(ctx) {
    const { query } = ctx.request;
    const locale = query.locale || 'en';
    const filters = {};

    if (query.title) filters.Title = { $containsi: query.title };
    if (query.rating) filters.Rating = { $gte: Number(query.rating) };
    if (query.priceMin && query.priceMax) {
      filters.Price = {
        $gte: Number(query.priceMin),
        $lte: Number(query.priceMax),
      };
    }

    if (query.authorName) {
      const author = await strapi.db.query('api::author.author').findOne({
        where: { name: { $containsi: query.authorName } },
      });

      if (!author) return ctx.send({ data: [] });
      filters.author = author.id;
    }

    const books = await strapi.db.query('api::book.book').findMany({
      where: filters,
      populate: { author: true },
      locale,
    });

    return ctx.send({ data: books });
  },

  // Get books with pagination
  async getBooksByPagination(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query;
    const start = (page - 1) * pageSize;

    const books = await strapi.entityService.findMany('api::book.book', {
      start: Number(start),
      limit: Number(pageSize),
    });

    return ctx.send({ data: books });
  },

  // Get sorted books
  async getBooksBySort(ctx) {
    const { sort } = ctx.query;
    if (!sort) return ctx.badRequest("Sort query is required");

    const sortArray = Array.isArray(sort) ? sort : [sort];
    const books = await strapi.entityService.findMany('api::book.book', {
      sort: sortArray,
    });

    return ctx.send({ data: books });
  },

  // Get only selected fields
  async getBooksByFields(ctx) {
    const { fields } = ctx.query;
    if (!fields) return ctx.badRequest("Fields query is required");

    const fieldsArray = Array.isArray(fields) ? fields : [fields];
    const books = await strapi.entityService.findMany('api::book.book', {
      fields: fieldsArray,
    });

    return ctx.send({ data: books });
  },

  // Get single book by documentId
  async getBookById(ctx) {
    const { id } = ctx.params;
    const locale = ctx.query.locale || 'en';

    const book = await strapi.db.query('api::book.book').findOne({
      where: { documentId: id },
      populate: { author: true },
      locale,
    });

    if (!book) return ctx.notFound("Book not found");
    return ctx.send({ data: book });
  },

  // Create a new book
  async createBook(ctx) {
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

    return ctx.send({ message: "Book created", data: newBook });
  },

  // Update book by documentId
  async updateBookById(ctx) {
    const { id } = ctx.params;
    const locale = ctx.query.locale || 'en';

    const book = await strapi.db.query('api::book.book').findOne({
      where: { documentId: id },
      locale,
    });

    if (!book) return ctx.notFound("Book not found");

    const updated = await strapi.entityService.update('api::book.book', book.id, {
      data: ctx.request.body,
      locale,
    });

    return ctx.send({ data: updated });
  },

  // Delete book by documentId
  async deleteBookById(ctx) {
    const { id } = ctx.params;
    const locale = ctx.query.locale || 'en';

    const book = await strapi.db.query('api::book.book').findOne({
      where: { documentId: id },
      locale,
    });

    if (!book) return ctx.notFound("Book not found");

    const deleted = await strapi.entityService.delete('api::book.book', book.id);
    return ctx.send({ message: "Deleted", data: deleted });
  },

  // Get books with dynamic populate
  async getBooksWithPopulate(ctx) {
    const { populate } = ctx.query;

    const populateFields = {};
    if (populate) {
      const relations = populate.split(',');
      for (const rel of relations) {
        populateFields[rel.trim()] = true;
      }
    }

    const books = await strapi.entityService.findMany('api::book.book', {
      populate: populateFields,
    });

    return ctx.send({ data: books });
  },

  // Get books by status (published or draft)
  async getBooksByStatus(ctx) {
    const { status } = ctx.query;
    const locale = ctx.query.locale || 'en';

    let filters = {};
    if (status === 'published') {
      filters.publishedAt = { $notNull: true };
    } else if (status === 'draft') {
      filters.publishedAt = { $null: true };
    } else {
      return ctx.badRequest("Invalid status. Use 'published' or 'draft'.");
    }

    const books = await strapi.db.query('api::book.book').findMany({
      where: filters,
      populate: { author: true, categories: true },
      locale,
    });

    return ctx.send({ data: books });
  },
}));

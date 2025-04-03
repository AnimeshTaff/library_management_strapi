'use strict';

module.exports = {
  routes: [
    // ✅ GET All Books (Without Author)
    {
      method: "GET",
      path: "/books-only",
      handler: "book.booksOnly",
      config: {
        auth: false,
      },
    },

    // ✅ GET All Books (With Author)
    {
      method: "GET",
      path: "/books-with-author",
      handler: "book.booksWithAuthor",
      config: {
        auth: false,
      },
    },

    // ✅ CREATE a Book
    {
      method: "POST",
      path: "/books",
      handler: "book.createBook",
      config: {
        auth: false,
      },
    },

    // ✅ UPDATE a Book (By ID)
    {
      method: "PUT",
      path: "/books/:id",
      handler: "book.updateBook",
      config: {
        auth: false,
      },
    },

    // ✅ DELETE a Book (By ID)
    {
      method: "DELETE",
      path: "/books/:id",
      handler: "book.deleteBook",
      config: {
        auth: false,
      },
    },
  ],
};

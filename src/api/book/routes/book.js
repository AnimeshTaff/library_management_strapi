module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/books/by-locale',
      handler: 'book.getBooksByLocale',
    },
    {
      method: 'GET',
      path: '/books/by-filter',
      handler: 'book.getBooksByFilter',
    },
    {
      method: 'GET',
      path: '/books/by-pagination',
      handler: 'book.getBooksByPagination',
    },
    {
      method: 'GET',
      path: '/books/by-sort',
      handler: 'book.getBooksBySort',
    },
    {
      method: 'GET',
      path: '/books/by-fields',
      handler: 'book.getBooksByFields',
    },
    {
      method: 'GET',
      path: '/books/with-populate',
      handler: 'book.getBooksWithPopulate',
    },
    {
      method: 'GET',
      path: '/books/by-status',
      handler: 'book.getBooksByStatus',
    },
    {
      method: 'GET',
      path: '/books/:id',
      handler: 'book.getBookById',
    },
    {
      method: 'POST',
      path: '/books',
      handler: 'book.createBook',
    },
    {
      method: 'PUT',
      path: '/books/:id',
      handler: 'book.updateBookById',
    },
    {
      method: 'DELETE',
      path: '/books/:id',
      handler: 'book.deleteBookById',
    },
  ],
};

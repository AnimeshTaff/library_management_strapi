module.exports = {
  routes: [
    { method: 'GET', path: '/books/locale', handler: 'book.booksOnly' },
    { method: 'GET', path: '/books/filter', handler: 'book.filterBooks' },
    { method: 'GET', path: '/books/paginate', handler: 'book.paginatedBooks' },
    { method: 'GET', path: '/books/sort', handler: 'book.sortedBooks' },
    { method: 'GET', path: '/books/fields', handler: 'book.booksWithFields' },
    
    // ✅ Correct handler for populate-only
    { method: 'GET', path: '/books/populate', handler: 'book.booksWithPopulate' },

    { method: 'GET', path: '/books/:id', handler: 'book.getBookById' },
    { method: 'POST', path: '/books', handler: 'book.createBook' },
    { method: 'PUT', path: '/books/:id', handler: 'book.updateBook' },
    { method: 'DELETE', path: '/books/:id', handler: 'book.deleteBook' },
  ]
};

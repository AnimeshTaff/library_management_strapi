module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/books-only',
        handler: 'book.booksOnly',
      },
      {
        method: 'GET',
        path: '/books-only/:id', 
        handler: 'book.getBookById',
      },
      {
        method: 'GET',
        path: '/books-with-author',
        handler: 'book.booksWithAuthor',
      },
      {
        method: 'POST',
        path: '/books',
        handler: 'book.createBook',
      },
      {
        method: 'PUT',
        path: '/books/:id',
        handler: 'book.updateBook',
      },
      {
        method: 'DELETE',
        path: '/books/:id',
        handler: 'book.deleteBook',
      },
    ],
  };
  
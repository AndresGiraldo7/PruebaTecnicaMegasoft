package com.library.service;

import com.library.exception.BookNotFoundException;
import com.library.model.Book;
import java.math.BigDecimal;
import java.util.List;

public interface BookService {
    Book createBook(Book book);
    Book updateBook(Long id, Book book) throws BookNotFoundException;
    Book getBookById(Long id) throws BookNotFoundException;
    List<Book> getAllBooks();
    List<Book> findBooksByTitle(String titlePart);
    List<Book> findBooksByPriceRange(BigDecimal min, BigDecimal max);
    List<Book> findBooksByAuthor(String author);
    List<Book> getAllBooksSortedByPublicationDate();
    void deleteBook(Long id) throws BookNotFoundException;
}

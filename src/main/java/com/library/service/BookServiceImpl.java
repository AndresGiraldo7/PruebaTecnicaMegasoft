package com.library.service;

import com.library.dao.BookDAO;
import com.library.exception.BookNotFoundException;
import com.library.model.Book;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookServiceImpl implements BookService {
    
    private final BookDAO bookDAO;

    public BookServiceImpl(BookDAO bookDAO) {
        this.bookDAO = bookDAO;
    }

    @Override
    public Book createBook(Book book) {
        return bookDAO.save(book);
    }

    @Override
    public Book updateBook(Long id, Book book) throws BookNotFoundException {
        Book existing = getBookById(id);
        existing.setIsbn(book.getIsbn());
        existing.setTitle(book.getTitle());
        existing.setAuthor(book.getAuthor());
        existing.setCategory(book.getCategory());
        existing.setAvailable(book.isAvailable());
        existing.setPublicationDate(book.getPublicationDate());
        existing.setPrice(book.getPrice());
        return bookDAO.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public Book getBookById(Long id) throws BookNotFoundException {
        return bookDAO.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Book> getAllBooks() {
        return bookDAO.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Book> findBooksByTitle(String titlePart) {
        return bookDAO.findAll().stream()
                .filter(book -> book.getTitle().toLowerCase()
                        .contains(titlePart.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Book> findBooksByPriceRange(BigDecimal min, BigDecimal max) {
        return bookDAO.findAll().stream()
                .filter(book -> book.getPrice() != null)
                .filter(book -> book.getPrice().compareTo(min) >= 0 
                        && book.getPrice().compareTo(max) <= 0)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Book> findBooksByAuthor(String author) {
        return bookDAO.findAll().stream()
                .filter(book -> book.getAuthor().equalsIgnoreCase(author))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Book> getAllBooksSortedByPublicationDate() {
        return bookDAO.findAll().stream()
                .filter(book -> book.getPublicationDate() != null)
                .sorted(Comparator.comparing(Book::getPublicationDate).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBook(Long id) throws BookNotFoundException {
        if (!bookDAO.findById(id).isPresent()) {
            throw new BookNotFoundException("Book not found with id: " + id);
        }
        bookDAO.delete(id);
    }
}
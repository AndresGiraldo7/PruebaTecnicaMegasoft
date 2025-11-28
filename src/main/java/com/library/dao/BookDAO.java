package com.library.dao;

import com.library.model.Book;
import java.util.List;
import java.util.Optional;

public interface BookDAO {
    Book save(Book book);
    Optional<Book> findById(Long id);
    List<Book> findAll();
    void delete(Long id);
    boolean existsByIsbn(String isbn);
}

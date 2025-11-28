package com.library.dao;

import com.library.model.Book;
import org.springframework.stereotype.Repository;
import javax.persistence.*;
import java.util.List;
import java.util.Optional;

@Repository
public class BookDAOImpl implements BookDAO {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Book save(Book book) {
        if (book.getId() == null) {
            entityManager.persist(book);
            return book;
        } else {
            return entityManager.merge(book);
        }
    }

    @Override
    public Optional<Book> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Book.class, id));
    }

    @Override
    public List<Book> findAll() {
        return entityManager.createQuery("SELECT b FROM Book b", Book.class)
                .getResultList();
    }

    @Override
    public void delete(Long id) {
        findById(id).ifPresent(entityManager::remove);
    }

    @Override
    public boolean existsByIsbn(String isbn) {
        Long count = entityManager.createQuery(
            "SELECT COUNT(b) FROM Book b WHERE b.isbn = :isbn", Long.class)
            .setParameter("isbn", isbn)
            .getSingleResult();
        return count > 0;
    }
}
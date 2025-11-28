const API_URL = '/api/books';
let currentBooks = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadAllBooks();
});

function setupEventListeners() {
    // Formulario
    document.getElementById('book-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancel-btn').addEventListener('click', resetForm);

    // Tabs de búsqueda
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // Enter en campos de búsqueda
    document.getElementById('search-title')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByTitle();
    });
    document.getElementById('search-author')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByAuthor();
    });
}

function switchTab(tab) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Actualizar paneles
    document.querySelectorAll('.search-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`panel-${tab}`).classList.add('active');
}

// CRUD Operations
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('book-id').value;
    const book = {
        isbn: document.getElementById('isbn').value,
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        category: document.getElementById('category').value,
        publicationDate: document.getElementById('publication-date').value || null,
        price: document.getElementById('price').value ? parseFloat(document.getElementById('price').value) : null,
        available: document.getElementById('available').checked
    };

    try {
        if (bookId) {
            await updateBook(bookId, book);
        } else {
            await createBook(book);
        }
    } catch (error) {
        showNotification('Error al guardar el libro', 'error');
    }
}

async function createBook(book) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });

    if (response.ok) {
        showNotification('Libro creado exitosamente', 'success');
        resetForm();
        loadAllBooks();
    } else {
        throw new Error('Error creating book');
    }
}

async function updateBook(id, book) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });

    if (response.ok) {
        showNotification('Libro actualizado exitosamente', 'success');
        resetForm();
        loadAllBooks();
    } else {
        throw new Error('Error updating book');
    }
}

async function deleteBook(id) {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        showNotification('Libro eliminado exitosamente', 'success');
        loadAllBooks();
    } else {
        showNotification('Error al eliminar el libro', 'error');
    }
}

function editBook(book) {
    document.getElementById('form-title').textContent = 'Editar Libro';
    document.getElementById('book-id').value = book.id;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('category').value = book.category || '';
    document.getElementById('publication-date').value = book.publicationDate || '';
    document.getElementById('price').value = book.price || '';
    document.getElementById('available').checked = book.available;

    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('form-title').textContent = 'Crear Nuevo Libro';
    document.getElementById('available').checked = true;
}

// Search Operations
async function loadAllBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        showNotification('Error al cargar los libros', 'error');
    }
}

async function searchByTitle() {
    const query = document.getElementById('search-title').value.trim();
    if (!query) {
        showNotification('Ingresa un título para buscar', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search/title?q=${encodeURIComponent(query)}`);
        const books = await response.json();
        displayBooks(books);
        showNotification(`${books.length} libro(s) encontrado(s)`, 'info');
    } catch (error) {
        showNotification('Error en la búsqueda', 'error');
    }
}

async function searchByAuthor() {
    const author = document.getElementById('search-author').value.trim();
    if (!author) {
        showNotification('Ingresa un autor para buscar', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search/author?author=${encodeURIComponent(author)}`);
        const books = await response.json();
        displayBooks(books);
        showNotification(`${books.length} libro(s) encontrado(s)`, 'info');
    } catch (error) {
        showNotification('Error en la búsqueda', 'error');
    }
}

async function searchByPriceRange() {
    const min = document.getElementById('min-price').value;
    const max = document.getElementById('max-price').value;

    if (!min || !max) {
        showNotification('Ingresa el rango de precios completo', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search/price-range?min=${min}&max=${max}`);
        const books = await response.json();
        displayBooks(books);
        showNotification(`${books.length} libro(s) encontrado(s)`, 'info');
    } catch (error) {
        showNotification('Error en la búsqueda', 'error');
    }
}

async function loadSortedByDate() {
    try {
        const response = await fetch(`${API_URL}/sorted/publication-date`);
        const books = await response.json();
        displayBooks(books);
        showNotification('Libros ordenados por fecha de publicación', 'info');
    } catch (error) {
        showNotification('Error al ordenar', 'error');
    }
}

// Display Functions
function displayBooks(books) {
    currentBooks = books;
    const container = document.getElementById('books-container');
    document.getElementById('book-count').textContent = `(${books.length})`;

    if (books.length === 0) {
        container.innerHTML = '<p class="no-data">No se encontraron libros.</p>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-header">
                <h3>${book.title}</h3>
                <span class="badge ${book.available ? 'badge-success' : 'badge-danger'}">
                    ${book.available ? 'Disponible' : 'No disponible'}
                </span>
            </div>
            <div class="book-body">
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                ${book.category ? `<p><strong>Categoría:</strong> ${book.category}</p>` : ''}
                ${book.publicationDate ? `<p><strong>Publicación:</strong> ${formatDate(book.publicationDate)}</p>` : ''}
                ${book.price ? `<p><strong>Precio:</strong> $${book.price.toFixed(2)}</p>` : ''}
            </div>
            <div class="book-actions">
                <button class="btn btn-small btn-primary" onclick='editBook(${JSON.stringify(book)})'>
                    Editar
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteBook(${book.id})">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification notification-${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
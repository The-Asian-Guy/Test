$(document).ready(function () {
    // Search functionality for Home page
    $('#search-btn').on('click', function () {
        var query = $('#search-query').val().trim(); // Ensure the query is trimmed of spaces
        if (query) {
            searchBooks(query);
        } else {
            alert('Please enter a search term.');
        }
    });

    // Function to search for books from the Google Books API
    function searchBooks(query) {
        var url = 'https://www.googleapis.com/books/v1/volumes?q=' + query;

        // Clear previous results
        $('#results').empty();

        $.get(url, function (data) {
            if (data.items && data.items.length > 0) {
                // Loop through the book items and display them
                data.items.forEach(function (book) {
                    var bookHtml = `
                        <div class="book">
                            <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192'}" alt="${book.volumeInfo.title}">
                            <p><strong>${book.volumeInfo.title}</strong></p>
                            <button class="add-to-bookshelf" data-id="${book.id}">Add to Bookshelf</button>
                        </div>
                    `;
                    $('#results').append(bookHtml);
                });

                // Add book to bookshelf when the button is clicked
                $('.add-to-bookshelf').on('click', function () {
                    var bookId = $(this).data('id');
                    addBookToBookshelf(bookId);
                });
            } else {
                $('#results').append('<p>No books found. Try a different search.</p>');
            }
        }).fail(function () {
            alert('Error retrieving books. Please try again.');
        });
    }

    // Function to save book to My Bookshelf (local storage)
    function addBookToBookshelf(bookId) {
        var url = 'https://www.googleapis.com/books/v1/volumes/' + bookId;

        $.get(url, function (data) {
            var book = {
                id: data.id,
                title: data.volumeInfo.title,
                author: data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : 'Unknown',
                image: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192'
            };

            // Load the bookshelf from localStorage (or initialize it as an empty array)
            var bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];

            // Check if the book is already in the bookshelf
            var isBookInBookshelf = bookshelf.some(function (savedBook) {
                return savedBook.id === book.id;
            });

            if (!isBookInBookshelf) {
                bookshelf.push(book);
                localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
                alert('Book added to your bookshelf!');
            } else {
                alert('This book is already in your bookshelf.');
            }
        }).fail(function () {
            alert('Error retrieving book details. Please try again.');
        });
    }

    // Display saved books on My Bookshelf page
    if (window.location.pathname.includes('bookshelf.html')) {
        var bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
        if (bookshelf.length === 0) {
            $('#bookshelf').html('<p>Your bookshelf is empty. Add books from the Home page.</p>');
        } else {
            bookshelf.forEach(function (book) {
                var bookHtml = `
                    <div class="book">
                        <img src="${book.image}" alt="${book.title}">
                        <p><strong>${book.title}</strong><br>by ${book.author}</p>
                    </div>
                `;
                $('#bookshelf').append(bookHtml);
            });
        }
    }
});

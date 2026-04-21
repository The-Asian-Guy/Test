$(document).ready(function () {
    // Search functionality for Home page
    $('#search-btn').on('click', function () {
        var query = $('#search-query').val();
        if (query) {
            searchBooks(query);
        }
    });

    function searchBooks(query) {
        var url = 'https://www.googleapis.com/books/v1/volumes?q=' + query;

        $.get(url, function (data) {
            var results = data.items;
            $('#results').empty();
            results.forEach(function (book) {
                var bookHtml = `
                    <div class="book">
                        <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192'}" alt="${book.volumeInfo.title}">
                        <p><strong>${book.volumeInfo.title}</strong></p>
                        <button class="add-to-bookshelf" data-id="${book.id}">Add to Bookshelf</button>
                    </div>
                `;
                $('#results').append(bookHtml);
            });

            // Add book to bookshelf when button is clicked
            $('.add-to-bookshelf').on('click', function () {
                var bookId = $(this).data('id');
                addBookToBookshelf(bookId);
            });
        });
    }

    // Save book to My Bookshelf (local storage)
    function addBookToBookshelf(bookId) {
        var url = 'https://www.googleapis.com/books/v1/volumes/' + bookId;

        $.get(url, function (data) {
            var book = {
                id: data.id,
                title: data.volumeInfo.title,
                author: data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : 'Unknown',
                image: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192'
            };

            var bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
            bookshelf.push(book);
            localStorage.setItem('bookshelf', JSON.stringify(bookshelf));

            alert('Book added to your bookshelf!');
        });
    }

    // Display books on My Bookshelf page
    if (window.location.pathname.includes('bookshelf.html')) {
        var bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
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
});

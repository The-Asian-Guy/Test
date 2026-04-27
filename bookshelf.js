$(document).ready(function () {
    const bookIds = [
        'OebwAAAAMAAJ', // Example book ID 1
        'dXjl3rM6gQEC', // Example book ID 2
        'h5kG2ST_7AIC', // Example book ID 3
    ];

    function fetchBookDetails(bookId) {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

        $.get(apiUrl, function (data) {
            const book = data.volumeInfo;

            const bookLink = `bookDetails.html?id=${bookId}`;
            const bookCover = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x200';
            const title = book.title || 'No title available';
            const authors = book.authors ? book.authors.join(', ') : 'No authors available';

            $('#bookshelf').append(`
                <div class="book">
                    <a href="${bookLink}">
                        <img src="${bookCover}" alt="${title}" class="book-cover">
                        <h3>${title}</h3>
                        <p><strong>Authors:</strong> ${authors}</p>
                    </a>
                </div>
            `);
        }).fail(function () {
            $('#bookshelf').html('<p>There was an error fetching the bookshelf data. Please try again later.</p>');
        });
    }

    bookIds.forEach(bookId => fetchBookDetails(bookId));
});

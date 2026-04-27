$(document).ready(function () {
    // Get the book ID from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    // If no book ID is found, display an error message
    if (!bookId) {
        $('#book-info').html('<p>No book details found.</p>');
        return;
    }

    // Construct the API URL for the book details
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    // Fetch book details from Google Books API
    $.get(apiUrl, function (data) {
        const book = data.volumeInfo;

        // Book details
        const title = book.title || 'No title available';
        const authors = book.authors ? book.authors.join(', ') : 'No authors available';
        const description = book.description || 'No description available.';
        const coverImage = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x200';

        // Populate the page with book details
        $('#book-title').text(title);
        $('#book-authors').html(`<strong>Authors:</strong> ${authors}`);
        $('#book-description').html(`<strong>Description:</strong> ${description}`);
        $('#book-cover').attr('src', coverImage);
    }).fail(function () {
        $('#book-info').html('<p>Error fetching book details. Please try again later.</p>');
    });
});

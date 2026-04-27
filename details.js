$(document).ready(function () {
    // Get the book ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    // If no book ID is provided in the URL, display an error message
    if (!bookId) {
        $('#book-info').html('<p>No book details found.</p>');
        return;
    }

    // Construct the Google Books API URL
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    // Fetch book details using the Google Books API
    $.get(apiUrl, function (data) {
        const book = data.volumeInfo;

        // Book title
        const title = book.title || 'No title available';
        $('#book-title').text(title);

        // Book authors
        const authors = book.authors ? book.authors.join(', ') : 'No authors available';
        $('#book-authors').html(`<span class="book-details-label">Authors:</span> <span class="book-details-content">${authors}</span>`);

        // Book publisher
        const publisher = book.publisher || 'No publisher available';
        $('#book-publisher').html(`<span class="book-details-label">Publisher:</span> <span class="book-details-content">${publisher}</span>`);

        // Book description
        const description = book.description || 'No description available.';
        $('#book-description').html(`<span class="book-details-label">Description:</span> <span class="book-details-content">${description}</span>`);

        // Book cover image
        const coverImage = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x200';
        $('#book-cover').attr('src', coverImage);

        // Book price (if available)
        const price = book.saleInfo && book.saleInfo.listPrice ? book.saleInfo.listPrice.amount : null;
        if (price) {
            $('#book-price').html(`<span class="book-details-label">Price:</span> <span class="book-details-content">$${price}</span>`);
        } else {
            $('#book-price').hide();
        }
    }).fail(function () {
        $('#book-info').html('<p>Error fetching book details. Please try again later.</p>');
    });
});

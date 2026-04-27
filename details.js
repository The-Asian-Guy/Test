$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        $('#book-info').html('<p>No book details found.</p>');
        return;
    }

    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    $.get(apiUrl, function (data) {
        const book = data.volumeInfo;

        const title = book.title || 'No title available';
        const authors = book.authors ? book.authors.join(', ') : 'No authors available';
        const publisher = book.publisher || 'No publisher available';
        const description = book.description || 'No description available.';
        const coverImage = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x200';
        const price = book.saleInfo && book.saleInfo.listPrice ? book.saleInfo.listPrice.amount : null;

        $('#book-title').text(title);
        $('#book-authors').html(`<span class="book-details-label">Authors:</span> ${authors}`);
        $('#book-publisher').html(`<span class="book-details-label">Publisher:</span> ${publisher}`);
        $('#book-description').html(`<span class="book-details-label">Description:</span> ${description}`);
        $('#book-cover').attr('src', coverImage);

        if (price) {
            $('#book-price').html(`<span class="book-details-label">Price:</span> $${price}`);
        } else {
            $('#book-price').hide();
        }
    }).fail(function () {
        $('#book-info').html('<p>Error fetching book details. Please try again later.</p>');
    });
});

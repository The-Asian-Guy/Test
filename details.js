$(document).ready(function () {
    const bookId = new URLSearchParams(window.location.search).get('id');
    const apiBaseUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    $.getJSON(apiBaseUrl, function (data) {
        const book = data.volumeInfo;
        const bookDetailsDiv = $('#bookDetails');

        const detailsHtml = `
            <h1>${book.title}</h1>
            <h2>By ${book.authors?.join(', ')}</h2>
            <p><strong>Publisher:</strong> ${book.publisher}</p>
            <p><strong>Description:</strong> ${book.description}</p>
            <p><strong>Price:</strong> ${book.saleInfo?.listPrice?.amount || 'Not available'}</p>
            <img src="${book.imageLinks?.thumbnail}" alt="${book.title}" />
        `;
        
        bookDetailsDiv.html(detailsHtml);
    });
});

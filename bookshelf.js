$(document).ready(function () {
    const bookshelfId = 'YOUR_PUBLIC_SHELF_ID'; // Replace with your bookshelf ID
    const apiBaseUrl = `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${bookshelfId}/volumes`;

    $.getJSON(apiBaseUrl, function (data) {
        const bookshelfDiv = $('#bookshelf');
        bookshelfDiv.empty();

        data.items.forEach(item => {
            const book = item.volumeInfo;
            const bookDiv = $(`
                <div class="book">
                    <a href="bookDetails.html?id=${item.id}">
                        <img src="${book.imageLinks?.smallThumbnail}" alt="${book.title}" />
                        <h3>${book.title}</h3>
                    </a>
                </div>
            `);
            bookshelfDiv.append(bookDiv);
        });
    });
});

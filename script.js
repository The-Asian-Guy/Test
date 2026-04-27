$(document).ready(function () {
    let currentPage = 1;
    let totalPages = 1;

    // Handle search button click
    $('#search-button').click(function () {
        let query = $('#search-query').val();
        if (query) {
            searchBooks(query, currentPage);
        }
    });

    // Handle page change from dropdown
    $('#page-dropdown').change(function () {
        currentPage = parseInt($(this).val());
        $('#page-number').text(`Page: ${currentPage}`);
        searchBooks($('#search-query').val(), currentPage);
    });

    // Function to search books via Google Books API
    function searchBooks(query, page) {
        const maxResults = 10; // number of results per page
        const startIndex = (page - 1) * maxResults;

        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`;

        $.get(apiUrl, function (data) {
            totalPages = Math.ceil(data.totalItems / maxResults);
            $('#page-dropdown').empty();
            for (let i = 1; i <= totalPages; i++) {
                $('#page-dropdown').append(`<option value="${i}">${i}</option>`);
            }

            $('#book-results').empty();
            
            if (data.items) {
                data.items.forEach(item => {
                    const book = item.volumeInfo;
                    const bookLink = `book-details.html?id=${item.id}`;
                    const bookCover = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x200';
                    const title = book.title || 'No title available';
                    const authors = book.authors ? book.authors.join(', ') : 'No authors available';

                    $('#book-results').append(`
                        <div class="book">
                            <a href="${bookLink}">
                                <img src="${bookCover}" alt="${title}" class="book-cover">
                                <h3>${title}</h3>
                                <p>${authors}</p>
                            </a>
                        </div>
                    `);
                });
            } else {
                $('#book-results').html('<p>No results found.</p>');
            }
        });
    }
});

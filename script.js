$(document).ready(function () {
    const apiBaseUrl = 'https://www.googleapis.com/books/v1/volumes';
    
    $('#searchButton').click(function () {
        const query = $('#searchQuery').val().trim();
        if (query) {
            searchBooks(query, 1); // Start search with page 1
        }
    });

    function searchBooks(query, page) {
        const url = `${apiBaseUrl}?q=${encodeURIComponent(query)}&startIndex=${(page - 1) * 10}&maxResults=10`;
        
        $.getJSON(url, function (data) {
            displayResults(data);
            displayPagination(data, query);
        });
    }

    function displayResults(data) {
        const resultsDiv = $('#results');
        resultsDiv.empty();

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
            resultsDiv.append(bookDiv);
        });
    }

    function displayPagination(data, query) {
        const paginationDiv = $('#pagination');
        paginationDiv.empty();
        
        const totalItems = data.totalItems;
        const totalPages = Math.ceil(totalItems / 10);
        
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = $(`<button>${i}</button>`);
            pageLink.click(function () {
                searchBooks(query, i);
            });
            paginationDiv.append(pageLink);
        }
    }
});

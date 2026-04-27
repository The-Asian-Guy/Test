$(document).ready(function () {
    let currentPage = 1;  // Track the current page
    const maxResults = 10;  // Number of results per page
    let totalPages = 1;  // Total pages (based on total items from API)

    // Handle Search button click
    $('#search-button').click(function () {
        const query = $('#search-query').val();
        if (query) {
            currentPage = 1; // Reset to the first page on new search
            searchBooks(query, currentPage);
        }
    });

    // Handle page change (via dropdown selection)
    $('#page-dropdown').change(function () {
        currentPage = parseInt($(this).val(), 10);
        searchBooks($('#search-query').val(), currentPage);
    });

    // Function to search books using the Google Books API
    function searchBooks(query, page) {
        const startIndex = (page - 1) * maxResults;
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`;

        $.get(apiUrl, function (data) {
            totalPages = Math.ceil(data.totalItems / maxResults);
            updatePageDropdown();

            $('#book-results').empty();  // Clear previous results

            if (data.items) {
                // Display the search results
                data.items.forEach(item => {
                    const book = item.volumeInfo;
                    const bookLink = `book-details.html?id=${item.id}`;
                    const bookCover = book.imageLinks ? book.imageLinks.smallThumbnail : 'https://via.placeholder.com/128x200';
                    const title = book.title || 'No title available';

                    $('#book-results').append(`
                        <div class="book">
                            <a href="${bookLink}">
                                <img src="${bookCover}" alt="${title}" class="book-cover">
                                <h3>${title}</h3>
                            </a>
                        </div>
                    `);
                });
            } else {
                $('#book-results').html('<p>No results found.</p>');
            }
        });
    }

    // Function to update the page dropdown options based on total pages
    function updatePageDropdown() {
        const $dropdown = $('#page-dropdown');
        $dropdown.empty();  // Clear any existing options

        // Add options for each page
        for (let i = 1; i <= totalPages; i++) {
            $dropdown.append(new Option(`Page ${i}`, i));
        }

        // Set the current page as selected
        $dropdown.val(currentPage);
    }
});

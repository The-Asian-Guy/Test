const apiKey = "ce8cc57d5a729929765f42f9ebcfbc1c";
const baseUrl = "https://api.themoviedb.org/3";
const imageBase = "https://image.tmdb.org/t/p/w200";

let currentSearchResults = [];
let currentPage = 1;
const itemsPerPage = 10;

// ---------- Search Functionality ----------
$('#search-btn').click(function() {
    const query = $('#search-input').val().trim();
    if(query === "") return;

    $.getJSON(`${baseUrl}/search/movie`, { api_key: apiKey, query: query, page: 1 }, function(data) {
        currentSearchResults = data.results.slice(0, 50); // first 50 results
        currentPage = 1;
        renderResults(currentSearchResults, currentPage, '#search-results');
        renderPagination(currentSearchResults.length, currentPage);
    });
});

// ---------- Render Results ----------
function renderResults(results, page, container) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = results.slice(start, end);

    const html = pageItems.map(movie => `
        <div class="movie-item" data-id="${movie.id}">
            <img src="${movie.poster_path ? imageBase + movie.poster_path : ''}" alt="${movie.title}">
            <p>${movie.title}</p>
        </div>
    `).join('');

    $(container).html(html);
}

// ---------- Pagination ----------
function renderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let html = '';
    for(let i = 1; i <= totalPages; i++){
        html += `<button class="page-btn ${i===currentPage?'active':''}" data-page="${i}">${i}</button>`;
    }
    $('#pagination').html(html);
}

// Pagination button click
$('#pagination').on('click', '.page-btn', function() {
    currentPage = Number($(this).data('page'));
    renderResults(currentSearchResults, currentPage, '#search-results');
    renderPagination(currentSearchResults.length, currentPage);
});

// ---------- Movie Details ----------
$('#search-results, #collection-results').on('click', '.movie-item', function() {
    const movieId = $(this).data('id');

    $.getJSON(`${baseUrl}/movie/${movieId}`, { api_key: apiKey }, function(movie) {
        $('#movie-details').html(`
            <h3>${movie.title}</h3>
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}</p>
        `);
    });
});

// ---------- Predefined Collection ----------
function loadCollection() {
    $.getJSON(`${baseUrl}/movie/popular`, { api_key: apiKey, page: 1 }, function(data) {
        const html = data.results.slice(0, 10).map(movie => `
            <div class="movie-item" data-id="${movie.id}">
                <img src="${movie.poster_path ? imageBase + movie.poster_path : ''}" alt="${movie.title}">
                <p>${movie.title}</p>
            </div>
        `).join('');
        $('#collection-results').html(html);
    });
}

// Load collection on page load
$(document).ready(function() {
    loadCollection();
});

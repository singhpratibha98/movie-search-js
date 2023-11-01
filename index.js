const searchInput = document.getElementById('searchInput');
const moviesContainer = document.getElementById('movies');
const paginationContainer = document.getElementById('pagination');

let currentPage = 1;
let totalResults = 0;

const API_KEY = 'e94faa5f'; 
const BASE_URL = 'https://www.omdbapi.com/';
// https://www.omdbapi.com/?&apikey=e94faa5f&s=Batman&page=2

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const fetchMovies = async (searchTerm, page) => {
  const response = await fetch(`${BASE_URL}?&apikey=${API_KEY}&s=${searchTerm}&page=${page}`);
// const response = await fetch('https://www.omdbapi.com/?&apikey=e94faa5f&s=Batman&page=2')
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
};

const displayMovies = (movies) => {
  moviesContainer.innerHTML = '';
  console.log(movies.Search);
  movies.Search.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="${movie.Poster?movie.Poster:"https://www.shutterstock.com/shutterstock/photos/586719869/display_1500/stock-vector-online-cinema-art-movie-watching-with-popcorn-and-film-strip-cinematograph-concept-vintage-retro-586719869.jpg"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
    `;
    moviesContainer.appendChild(movieCard);
  });
};

const displayPagination = () => {
  const totalPages = Math.ceil(totalResults / 10);
  paginationContainer.innerHTML = `
    <button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Next</button>
  `;
};

const goToPage = (page) => {
  if (page >= 1 && page <= Math.ceil(totalResults / 10)) {
    currentPage = page;
    searchMovies();
  }
};

const searchMovies = async () => {
    const searchTerm = searchInput.value;
    if (searchTerm.trim() === '') {
      moviesContainer.innerHTML = '<p>Please enter a search term</p>';
      paginationContainer.innerHTML = '';
      return;
    }
  
    const data = await fetchMovies(searchTerm, currentPage);
    
    if (data.Response === 'False') {
      if (data.Error === 'Too many results.') {
        moviesContainer.innerHTML = '<p>Too many results. Please provide a more specific search term.</p>';
        paginationContainer.innerHTML = '';
      } else {
        moviesContainer.innerHTML = `<p>Error: ${data.Error}</p>`;
        paginationContainer.innerHTML = '';
      }
      return;
    }
    
    totalResults = parseInt(data.totalResults);
    
    if (totalResults === 0) {
      moviesContainer.innerHTML = '<p>No results found</p>';
      paginationContainer.innerHTML = '';
      return;
    }
    
    displayMovies(data);
    displayPagination();
  };
  

const debouncedSearchMovies = debounce(searchMovies, 300);

searchInput.addEventListener('input', debouncedSearchMovies);

searchMovies();

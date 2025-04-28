const omdbApiKey = '1d2d9d99';  // Replace with your OMDb API key

// Mood to Genre mapping (OMDb doesn’t support genres directly, so we'll use keywords)
const moodToSearchTerm = {
  happy: "comedy",
  sad: "drama",
  excited: "action",
  romantic: "romance"
};

// Fetch movies based on selected mood (search term)
async function fetchMovies(mood) {
  const searchTerm = moodToSearchTerm[mood];

  if (!searchTerm) return;

  // Fetch movies based on search term (genre) and sort by year for newer content
  const movieResponse = await fetch(`http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${searchTerm}&type=movie&y=2020-2025`);
  const movieData = await movieResponse.json();

  if (movieData.Response === "True") {
    // Randomize the movie list to avoid showing the same set of movies to every user
    const randomizedMovies = shuffle(movieData.Search);

    // Display the randomized movies
    if (randomizedMovies.length > 0) {
      displayMovies(randomizedMovies);
    } else {
      document.getElementById('recommendations').innerHTML = `<p>No movies found for your mood.</p>`;
    }
  } else {
    document.getElementById('recommendations').innerHTML = `<p>No movies found for your mood.</p>`;
  }
}

// Shuffle the array to randomize the movie list
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Display movies and their information
function displayMovies(movies) {
  const recommendationsDiv = document.getElementById('recommendations');
  recommendationsDiv.innerHTML = '';

  for (const movie of movies) {
    // Check if the movie has a poster
    const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Poster";
    
    recommendationsDiv.innerHTML += `
      <div class="movie-card">
        <img src="${posterUrl}" alt="${movie.Title} Poster">
        <h3>${movie.Title}</h3>
      </div>
    `;
  }
}

document.getElementById('recommendBtn').addEventListener('click', function() {
  const mood = document.getElementById('moodSelect').value;

  if (mood) {
    fetchMovies(mood);
  } else {
    document.getElementById('recommendations').innerHTML = "<p>Please select a mood to get recommendations.</p>";
  }
});

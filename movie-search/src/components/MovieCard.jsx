import { useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "29c97c2e";

  const handleSearch = async () => {
    if (!query.trim) {
      setError("Please enter a movie name ");
      return;
    }

    setLoading(true);
    setError('');
    setMovies([]);

    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
      const data = await res.json();

      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      setMovies(data.Search);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg"> Movie Search App</h1>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your favorate a movie..."
          className="flex-1 px-4 py-3 rounded-2xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-md"
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 cursor-pointer font-semibold"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-cyan-300 text-lg animate-pulse">Loading...</p>}
      {error && <p className="text-red-400 text-lg">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <motion.p 
         initial = {{ opacity: 0 }}
         animate = {{ opacity: 1 }}
         className="text-gray-400 text-lg"> Search a movie to get started!
        </motion.p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        <AnimatePresence>
          {movies.map((movie) => (
            <motion.div
              key={movie.imdbID}
              layout 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-800 bg-opacity-60 rounded-2xl shadow-lg p-4 backdrop-blur-lg border border-gray-700 hover:shadow-cyan-500/30 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}
                alt={movie.Title}
                className="w-full h-72 object-cover rounded-xl mb-3 cursor-pointer"
              />
              <h2 className="text-lg font-semibold">{movie.Title}</h2>
              <p className="text-gray-400">{movie.Year}</p>
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                className="inline-block mt-2 text-cyan-400 hover:underline"
              >
                View on IMDb →
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

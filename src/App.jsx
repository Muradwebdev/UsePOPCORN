import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMoviesList";
import MovieList from "./components/MovieList";
import Box from "./components/Box";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import MovieDetails from "./components/MovieDetails";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const keys = "3d941e81";

export default function App() {
  const [query, setQuery] = useState("Interstellar");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const store = localStorage.getItem("movies");
    return store ? JSON.parse(store) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(watched));
  }, [watched]);

  const handlerSelectedMovies = (id) => {
    setSelectedId((prew) => (prew === id ? null : id));
  };

  //prew ele selectedId demekdi yadda saxla !!!
  const closeSelectedId = () => {
    setSelectedId(null);
  };

  const handlerAddWatched = (movie) => {
    setWatched((prew) =>
      prew.some((data) => data.imdbID === movie.imdbID)
        ? prew
        : [...prew, movie]
    );
  };

  const handleDeleteMovie = (id) => {
    setWatched(watched.filter((item) => item.imdbID !== id));
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${keys}&s=${query}`,
          { signal }
        );
        if (!res.ok) throw new Error("Throw olan hissede error var!!!");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Found movie list");
        setMovies(data.Search);
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return (
    <>
      <NavBar movies={movies}>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} handlerId={handlerSelectedMovies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              closeSelectedId={closeSelectedId}
              setSelectedId={setSelectedId}
              handlerAddWatched={handlerAddWatched}
              watched={watched}
              handleDeleteMovie={handleDeleteMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} average={average} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

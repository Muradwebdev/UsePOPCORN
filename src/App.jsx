import { useState } from "react";
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
import { useMovies } from "./components/useMovies";
import useLocalStorageState from "./components/useLocalStorageState";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("Interstellar");
  const [watched, setWatched] = useLocalStorageState("movies", []);
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

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

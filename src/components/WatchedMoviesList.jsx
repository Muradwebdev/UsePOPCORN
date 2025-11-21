import WatchedMovie from "./WatchedMovie";

function WatchedMoviesList({ watched ,handleDeleteMovie}) {
  return (
    <ul className="list list-watched">
      {watched &&
        watched.map((movie) => (
          <WatchedMovie movie={movie} key={movie.imdbID} handleDeleteMovie={handleDeleteMovie} />
        ))}
    </ul>
  );
}

export default WatchedMoviesList;

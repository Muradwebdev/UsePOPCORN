import Movie from "./Movie";

function MovieList({ movies ,handlerId}) {
  return (
    <ul className="list list-movies ">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} handlerId={handlerId}/>
      ))}
    </ul>
  );
}

export default MovieList;

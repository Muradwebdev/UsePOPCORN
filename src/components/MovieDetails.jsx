import { useEffect, useState } from "react";
import { keys } from "../App";
import StarRating from "./StarRating";
import Loader from "./Loader";
const MovieDetails = ({
  selectedId,
  closeSelectedId,
  handlerAddWatched,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  useEffect(() => {
    function callBack(e) {
      if (e.code === "Escape") {
        closeSelectedId(null);
        console.log("Close oldu");
      }
    }
    document.addEventListener("keydown", callBack);
    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [closeSelectedId]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchDetailsMovies = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${keys}&i=${selectedId}`,
          { signal }
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("🔴 Fetch dayandırıldı!");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetailsMovies();
    return () => controller.abort();
  }, [selectedId]);

  useEffect(() => {
    if (movie.Title) {
      document.title = `Movie | ${movie.Title}`;
    }

    return () => (document.title = "Movie Watchlist App");
  }, [movie.Title]);

  useEffect(() => {
    const icon = document.querySelector("#favicon");
    if (poster) {
      icon.href = poster;
    }
  }, [poster]);

  const handlerAdd = () => {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      plot,
      released,
      actors,
      director,
      genre,
      userRating,
    };
    handlerAddWatched(newMovie);
    closeSelectedId(null);
  };
  const isWatched = watched.find((m) => m.imdbID === selectedId);
  let watchedUserRating = watched.find(
    (watch) => watch.imdbID === selectedId
  )?.userRating;
  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={closeSelectedId}>
                &larr;
              </button>
              <img src={poster} alt={`poster of ${movie}`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull;{runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating}
                </p>
              </div>
            </header>
            <section>
              <div className="rating">
                {isWatched ? (
                  <p>Bu film qiymetlendirilib {watchedUserRating}🌟</p>
                ) : (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handlerAdd}>
                        + Add to list
                      </button>
                    )}
                  </>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default MovieDetails;

//  fetchDetailsMovies - bunu app de yazdim dedim guya rahat olsun datani
//  props kecmek ama musahide etdim ki useEffectde cagirsam funksiyanin
//  adini dependeciese men gelek bele yazim ( query,selectedId,keys ) buda
//  apd de state deyisdiyine gore rendere gedecey ve butun childdarin da
//  renderine sebeb olardi

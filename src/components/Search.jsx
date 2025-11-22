import { useEffect, useRef } from "react";

function Search({ query, setQuery }) {
  const inputElem = useRef();

  useEffect(() => {
    const onCallBack = (e) => {
      if (e.key === "Enter") {
        inputElem.current.focus();
        inputElem.current.style.backgroundColor = "#ee628eff";
      }
    };
    document.addEventListener("keydown", onCallBack);
    return () => {
      document.removeEventListener("keydown", onCallBack);
    };
  }, []);
  return (
    <input
      ref={inputElem}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default Search;

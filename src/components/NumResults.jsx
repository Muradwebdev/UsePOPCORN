import { useEffect, useRef } from "react";

function NumResults({ movies }) {
  const element = useRef();
  useEffect(() => {
    element.current.style.color = "yellow";
  }, []);

  return (
    <p className="num-results">
      Found <strong ref={element}>{movies && movies.length}</strong> results
    </p>
  );
}

export default NumResults;

import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import StarRating from "./components/StarRating.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <StarRating maxRating={5}/>
    <StarRating maxRating={10}/>
  </>
);

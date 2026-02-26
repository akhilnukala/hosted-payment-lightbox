import { Routes, Route } from "react-router-dom";
import Success from "./pages/Success";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
};

export default App;

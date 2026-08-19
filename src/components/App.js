import React, { Component } from "react";
import Nav from "./Nav";
import Home from "./Home";
import "../index.css";
import Moviesofyear from "./Moviesofyear";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

function HomeWithParams(props) {
  const params = useParams();
  return <Home match={{ params }} {...props} />;
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Routes>
            <Route path="/" element={<HomeWithParams />} />
            <Route path="/genre/:genre" element={<HomeWithParams />} />
            <Route path="/bestmoviesofyear" element={<Moviesofyear />} />
            <Route
              path="*"
              element={<h3>404 not found, go play somewhere else dude..</h3>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

import "preact/debug";
import { render } from 'preact'

import './index.css';

import { Route, Router } from "preact-router";
import { Home } from "./routes/home/home";
import { Game } from "./routes/game/game";

const Main = () => {
  return (
    <Router>
      <Route default component={Home} />
      <Route path="/game" component={Game} />
    </Router>
  );
}

render(<Main />, document.getElementById('app') as HTMLElement)

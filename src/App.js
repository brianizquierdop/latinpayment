import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import InlineCartPage from './InlineCartPage/InlineCartPage';
import LightboxCartPage from './LightboxCartPage/LightboxCartPage';
// import HomePage from './HomePage/HomePage'; // opcional, si lo quieres después

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={InlineCartPage} />
        <Route exact path="/inline" component={InlineCartPage} />
        <Route exact path="/lightbox" component={LightboxCartPage} />
      </Switch>
    </Router>
  );
}

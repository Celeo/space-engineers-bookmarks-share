import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { AuthSignIn, AuthSignOut } from "./Auth";
import { Home } from "./Home";
import { Navbar } from "./Navbar";
import { WorldInfo, WorldListing } from "./Worlds";

export const App = (): React.ReactElement => {
  return (
    <div id="main">
      <Router>
        <Navbar />
        <section className="section">
          <div className="container">
            <Switch>
              <Route path="/auth/sign-in">
                <AuthSignIn />
              </Route>
              <Route path="/auth/sign-out">
                <AuthSignOut />
              </Route>
              <Route path="/worlds/:id">
                <WorldInfo />
              </Route>
              <Route path="/worlds">
                <WorldListing />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </section>
      </Router>
      \
    </div>
  );
};

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthSignIn, AuthSignOut } from "./Auth";
import { Navbar } from "./Navbar";

export const App = (): React.ReactElement => {
  return (
    <div id="main">
      <Router>
        <Navbar />
        <section className="section">
          <div className="container">
            <h2 className="title is-2">App</h2>
            <Switch>
              <Route path="/auth/sign-in">
                <AuthSignIn />
              </Route>
              <Route path="/auth/sign-out">
                <AuthSignOut />
              </Route>
              <Route path="/">
                <p className="s-text">Home</p>
              </Route>
            </Switch>
          </div>
        </section>
      </Router>
    </div>
  );
};

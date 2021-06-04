import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

//Material UI and templates
import "assets/css/material-dashboard-react.css?v=1.10.0";
import { ThemeProvider } from "@material-ui/styles";

// core components
import GeneralDashboard from "layouts/GeneralDashboard";
import SubjectDashboard from "layouts/SubjectDashboard";
import SignInSide from "views/Login/SignInSide";
import SignUp from "views/Login/SignUp";

import theme from './ThemeConfig';
import Profile from "views/General/Profile";

const serverLink = createHttpLink({
  uri: 'http://localhost:5000'
});

const client = new ApolloClient({
  link: serverLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <Switch>
            <Route path="/dashboard" component={GeneralDashboard} />
            <Route path="/profile" component={Profile} />
            {/* <Route path="/profile/:id" component={Profile} /> */}
            <Route path="/subject" component={SubjectDashboard} />
            <Route path="/login" component={SignInSide} />
            <Route path="/sign-up" component={SignUp} />
            <Redirect from="/" to="/login" />
          </Switch>
        </BrowserRouter>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

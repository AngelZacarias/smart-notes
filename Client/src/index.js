import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

//Material UI and templates
import "assets/css/material-dashboard-react.css?v=1.10.0";
import { ThemeProvider } from "@material-ui/styles";
import theme from './ThemeConfig';

// core components
import Authentication from './authentication/Authentication';
import GeneralDashboard from "layouts/GeneralDashboard";
import SubjectDashboard from "layouts/SubjectDashboard";
import SignInSide from "views/Login/SignInSide";
import SignUp from "views/Login/SignUp";
import Profile from "views/General/Profile";
import Search from "views/General/Search";

// Context Providers
import SubjectProvider from "hooks/SubjectContext";

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
      <SubjectProvider>
        <BrowserRouter>
          <Switch>
            <Authentication path="/dashboard" component={GeneralDashboard} />
            <Authentication path="/profile" component={Profile} />
            {/* <Route path="/profile/:id" component={Profile} /> */}
            <Authentication path="/subject" component={SubjectDashboard} />
            <Authentication path="/subject-tasks" component={SubjectDashboard} />
            <Authentication path="/subject-notes" component={SubjectDashboard} />
            <Authentication path="/subject-study" component={SubjectDashboard} />
            <Authentication path="/search" component={Search} />
            <Route path="/login" component={SignInSide} />
            <Route path="/sign-up" component={SignUp} />
            <Redirect from="/" to="/login" />
          </Switch>
        </BrowserRouter>
      </SubjectProvider>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

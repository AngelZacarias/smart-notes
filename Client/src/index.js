import React from "react";
import ReactDOM from "react-dom";
import dotenv from 'dotenv';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from '@apollo/client/react';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
//eslint-disable-next-line
import { ApolloClient, InMemoryCache, split, createHttpLink } from '@apollo/client';

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
import UserProvider from "hooks/UserContext";

//Gets ENV vars
dotenv.config();

//Apollo Client Link for Queries and Mutations
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_APOLLO_HTTP
});

//WebSocket Link for subscriptions
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_APOLLO_WS,
  options: {
    reconnect: true
  }
});

// The split the connection to its link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <SubjectProvider>
          <BrowserRouter>
            <Switch>
              <Authentication path="/dashboard" component={GeneralDashboard} />
              <Authentication path="/profile" component={Profile} />
              <Authentication path="/profile/:id" component={Profile} />
              <Authentication path="/subject" component={SubjectDashboard} />
              <Authentication path="/subject-tasks" component={SubjectDashboard} />
              <Authentication path="/subject-notes" component={SubjectDashboard} />
              <Authentication path="/subject-study" component={SubjectDashboard} />
              <Authentication path="/search" component={Search} />
              <Route path="/login" component={SignInSide} isCallBack={true}/>
              <Route path="/sign-up" component={SignUp} />
              <Redirect from="/" to="/login" />
            </Switch>
          </BrowserRouter>
        </SubjectProvider>
      </UserProvider>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

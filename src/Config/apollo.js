import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import * as fetch from 'cross-fetch';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  fetch,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export default client;

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import * as fetch from 'cross-fetch';

const httpLink = new HttpLink({
  uri: 'https://point-of-sale-carnaval-server.onrender.com/graphql',
  fetch,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export default client;

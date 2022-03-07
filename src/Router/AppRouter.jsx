import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar } from '../Components/Navbar/Navbar';
import GlobalStyle from '../globalStyles';
import { Home } from '../Pages/Home';

export const AppRouter = () => {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </Router>
  );
};

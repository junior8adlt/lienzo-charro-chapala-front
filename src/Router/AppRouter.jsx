import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar } from '../Components/Navbar/Navbar';
import GlobalStyle from '../globalStyles';
import { Home } from '../Pages/Home';
import { Productos } from '../Pages/Productos/Productos';

export const AppRouter = () => {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/productos' component={Productos} />
      </Switch>
    </Router>
  );
};

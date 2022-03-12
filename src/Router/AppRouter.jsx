import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar } from '../Components/Navbar/Navbar';
import GlobalStyle from '../globalStyles';
import { Barras } from '../Pages/Barras/Barras';
import { CrearGasto } from '../Pages/Gastos/CrearGasto';
import { Gastos } from '../Pages/Gastos/Gastos';
import { Home } from '../Pages/Home';
import { Inventarios } from '../Pages/Inventarios/Inventarios';
import { Productos } from '../Pages/Productos/Productos';

export const AppRouter = () => {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/productos' component={Productos} />
        <Route path='/barras' component={Barras} />
        <Route path='/inventarios' component={Inventarios} />
        <Route exact path='/gastos' component={Gastos} />
        <Route path='/gastos/crear' component={CrearGasto} />
      </Switch>
    </Router>
  );
};

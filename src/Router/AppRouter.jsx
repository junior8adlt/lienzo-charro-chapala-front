import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CreateMovement } from '../Components/CreateMovement/CreateMovement';
import { Navbar } from '../Components/Navbar/Navbar';
import GlobalStyle from '../globalStyles';
import { Barras } from '../Pages/Barras/Barras';
import { Gastos } from '../Pages/Gastos/Gastos';
import { Home } from '../Pages/Home';
import { InventarioInfo } from '../Pages/Inventarios/InventarioInfo';
import { Inventarios } from '../Pages/Inventarios/Inventarios';
import { Productos } from '../Pages/Productos/Productos';
import { Reportes } from '../Pages/Reportes/Reportes';
import { CrearTransferencias } from '../Pages/Transferencias/CrearTransferencias';
import { Transferencias } from '../Pages/Transferencias/Transferencias';
import { Ventas } from '../Pages/Ventas/Ventas';

export const AppRouter = () => {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/productos' component={Productos} />
        <Route path='/barras' component={Barras} />
        <Route exact path='/inventarios' component={Inventarios} />
        <Route path='/inventarios/detalles/:id' component={InventarioInfo} />
        <Route exact path='/gastos' component={Gastos} />
        <Route
          path='/gastos/crear'
          render={(props) => <CreateMovement {...props} isSale={false} />}
        />
        <Route exact path='/ventas' component={Ventas} />
        <Route
          path='/ventas/crear'
          render={(props) => <CreateMovement {...props} isSale={true} />}
        />
        <Route exact path='/transferencias' component={Transferencias} />
        <Route path='/transferencias/crear' component={CrearTransferencias} />
        <Route path='/reporte' component={Reportes} />
      </Switch>
    </Router>
  );
};

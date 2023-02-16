import React from 'react';
import logo from '../../assets/img/logo.png';
import { Bars, MobilMenu, Nav, NavLink, NavMenu, Times } from './Navbar.elements';
export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onClickNavLink = () => {
    setIsOpen(false);
  };
  const NavItems = () => (
    <>
      <NavLink to='/transferencias' activeStyle onClick={onClickNavLink}>
        Transferencias
      </NavLink>
      <NavLink to='/ventas' activeStyle onClick={onClickNavLink}>
        Ventas
      </NavLink>
      <NavLink to='/gastos' activeStyle onClick={onClickNavLink}>
        Gastos
      </NavLink>
      <NavLink to='/bills' activeStyle onClick={onClickNavLink}>
        Bills
      </NavLink>
      <NavLink to='/productos' activeStyle onClick={onClickNavLink}>
        Productos
      </NavLink>
      <NavLink to='/barras' activeStyle onClick={onClickNavLink}>
        Barras
      </NavLink>
      <NavLink to='/inventarios' activeStyle onClick={onClickNavLink}>
        Inventarios
      </NavLink>
      <NavLink to='/reporte' activeStyle onClick={onClickNavLink}>
        Reportes
      </NavLink>
    </>
  );
  return (
    <Nav>
      <NavLink to='/'>
        <img src={logo} alt='Carnaval Logo' />
      </NavLink>
      {isOpen ? (
        <Times onClick={() => setIsOpen(false)} />
      ) : (
        <Bars onClick={() => setIsOpen(true)} />
      )}

      <NavMenu>
        <NavItems />
      </NavMenu>
      {isOpen && <MobilMenu>{NavItems()}</MobilMenu>}
    </Nav>
  );
};

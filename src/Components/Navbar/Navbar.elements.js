import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

export const Nav = styled.nav`
  background: #1976d2;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1000px) / 2);
  z-index: 10;
`;

export const NavLink = styled(Link)`
  color: #f2f2f2;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
  &.active {
    color: #fff;
    font-weight: bold;
  }
  img {
    width: 200px;
    height: 100px;
    object-fit: cover;
    padding: 1rem;
  }
  @media screen and (max-width: 768px) {
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #fff;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const Times = styled(FaTimes)`
  display: none;
  color: #fff;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const MobilMenu = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 550px;
    position: absolute;
    top: 80px;
    background: #1976d2;
    left: 0;
    opacity: 1;
    transition: all 0.5s ease;
    z-index: 11;
  }
`;

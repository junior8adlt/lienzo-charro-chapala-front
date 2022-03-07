import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

*{
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Monserrat', sans-serif;
}
`;
export const Container = styled.div`
  z-index: 1;
  width: 100%;
  max-width: 1300px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 50px;
  padding-left: 50px;

  @media screen and (max-width: 991px) {
    padding-right: 30px;
    padding-left: 30px;
  }
`;

export const CustomButton = styled.button`
  border-radius: 4px;
  background: linear-gradient(45deg, #2196f3 30%, #21cbf3 90%);
  white-space: nowrap;
  padding: 12px 64px;
  color: #fff;
  font-size: 17px;
  box-shadow: 0 3px 5px 2px rgba(33, 203, 243, 0.3);
  outline: none;
  border: none;
  cursor: pointer;
  border: 0;

  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

export default GlobalStyle;

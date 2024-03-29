import { DatePicker, Input, Select } from 'antd';
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
  max-width: 1500px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 50px;
  padding-left: 50px;
  margin-top: 2rem;
  @media screen and (max-width: 991px) {
    padding-right: 30px;
    padding-left: 30px;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
`;

export const Subtitle = styled.h3`
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
`;

export const ActionItem = styled.span`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    text-decoration: underline;
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
  &:disabled {
    background: rgba(33, 203, 243, 0.8);
    cursor: not-allowed;
  }
  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;
export const CustomInput = styled(Input)`
  font-family: 'Roboto', sans-serif;
  color: #333;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  border: 1px solid #e6e6e6;
  width: 100%;
  display: block;
  &:focus {
    outline: none;
  }
`;

export const CustomDatePicker = styled(DatePicker)`
  width: ${(props) => (props.fullW ? '100% !important' : '300px !important')};
  height: 44px !important;
  display: flex;
  align-items: center;
  border-radius: 5px;
`;

export const CustomSelect = styled(Select)`
  & > .ant-select-selector {
    width: ${(props) => (props.fullW ? '100% !important' : '250px !important')};
    height: 44px !important;
    display: flex;
    align-items: center;
    border-radius: 5px !important;
    span input {
      height: 100% !important;
    }
  }
`;

export default GlobalStyle;

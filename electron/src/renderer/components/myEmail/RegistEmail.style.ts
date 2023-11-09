import styled from 'styled-components';

const Container = styled.div`
  display: felx;
  flex-direction: column;
  aligh-items: center;
  background-color: black;
  color: white;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  align-items: center;
  font-family: Jalnan;
`;

const InputField = styled.input`
  border: none;
  border-bottom: 1px solid white;
  outline: none;
  background: transparent;
  color: white;
  margin-top: 5px;
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 5px;
  background-color: blue;
  color: white;
  margin-top: 10px;
  padding: 5px 10px;
  font-family: Jalnan;
  width: 100px;
  height: 60px;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: blue;
  }
`;

const Select = styled.select`
  background-color: black;
  color: white;
`;

export {
  Container,
  InputContainer,
  InputField,
  Button,
  ButtonContainer,
  Select,
};

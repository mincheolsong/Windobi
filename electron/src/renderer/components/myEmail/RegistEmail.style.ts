import styled from 'styled-components';

const Container = styled.div`
  display: felx;
  flex-direction: column;
  aligh-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px 0 10px 0;
  align-items: center;
  font-family: Jalnan;
`;

const InputSelect = styled.select`
  width: 80px;
  border-radius: 4px;
  margin-left: 5px;
  outline: 0.5px solid;
`;

const Message = styled.div`
  display: flex;
  font-family: GmarketSansTTFMedium;
  font-size: 13px;
  color: red;
`;

const InputField = styled.input`
  border-radius: 5px;
  margin: 0px 5px 0 5px;
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  cursor: pointer;
  &:hover {
    background-color: white;
    color: blue;
  }
`;

export { Container, InputContainer, InputField, Button, ButtonContainer, Message, InputSelect };

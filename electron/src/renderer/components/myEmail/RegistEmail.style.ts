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
  width: 100px;
  height: 25px;
  border-radius: 4px;
  margin-left: 5px;
  outline: none;
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
`;

const Message = styled.div`
  display: flex;
  font-family: GmarketSansTTFMedium;
  font-size: 13px;
  color: red;
`;

const InputField = styled.input`
  width: 150px;
  height: 22px;
  background: rgb(235, 235, 235);
  margin: 0px 5px 0 5px;
  border: none;
  font-size: 15px;
  padding-left: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 5px;
  background-color: rgba(50, 150, 255, 0.8);
  color: white;
  font-family: Jalnan;
  width: 100px;
  height: 60px;
  border: 0px;
  &:hover {
    color: gray;
    background-color: white;
    cursor: pointer;
    transition: 0.2s all;
  }
`;

export {
  Container,
  InputContainer,
  InputField,
  Button,
  ButtonContainer,
  Message,
  InputSelect,
};

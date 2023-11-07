import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Details = styled.details`
  width: 100%;
  min-height: 50px;

  border: 0px;
  border-radius: 12px;

  & > summary {
    border-radius: 10px;
  }

  &[open] > summary {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    transition: all 0.2s;
  }
`;

const Summary = styled.summary`
  width: 100%;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(50, 168, 255);

  font-size: 30px;

  &:hover {
    cursor: pointer;
    background: rgb(30, 128, 255);
    transition: 0.1s all ease-in-out;
  }
`;

const Input = styled.input`
  height: 40px;
  border: 0px;
  outline: none;

  background-color: rgb(240, 240, 240);

  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

const Message = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  background-color: gray;
  height: 50px;
  font-size: 30px;
  border-radius: 10px;
  border: 0px;

  &:hover {
    cursor: pointer;
    background-color: rgba(11, 108, 255, 0.8);
    transition: all 0.1s;
  }
`;

export { Wrapper, Details, Summary, Input, Message, Button };

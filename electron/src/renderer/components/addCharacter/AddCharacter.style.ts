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
  background: #cce4ff;

  font-size: 30px;

  &:hover {
    cursor: pointer;
    background: #80bdff;
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

type TButton = {
  able?: boolean;
};

const Button = styled.button<TButton>`
  background-color: ${({ able }) => (able ? 'rgb(50, 168, 255)' : 'gray')};
  height: 50px;
  font-size: 30px;
  border-radius: 10px;
  border: 0px;

  ${({ able }) => {
    if (able) {
      return `&:hover {
        cursor: pointer;
        background-color: rgba(11, 108, 255, 0.8);
        transition: all 0.1s;
      }`;
    }
    return '';
  }}
`;

export { Wrapper, Details, Summary, Input, Message, Button };

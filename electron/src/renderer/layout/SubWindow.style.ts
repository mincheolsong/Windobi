import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  overflow-x: hidden;
  overflow-y: hidden;

  border-radius: 10px;
`;

const Header = styled.div`
  width: 100%;
  height: 35px;

  font-size: 25px;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgb(11, 108, 255);

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: rgba(180, 180, 180, 0.75);

    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(245, 245, 245, 0.5);
  }
`;

export { Wrapper, Header, Body };

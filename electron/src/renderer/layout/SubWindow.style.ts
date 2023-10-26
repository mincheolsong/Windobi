import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);

  border-radius: 10px;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 5px;
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

export { Wrapper, Body };

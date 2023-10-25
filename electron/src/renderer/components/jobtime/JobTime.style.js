const { styled } = require('styled-components');

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: rgba(120, 120, 120, 0.25);

  &::-webkit-scrollbar {
    width: 15px;
  }
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: rgba(33, 122, 244, 1);

    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(33, 122, 244, 0.5);
  }
`;

export { Wrapper };

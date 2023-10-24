const { styled } = require('styled-components');

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    position: absolute;
    background-color: red;
    margin: 5px;
  }
`;

const MenuItem = styled.div``;

export { Wrapper, MenuItem };

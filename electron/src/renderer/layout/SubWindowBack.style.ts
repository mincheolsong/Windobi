import styled from 'styled-components';

const Back = styled.div`
  position: fixed;
  width: 30px;
  height: 30px;
  left: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;

    & > * {
      color: gray;
      transition: all 0.15s;
    }
  }
`;

export { Back };

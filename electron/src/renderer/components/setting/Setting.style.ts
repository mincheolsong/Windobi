import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Li = styled.li`
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgb(255, 255, 255);

  font-family: GmarketSansTTFMedium;
  border-radius: 8px;

  &:hover {
    cursor: pointer;
    background-color: rgba(50, 150, 255, 0.8);
    transition: all 0.15s ease-in-out;
    color: white;
  }
  transition: all 0.1s ease-in-out;
`;

export { Wrapper, Ul, Li };

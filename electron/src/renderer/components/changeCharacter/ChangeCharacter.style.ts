import { styled } from 'styled-components';

const Ul = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Li = styled.li`
  width: 100%;
  height: 80px;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;

  font-size: 20px;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: rgba(230, 230, 230, 1);
    transition: all 0.1s ease-in-out;
  }
`;

export { Ul, Li };

import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 80px;
  height: 80px;
  font-size: 10px;
  background-color: rgb(255, 255, 255);
`;

const Base = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Active = styled(Base)`
  border: 3px solid rgb(0, 180, 0);
`;

const NoActive = styled(Base)`
  border: 3px solid gray;
`;

export { Wrapper, Active, NoActive };

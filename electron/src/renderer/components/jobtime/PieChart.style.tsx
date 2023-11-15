import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
  padding-top: 5px;
`;

const Application = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
`;

const Centerize = styled.div`
  display: flex;
  justify-content: center;
`;

const Tooltip = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 5px;
`;

export { Wrapper, Application, Centerize, Tooltip };

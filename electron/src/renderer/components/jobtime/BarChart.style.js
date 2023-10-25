import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
`;

const Ul = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Li = styled.li`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Bar = styled.div`
  width: ${(props) => props.percentage}%;
  height: 20px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: red;
`;

export { Wrapper, Ul, Li, Bar };

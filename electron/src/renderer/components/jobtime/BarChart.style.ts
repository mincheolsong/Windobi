import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding-top: 10px;
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
  align-items: center;
  margin-bottom: 10px;
`;

const Image = styled.img`
  &:hover {
    cursor: pointer;
  }
`;

type TBar = {
  percentage: number;
  barcolor: string;
};
const Bar = styled.div<TBar>`
  width: ${(props) => props.percentage}%;
  height: 24px;
  margin-left: 10px;
  margin-right: 10px;
  padding-left: 10px;
  border-radius: 10px;

  background-color: ${(props) => props.barcolor};
  font-weight: bold;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

export { Wrapper, Ul, Li, Image, Bar };

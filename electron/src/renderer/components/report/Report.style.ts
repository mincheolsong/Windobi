import styled, { keyframes } from 'styled-components';

const BarHeader = styled.div`
  display: flex;
  font-size: 22px;
  margin-left: 19px;
  align-items: center;
`;

const Title = styled.h2`
  padding-top: 29px;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
`;
const Bolder = styled.div`
  font-weight: bolder;
  font-size: 35px;
`;

const Lighter = styled.div`
  font-weight: lighter;
  margin-left: 19px;
  color: #b1b1b1;
`;

const BarContainer = styled.div`
  height: 400px;
  background: white;
  margin: 5px 20px;
  border-radius: 15px;
  padding: 10px;
`;

const MostAppContainer = styled.div`
  background: white;
  margin: 15px 20px 0px 20px;
  border-radius: 15px;
  padding: 10px;
`;

const Date = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const MostTitle = styled.h3`
  margin-left: 19px;
`;

const MostDetailContainer = styled.div`
  width: 400px;
  height: 558px;
  margin-top: 5px;
  background: white;
  border-radius: 15px;
  padding-top: 15px;
  margin-right: 20px;
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const MostLangTitle = styled.h3`
  margin-left: 19px;
`;
export {
  BarHeader,
  Bolder,
  Lighter,
  Title,
  BarContainer,
  Date,
  MostAppContainer,
  MostTitle,
  MostDetailContainer,
  Body,
  MostLangTitle,
};

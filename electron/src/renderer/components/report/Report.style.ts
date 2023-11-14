import styled, { keyframes } from 'styled-components';

const BarHeader = styled.div`
  display: flex;
  font-size: 22px;
  margin-left: 19px;
  align-items: center;
`;

const LastWeekHeader = styled.div`
  display: flex;
  font-size: 22px;
  align-items: center;
`;

const LastWeekContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  // border-radius: 0px 0px 15px 15px;

  margin-left: 20px;
  margin-right: 20px;
  padding-left: 19px;
  padding-bottom: 10px;
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
  margin: 5px 20px 0px 20px;
  // border-radius: 15px 15px 0px 0px;

  padding: 10px;
`;

const MostAppContainer = styled.div`
  background: white;
  margin: 15px 20px 0px 20px;
  // border-radius: 15px;
  padding: 10px;
  height: 135px;
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
  height: 607px;
  margin-top: 5px;
  background: white;
  // border-radius: 15px;
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

const GrassContainer = styled.div`
  width: 520px;
  height: 324px;
  background: white;
  padding-top: 15px;
`;

const UsageByTimeContainer = styled.div`
  width: 520px;
  height: 263px;
  background: white;
  padding-top: 15px;
  margin-top: 20px;
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
  LastWeekContainer,
  LastWeekHeader,
  GrassContainer,
  UsageByTimeContainer,
};

import styled, { keyframes } from 'styled-components';

const BarHeader = styled.div`
  padding-top: 10px;
  display: flex;
  font-size: 22px;
  margin-left: 19px;
  align-items: center;
`;

const LastWeekHeader = styled.div`
  display: flex;
  align-items: center;
`;

const LastWeekContainer = styled.div`
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  background: white;
  // border-radius: 0px 0px 15px 15px;

  margin-left: 20px;
  margin-right: 20px;
  padding-left: 19px;
  padding-bottom: 5px;
`;

const Title = styled.h2`
  font-family: GmarketSansTTFBold;
  font-weight: bold;
  padding-top: 15px;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
`;
const Bolder = styled.div`
  font-family: GmarketSansTTFMedium;
  font-weight: bolder;
  font-size: 35px;
  margin-right: 4px;
`;

const Context = styled.div`
  font-family: GmarketSansTTFMedium;
  padding-top: 15px;
`;

const Lighter = styled.div`
  font-family: GmarketSansTTFLight;
  font-weight: lighter;
  margin-left: 19px;
  color: #aaaaaa;
  font-weight: normal;
`;

const BarContainer = styled.div`
  border-radius: 8px 8px 0 0;
  height: 417px;
  background: white;
  margin: 0px 20px 0px 20px;
  // border-radius: 15px 15px 0px 0px;

  padding: 10px;
`;

const MostAppContainer = styled.div`
  background: white;
  margin: 15px 20px 0px 20px;
  border-radius: 8px;
  padding: 10px;
  height: 153px;
`;

const Date = styled.div`
  font-family: GmarketSansTTFMedium;
  margin-bottom: 9px;
  display: flex;
  justify-content: center;
`;

const MostTitle = styled.h3`
  font-family: GmarketSansTTFMedium;
  margin-left: 19px;
  padding-bottom: 12px;
`;

const MostDetailContainer = styled.div`
  border-radius: 8px;
  width: 400px;
  height: 630px;
  background: white;
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
  font-family: GmarketSansTTFMedium;
  margin-left: 19px;
`;

const GrassContainer = styled.div`
  border-radius: 8px;
  width: 570px;
  height: 341px;
  background: white;
  padding-top: 15px;
`;

const UsageByTimeContainer = styled.div`
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 570px;
  height: 269px;
  background: white;
  padding-top: 15px;
  margin-top: 20px;
`;
const Days = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1px 0 1px 0;
  justify-content: center; /* 가로 중앙 정렬 */
  padding: 1px;
`;
const DayComponent = styled.div`
  margin: 0.4px;
  width: 19px;
  height: 19px;
  border-radius: ${(props) => getRadius(props.order)};
  background-color: rgb(${(props) => getColor(props.hour, props.order)});
`;
const Week = styled.div`
  margin-top: 5px;
  font-weight: bold;
  font-family: GmarketSansTTFLight;
  font-size: 11px;
  margin-left: 7px;
  color: rgb(195, 195, 195);
`;
const WeekUsageContainer = styled.div`
  height: 45px;
  display: flex;
  justify-content: space-between;
  // background-color: red;
`;

const TotalTime = styled.div`
  font-weight: bolder;
  font-size: 33px;
  display: flex;
  display-direction: row;
  margin-left: 19px;
`;

const TimeText = styled.div`
  font-size 15px;
  font-weight: bold;
  font-family: GmarketSansTTFLight;
  margin-right: 45px;
  padding-top: 20px;
`;

const TimeTable = styled.div`
  margin-top: 3px;
  margin-left: 35px;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  font-size: 11px;
  width: 490px;
`;

const Time = styled.div`
  font-family: GmarketSansTTFLight;
  font-weight: bold;
  font-family: GmarketSansTTFLight;
  font-size: 11px;
  color: rgb(195, 195, 195);
`;

const Text = styled.div`
  font-weight: lighter;
  font-family: GmarketSansTTFMedium;
  font-size: 20px;
  padding-top: 16px;
`;

const UsageContainer = styled.div`
  padding-top: 5px;
`;

const getRadius = (hour: any) => {
  if (hour === 0) {
    return '40% 0 0 40%';
  } else if (hour === 23) {
    return '0 40% 40% 0';
  } else {
    return '0 0 0 0';
  }
};

const getColor = (hours: any, order: any) => {
  if (hours == 0) {
    return '242,242,242';
  } else if (hours < 900) {
    if(order < 12){
      return '166, 255, 137';
    }
    return '180,217,250';
  } else if (hours < 1800) {
    if(order < 12){
      return '112,255,66';
    }
    return '142,200,250';
  } else if (hours < 2700) {
    if(order < 12){
      return '61,249,00';
    }
    return '81,172,252';
  } else {
    if(order < 12){
      return '35,142,00';
    }
    return '38,148,245';
  }
};
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
  DayComponent,
  Days,
  UsageContainer,
  WeekUsageContainer,
  Week,
  Text,
  TotalTime,
  TimeText,
  TimeTable,
  Time,
  Context,
};

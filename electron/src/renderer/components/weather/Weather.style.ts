import styled, { css } from 'styled-components';

const WarpperVideo = styled.video`
  width: 100%;
  height: 100%;
  position: absolute;
  right: 1px;
  object-fit: cover;
  z-index: 0;
`;

const Warpper = styled.div`
  width: 100%;
`;

const SpaceAround = styled.div`
  color: white;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-family: GmarketSansTTFBold;
`;
const LeftAround = styled.div`
  margin-left: 20px;
  span {
    font-size: 70px;
    font-family: GmarketSansTTFBold;
  }
  z-index: 1;
`;
const WeatherCard = styled.div`
  font-family: GmarketSansTTFBold;
  border-radius: 10px;
  background-color: rgba(48, 107, 121, 0.4);
  overflow: auto;
  text-align: center;
  margin: auto;
  color: white;
  // padding: 4px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
`;

const CityName = styled.h2`
  font-size: 1.5em;
  margin-bottom: 15px;
`;

const WeatherIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const WeatherInfo = styled.div`
  display: flex;
  overflow-x: scroll;
  gap: 15px;
  align-items: center;
  z-index: 1;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 10px;
  ${(props) =>
    props.blur &&
    css`
      background-color: rgba(12, 123, 123, 0.3);
      backdrop-filter: blur(2px);
    `};
  span {
    font-size: 0.9em;
    margin-bottom: 10px;
  }
  div {
    z-index: 2;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
const RightAround = styled.div`
  padding-right: 10px;
  justify-content: center;
  text-align: right;
  font-size: 14px;
  z-index: 1;
`;

const OtherDayWeather = styled.div`
  margin-top: 40px;
  color: white;
  font-family: GmarketSansTTFBold;
  border-radius: 10px;
  overflow: auto;
  text-align: center;
  margin-top: 20px;
  color: white;
  padding: 10px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
  div {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  width: 100%;
  height: 100%;

  ${(props) =>
    props.blur &&
    css`
      background-color: rgba(12, 123, 123, 0.3);
      backdrop-filter: blur(2px);
    `};
`;

const OtherWeatherIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const MinTemp = styled.div`
  color: white;
`;
const MaxTemp = styled.div`
  display: flex;
  justify-content: right;
`;

const OtherWeaterDiv = styled.div`
  height: 30px;
  &>div{
    &:nth-child(1){
      width:20%;
    }
    &:nth-child(2){
      width:50%;
    }
    &:nth-child(3){
      width:10%;
    }
    &:nth-child(4) {
      width:30%:
    }
    &:nth-child(5) {
      width:20%;
    }
`;

type BarType = {
  totalMin: string;
  totalMax: string;
};

const BarWrapper = styled.div`
  width: 100%;
  height: 6px;
  display: block !important;
  background-color: rgba(138, 136, 137, 0.3);
  border-radius: 60px;
`;

const LocalBar = styled.div<BarType>`
  position: relative;
  left: ${(props) => {
    return props.totalMin;
  }};
  width: ${(props) => {
    return props.totalMax;
  }};
  height: 6px;
  border-radius: 60px;
  background: ${(props) => {
    const { totalMin, totalMax } = props;
    const percentage = parseFloat(totalMin) + parseFloat(totalMax);
    if (percentage > 90) {
      return `linear-gradient(to right, #72bff5 ${40}%, #8bd2c9 ${70}%, #a4d2b3 ${20}%, #bed199)`;
    }
    return `linear-gradient(to right, #72bff5 ${40}%, #77c5f5 ${70}%, #7fcddc ${20}%, #7fcddc)`;
  }};
`;
export {
  WeatherCard,
  WeatherIcon,
  WeatherInfo,
  CityName,
  Warpper,
  SpaceAround,
  LeftAround,
  RightAround,
  OtherDayWeather,
  OtherWeatherIcon,
  MinTemp,
  MaxTemp,
  OtherWeaterDiv,
  BarWrapper,
  LocalBar,
  WarpperVideo,
};

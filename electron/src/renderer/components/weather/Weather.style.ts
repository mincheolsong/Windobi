import styled from 'styled-components';
const weatherUrl = 'https://images.unsplash.com/photo-1601352209555-489a72668fda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fCVFQSVCNSVBQyVFQiVBNiU4NHxlbnwwfHwwfHx8MA%3D%3D';


const Warpper = styled.div`
  background-image: url(${weatherUrl});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
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
  span{
    font-size: 70px;
    font-family: GmarketSansTTFBold;
  }
`;
const WeatherCard = styled.div`

  font-family: GmarketSansTTFBold;
  border-radius: 10px;
  background-color: rgba(48, 107, 121, 0.4);
  overflow: auto;
  text-align: center;
  margin: auto;
  color: white;
  padding: 10px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
`;

const CityName = styled.h2`
  font-size: 1.5em;
  margin-bottom: 15px;
`;

const WeatherIcon = styled.img`
  width: 50px;
  height: 50px;
  content: right;
`;

const WeatherInfo = styled.div`
  display: flex;
  overflow-x: scroll;
  // flex-direction: row;
  // justify-content: center;
  gap: 15px;
  align-items: center;
  span {
    font-size: 0.9em;
    margin-bottom: 10px;
  }
  &::-webkit-scrollbar{
    display: none;
  }
`;
const RightAround = styled.div`
  padding-right: 10px;
  justify-content: center;
  text-align: right;
  font-size: 14px;
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
};

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
  background: transparent;
  font-family: GmarketSansTTFBold;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  max-width: 300px;
  margin: auto;
  color: white;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transition: all 0.1s linear;
    transform: scale(1.1);
  }
`;

const CityName = styled.h2`
  font-size: 1.5em;
  margin-bottom: 15px;
`;

const WeatherIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
`;

const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 0.9em;
    margin-bottom: 10px;
  }
`;

export {
  WeatherCard,
  WeatherIcon,
  WeatherInfo,
  CityName,
  Warpper,
  SpaceAround,
  LeftAround,
};

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as S from '../components/weather/Weather.style';
import { ReactComponent as Svg } from '../../../assets/nearme.svg';
function Weather() {
  const [weather, setWeather] = useState({
    today_Day_String: '',
    today_Day_Number: '',
    today_Day_Month: '',
    today_Day_Year: '',
    today_Sunrise: '',
    today_Sunset: '',
    today_Max_Temp: 0,
    today_Min_Temp: 0,
    cityName: '',
    list: [],
    loading: true,
  });
  useEffect(() => {
    const apiKey = '2d7be5022ea1fcb5d5be566f85371efc';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=36.10&lon=128.41&appid=${apiKey}`;
    axios
      .get(url)
      .then((responseData) => {
        console.log(responseData);
        const data = responseData.data;
        let now_date = new Date();
        setWeather(w => {
          return {
            ...w,
            cityName: data.city.name,
            today_Sunrise: new Date(data.city.sunrise * 1000).toTimeString().substring(0, 8),
            today_Sunset: new Date(data.city.sunset * 1000).toTimeString().substring(0, 8),
            list: data.list.filter(ls => ls.dt * 1000 >= now_date.getTime()),
          };
        });
        const curDate = new Date(data.list[0].dt * 1000);
        const curUtcDate = curDate.toUTCString();
        let maxTemp = 0;
        let minTemp = 999;

        for( let temp of data.list){
          let tempDate = new Date(temp.dt * 1000);
          if(tempDate.getDay() != now_date.getDay()){
            console.log(tempDate.getDay(), now_date.getDay());
            break;
          }
          if(maxTemp < temp.main.temp){
            maxTemp = temp.main.temp;
          }
          if(minTemp > temp.main.temp){
            minTemp = temp.main.temp;
          }
        }


        console.log(maxTemp, minTemp);
        setWeather(w => {
          return {
            ...w,
            today_Day_String: curUtcDate.substring(0,3),
            today_Day_Number: curUtcDate.substring(5,7),
            today_Day_Month: curUtcDate.substring(8,11),
            today_Day_Year: curUtcDate.substring(12,16),
            today_Max_Temp: maxTemp,
            today_Min_Temp: minTemp,
            loading: false,
          };
        });
      })
      .catch((error) => console.log(error));


    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 500,
    });
  }, []);

  console.log(weather);

  const imgSrc = `https://openweathermap.org/img/w/${weather.icon}.png`;
  if (weather.loading) {
    return <div>Loading...</div>;
  }
  return (
    <S.Warpper>
      <S.SpaceAround>
        <S.LeftAround>
          <S.CityName>서울특별시<Svg fill='white'/></S.CityName>
          <span>7˚</span>
          <div>최고: {(weather.today_Max_Temp - 273.12).toFixed(0)}˚ 최저: {(weather.today_Min_Temp - 273.12).toFixed(0)}˚</div>
        </S.LeftAround>
        <div>
          날씨 정보
        </div>
      </S.SpaceAround>
      <S.WeatherCard>
        <S.WeatherIcon src={imgSrc} alt="weather icon" />
        <S.WeatherInfo>
          {weather.list.slice(0, 5).map((info) => (
            <div key={info.dt_txt}>
              <span>안녕하세요</span>
              <span>{info.main.temp}</span>
              <span>{info.main.feels_like}</span>
              <span>{info.main.temp_min}</span>
              <span>{info.main.temp_max}</span>
              <span>시간{info.dt}</span>
              <span>ㅇ러니러ㅣ{weather.list[0].dt}</span>
              <span>오늘 최고 온도 {weather.today_Max_Temp}</span>
              <span>오늘 최저 온도 {weather.today_Min_Temp}</span>
              <span>
                {weather.today_Day_Year}년 | {weather.today_Day_Month} |{' '}
                {weather.today_Day_String} |
              </span>
            </div>
          ))}
        </S.WeatherInfo>
      </S.WeatherCard>
    </S.Warpper>
  );
}

export default Weather;

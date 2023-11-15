/* eslint-disable promise/valid-params */
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as S from '../components/weather/Weather.style';
import { ReactComponent as Svg } from '../../../assets/nearme.svg';

function Weather() {
  const scrollRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState();

  const onDragStart = (e) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };
  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e) => {
    if (isDrag) {
      scrollRef.current.scrollLeft = startX - e.pageX;
    }
  };
  const throttle = (func, ms) => {
    let throttled = false;
    return (...args) => {
      if (!throttled) {
        throttled = true;
        setTimeout(() => {
          func(...args);
          throttled = false;
        }, ms);
      }
    };
  };
  const delay = 10;
  const onThrottleDragMove = throttle(onDragMove, delay);

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
  const [icon, setIcon] = useState({
    '01n': '',
    '02n': '',
    '03n': '',
    '04n': '',
    '09n': '',
    '10n': '',
    '11n': '',
    '13n': '',
    '50n': '',
    '02d': '',
    '01d': '',
    '03d': '',
    '04d': '',
    '09d': '',
    '10d': '',
    '11d': '',
    '13d': '',
    '50d': '',
  });
  const [description, SetDescription] = useState({
    'broken clouds': '대체로 흐림',
    'light rain': '비',
    'scattered clouds': '한 때 흐림',
    'clear sky': '청명함',
  });
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('windowOpened');
    const apiKey = '2d7be5022ea1fcb5d5be566f85371efc';
    window.electron.ipcRenderer.invoke('weatherHandler').then((response) => {
      setIcon(response);
    });
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=36.10&lon=128.41&appid=${apiKey}`;
    axios
      .get(url)
      .then((responseData) => {
        const { data } = responseData;
        const nowDate = new Date();
        setWeather((w) => {
          return {
            ...w,
            cityName: data.city.name,
            today_Sunrise: new Date(data.city.sunrise * 1000)
              .toTimeString()
              .substring(0, 8),
            today_Sunset: new Date(data.city.sunset * 1000)
              .toTimeString()
              .substring(0, 8),
            list: data.list,
          };
        });
        let maxTemp = 0;
        let minTemp = 999;
        for (const temp of data.list) {
          const tempDate = new Date(temp.dt * 1000);
          if (tempDate.getDay() != nowDate.getDay()) {
            if (maxTemp < temp.main.temp) {
              maxTemp = temp.main.temp;
            }
            if (minTemp > temp.main.temp) {
              minTemp = temp.main.temp;
            }
            break;
          }
          if (maxTemp < temp.main.temp) {
            maxTemp = temp.main.temp;
          }
          if (minTemp > temp.main.temp) {
            minTemp = temp.main.temp;
          }
        }
        setWeather((w) => {
          return {
            ...w,
            today_Day_String: nowDate.toString().substring(0, 3),
            today_Day_Number: nowDate.toString().substring(8, 10),
            today_Day_Month: nowDate.toLocaleString().substring(6, 8),
            today_Day_Year: nowDate.toString().substring(11, 15),
            today_Max_Temp: maxTemp,
            today_Min_Temp: minTemp,
            loading: false,
          };
        });
      })
      .catch();

    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 500,
    });
  }, []);
  if (weather.loading) {
    return <div>Loading...</div>;
  }
  return (
    <S.Warpper>
      <S.SpaceAround>
        <S.LeftAround>
          <S.CityName>
            {weather.cityName}
            <Svg fill="white" />
          </S.CityName>
          <span>{(weather.list[0].main.temp - 273.15).toFixed(0)}˚</span>
        </S.LeftAround>
        <S.RightAround>
          <div>
            {weather.today_Day_Month}월 {weather.today_Day_Number}일(
            {weather.today_Day_String})
          </div>
          <S.WeatherIcon
            src={`data:image/png;base64,${
              icon[weather.list[0].weather[0].icon]
            }`}
            alter="아이콘"
          />
          <div>{description[weather.list[0].weather[0].description]}</div>
          <div>
            최고: {(weather.today_Max_Temp - 273.15).toFixed(0)}˚ 최저:{' '}
            {(weather.today_Min_Temp - 273.15).toFixed(0)}˚
          </div>
        </S.RightAround>
      </S.SpaceAround>
      <S.WeatherCard>
        <S.WeatherInfo
          className="weatherInfos"
          onMouseDown={onDragStart}
          onMouseMove={isDrag ? onThrottleDragMove : null}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          ref={scrollRef}
        >
          {weather.list.slice(0, 20).map((info, index) => (
            <div key={index}>
              {/* <span>{index}</span> */}
              <span>{new Date(info.dt * 1000).getHours()}시</span>
              <S.WeatherIcon
                src={`data:image/png;base64,${icon[info.weather[0].icon]}`}
                alt="weather icon"
              />
              <span>{(info.main.temp - 273.15).toFixed(0)}˚</span>
            </div>
          ))}
        </S.WeatherInfo>
      </S.WeatherCard>
    </S.Warpper>
  );
}
export default Weather;

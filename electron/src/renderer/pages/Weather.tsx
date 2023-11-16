import { useEffect, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import * as S from '../components/weather/Weather.style';
import { ReactComponent as Svg } from '../../../assets/nearme.svg';
import n01 from '../../../assets/weather/01n.png';
import n02 from '../../../assets/weather/02n.png';
import n03 from '../../../assets/weather/03n.png';
import n09 from '../../../assets/weather/09n.png';
import n10 from '../../../assets/weather/10n.png';
import n04 from '../../../assets/weather/04n.png';
import n11 from '../../../assets/weather/11n.png';
import n13 from '../../../assets/weather/13n.png';
import n50 from '../../../assets/weather/50n.png';
import d02 from '../../../assets/weather/02d.png';
import d01 from '../../../assets/weather/01d.png';
import d03 from '../../../assets/weather/03d.png';
import d04 from '../../../assets/weather/04d.png';
import d09 from '../../../assets/weather/09d.png';
import d10 from '../../../assets/weather/10d.png';
import d11 from '../../../assets/weather/11d.png';
import d13 from '../../../assets/weather/13d.png';
import d50 from '../../../assets/weather/50d.png';

const weather_day = [
  'https://cdn.pixabay.com/vimeo/744370687/129455.mp4?width=1280&hash=fbd3fa4086d853cd82d7d62a4918596b24d55a3d',
  'https://cdn.pixabay.com/vimeo/744370633/129430.mp4?width=1280&hash=a033b8472fd319ae60dd1223517b47c371917764',
  'https://cdn.pixabay.com/vimeo/814061538/157138.mp4?width=1280&hash=c344658c0c893703d8a84e310608fc9063a23324',
  'https://cdn.pixabay.com/vimeo/857365376/177315.mp4?width=720&hash=c4f028cd7fee661268152336146a562342e41e19',
  'https://cdn.pixabay.com/vimeo/724697137/121375.mp4?width=360&hash=5eeaa27933e89a042d1e50e243f2fdeebb79f705',
  'https://cdn.pixabay.com/vimeo/718539594/119567.mp4?width=1280&hash=b0e5ed27d3158479f7cbddce41f09399a0e35271',
];
const weather_night = [
  'https://cdn.pixabay.com/vimeo/197634410/6962.mp4?width=640&hash=8298bf1417914b880913a81d749041ce24617b02',
  'https://cdn.pixabay.com/vimeo/166335905/3134.mp4?width=640&hash=f9b903bc617ff90f6fe42d094188cff72f8bba22',
  'https://cdn.pixabay.com/vimeo/865412856/10339.mp4?width=540&hash=b896e792ac504ea4dfcc64403103aac523947b0c',
  'https://cdn.pixabay.com/vimeo/305283555/19799.mp4?width=640&hash=cc4c3080ea9d9527d907c9ccf318af5673c560eb',
  'https://cdn.pixabay.com/vimeo/380473720/30154.mp4?width=1280&hash=207d4b82c4035214ab2ae3e986e1dcd4059810cb',
  'https://cdn.pixabay.com/vimeo/796690941/149629.mp4?width=640&hash=56a616733be5a6b749ba80317339f5fec54d5489',
];

const nowDate = new Date();
const numberToDay = ['일', '월', '화', '수', '목', '금', '토'];
type TData = {
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    sunrise: number;
    sunset: number;
  };
  list: Array<TWeather>;
};

type TWeather = {
  dt: number;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: Icon;
  }>;
};
type Icon =
  | '01n'
  | '02n'
  | '03n'
  | '09n'
  | '10n'
  | '04n'
  | '11n'
  | '13n'
  | '50n'
  | '02d'
  | '01d'
  | '03d'
  | '04d'
  | '09d'
  | '10d'
  | '11d'
  | '13d'
  | '50d';

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
  const delay = 5;
  const onThrottleDragMove = throttle(onDragMove, delay);
  type TotherDate = {
    today_Day_String: string;
    today_Day_Number: string;
    today_Day_Month: string;
    today_Day_Year: string;
    today_Sunrise: string;
    today_Sunset: string;
    total_Max_Temp: number;
    total_Min_Temp: number;
    today_Max_Temp: number;
    today_Min_Temp: number;
    otherDate: Array<{
      min: number;
      max: number;
      day: string;
    }>;
    cityName: string;
    list: Array<{
      dt: number;
      main: Array<{
        temp: number;
      }>;
      weather: Array<{
        icon: string;
        description: string;
      }>;
    }>;
    loading: boolean;
  };
  const [weather, setWeather] = useState<TotherDate>({
    today_Day_String: '',
    today_Day_Number: '',
    today_Day_Month: '',
    today_Day_Year: '',
    today_Sunrise: '',
    today_Sunset: '',
    total_Max_Temp: 0,
    total_Min_Temp: 0,
    today_Max_Temp: 0,
    today_Min_Temp: 0,
    cityName: '',
    list: [],
    loading: true,
    otherDate: [],
  });
  const icon = {
    '01n': n01,
    '02n': n02,
    '03n': n03,
    '09n': n09,
    '10n': n10,
    '04n': n04,
    '11n': n11,
    '13n': n13,
    '50n': n50,
    '02d': d02,
    '01d': d01,
    '03d': d03,
    '04d': d04,
    '09d': d09,
    '10d': d10,
    '11d': d11,
    '13d': d13,
    '50d': d50,
  };
  const [description, SetDescription] = useState({
    'broken clouds': '대체로 흐림',
    'light rain': '비',
    'scattered clouds': '한 때 흐림',
    'clear sky': '청명함',
  });

  useEffect(() => {
    const apiKey = '2d7be5022ea1fcb5d5be566f85371efc';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=36.10&lon=128.41&appid=${apiKey}`;
    axios
      .get(url)
      .then((responseData: AxiosResponse<TData, any>) => {
        const {data} = responseData;
        setWeather(w => {
          return {
            ...w,
            cityName: data.city.name,
            today_Sunrise: new Date(data.city.sunrise * 1000).toTimeString().substring(0, 8),
            today_Sunset: new Date(data.city.sunset * 1000).toTimeString().substring(0, 8),
            list: data.list,
          };
        });
        let maxTemp = 0;
        let minTemp = 999;
        for (const object of data.list) {
          maxTemp = Math.max(maxTemp, Number.parseInt((object.main.temp - 273.15).toFixed(0), 10));
          minTemp = Math.min(minTemp, Number.parseInt((object.main.temp - 273.15).toFixed(0), 10));
        }
        console.log(maxTemp, minTemp);
        const getDay = (dt: number): string => {
          return numberToDay[new Date(dt * 1000).getDay()];
        };
        const getHour = (dt: number): number => {
          return new Date(dt * 1000).getHours();
        };
        const tempList = [];
        tempList.push({
          day: getDay(data.list[0].dt),
          min: (data.list[0].main.temp - 273.15).toFixed(0),
          max: (data.list[0].main.temp - 273.15).toFixed(0),
          icon: data.list[0].weather[0].icon,
        });
        let todayMaxTemp = -999;
        let todayMinTemp = 999;
        for (const obj of data.list) {
          if (numberToDay[nowDate.getDay()] === getDay(obj.dt)) {
             todayMaxTemp = Math.max(todayMaxTemp, (obj.main.temp - 273.15).toFixed(0));
             todayMinTemp = Math.min(todayMinTemp, (obj.main.temp - 273.15).toFixed(0));
          }
          if (tempList[tempList.length - 1].day === getDay(obj.dt)) {
              tempList[tempList.length - 1].max = Math.max(tempList[tempList.length - 1].max, (obj.main.temp-273.15).toFixed(0));
              tempList[tempList.length - 1].min = Math.min(tempList[tempList.length - 1].min, (obj.main.temp - 273.15).toFixed(0));
              if (getHour(obj.dt) == 12) {
                tempList[tempList.length - 1].icon = obj.weather[0].icon;
              }
          } else {
            tempList.push({
              day: getDay(obj.dt),
              min: (obj.main.temp - 273.15).toFixed(0),
              max: (obj.main.temp - 273.15).toFixed(0),
              icon: obj.weather[0].icon,
            });
          }
          // 최고 최저
        }
        tempList[0].day = '오늘';
        setWeather(w => {
          return {
            ...w,
            today_Day_String: nowDate.toString().substring(0, 3),
            today_Day_Number: nowDate.toString().substring(8, 10),
            today_Day_Month: nowDate.toLocaleString().substring(6, 8),
            today_Day_Year: nowDate.toString().substring(11, 15),
            total_Max_Temp: maxTemp,
            total_Min_Temp: minTemp,
            otherDate: tempList,
            today_Max_Temp: todayMaxTemp,
            today_Min_Temp: todayMinTemp,
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
  if (weather.loading) {
    return <div>Loading...</div>;
  }
  return (
    <S.Warpper>
      {nowDate.getHours() >= 18 || nowDate.getHours() <= 6 ? (
        <S.WarpperVideo autoPlay muted loop>
          <source
            src={
              weather_night[Math.floor(Math.random() * weather_night.length)]
            }
            type="video/mp4"
          />
        </S.WarpperVideo>
      ) : (
        <S.WarpperVideo autoPlay muted loop>
          <source
            src={weather_day[Math.floor(Math.random() * weather_day.length)]}
            type="video/mp4"
          />
        </S.WarpperVideo>
      )}
      {/* <S.WarpperVideo autoPlay muted loop>
        <source src={sky} type="video/mp4" />
      </S.WarpperVideo> */}
        <S.SpaceAround>
          <S.LeftAround>
            <S.CityName>{weather.cityName}<Svg fill='white'/></S.CityName>
            <span>{(weather.list[0].main.temp - 273.15).toFixed(0)}˚</span>
          </S.LeftAround>
          <S.RightAround>
            <div>{weather.today_Day_Month}월 {weather.today_Day_Number}일({weather.today_Day_String})</div>
            <S.WeatherIcon src={icon[weather.list[0].weather[0].icon]} alter = '아이콘'/>
            <div>{description[weather.list[0].weather[0].description]}</div>
            <div>
              최고: {weather.today_Max_Temp}˚ 최저: {weather.today_Min_Temp}˚
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
            blur={true}
          >
            {weather.list.slice(0, 20).map((info, index) => (
              <div key={index} >
                <span>{new Date(info.dt * 1000).getHours()}시</span>
                <S.WeatherIcon
                  src={icon[info.weather[0].icon]}
                  alt="weather icon"
                />
                <span>{(info.main.temp - 273.15).toFixed(0)}˚</span>
              </div>
            ))}
          </S.WeatherInfo>
        </S.WeatherCard>
        <S.OtherDayWeather blur={true}>
          {weather.otherDate.map((others) => (
            <S.OtherWeaterDiv>
              <div>{others.day}</div>
              <div><S.OtherWeatherIcon src={icon[others.icon]}/></div>
              <S.MinTemp>{others.min}˚</S.MinTemp>
              <TempBar
                minTemp={weather.total_Min_Temp}
                maxTemp={weather.total_Max_Temp}
                LocalMaxTemp={others.max}
                LocalMinTemp={others.min}
              />
              <div>{others.max}˚</div>
            </S.OtherWeaterDiv>
          ))}
        </S.OtherDayWeather>
        <div>
        {location.loaded
        ? JSON.stringify(location)
        : 'Location data not available yet.'}
        </div>
    </S.Warpper>
  );
}
export default Weather;

type TTempBar = {
  minTemp: number;
  maxTemp: number;
  LocalMinTemp: number;
  LocalMaxTemp: number;
};

function TempBar({ minTemp, maxTemp, LocalMinTemp, LocalMaxTemp }: TTempBar) {
  const length = maxTemp - minTemp;
  const LocalLength = LocalMaxTemp - LocalMinTemp;
  console.log(`전체중 몇 퍼센트인지 : ${((LocalLength / length) * 100).toFixed(2)}%`);
  console.log(`어디부터 시작하는지 : ${(((LocalMinTemp - minTemp) / maxTemp) * 100).toFixed(2)}%`);
  console.log(length, LocalMinTemp, minTemp);
  return (
    <S.BarWrapper>
      <S.LocalBar
        totalMax={`${((LocalLength / length) * 100).toFixed(2)}%`}
        totalMin={`${(((LocalMinTemp - minTemp) / length) * 100).toFixed(2)}%`}
      />
    </S.BarWrapper>
  );
}

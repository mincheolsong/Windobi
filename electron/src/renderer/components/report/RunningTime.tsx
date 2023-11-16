import * as S from './Report.style';

function RunningTime(props: { day: Array<any> }) {
  console.log("day:", props.day);
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dateString = props.day[0].day.toString();
  const year = parseInt(dateString.substr(0, 4));
  const month = parseInt(dateString.substr(4, 2)) - 1; // 월은 0부터 시작하므로 1을 빼줌
  const day = parseInt(dateString.substr(6, 2));

  const date = new Date(year, month, day);

  // Date 객체에서 getDay() 메서드를 사용하여 요일을 얻음 (0은 일요일, 1은 월요일, ..., 6은 토요일)
  const dayIndex = date.getDay();

  // 배열에서 해당하는 요일 문자열을 가져옴
  const dayOfWeek = daysOfWeek[dayIndex];

  return (
    <S.Days>
      {
        props.day.map((h)=> (
          <S.DayComponent hour={h.activeTime} key={h.hour} order={h.hour}></S.DayComponent>
          ))

      }
      <S.Week>{dayOfWeek}</S.Week>
    </S.Days>
  );
}

export default RunningTime;

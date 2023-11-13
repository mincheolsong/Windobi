const timeToString = (time: number): string => {
  const hour = Math.floor(time / 3600);
  const minute = Math.ceil((time % 3600) / 60);

  let timeString = '';
  timeString = timeString.concat(hour > 0 ? `${hour}시간` : '');
  timeString = timeString.concat(`${minute}분`);

  return timeString;
};

export { timeToString };

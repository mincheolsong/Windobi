// import { styled } from 'styled-components';
import icon1 from '../../../../assets/character/chungmyeong/shime2.png';
import icon2 from '../../../../assets/character/chungmyeong/shime3.png';

function CharacterImg() {
  return (
    <img width="100" alt="icon" src={icon2} />
  );
}

let flag = true;
setInterval(() => {
  const image: HTMLImageElement | null = document.querySelector('img');
  if (image) {
    if (flag) {
      image.src = icon1;
    } else {
      image.src = icon2;
    }
  }
  flag = !flag;
}, 400);

export default CharacterImg;

// 방향 전환
// image.style.transform = `scaleX(-1)`;
// image.style.transform = `scaleX(1)`;

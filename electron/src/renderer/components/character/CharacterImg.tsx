/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import { useEffect } from 'react';
import stopImg from '../../../../assets/character/chungmyeong/shime1.png';
import left1 from '../../../../assets/character/chungmyeong/shime2.png';
import left2 from '../../../../assets/character/chungmyeong/shime3.png';
import up1 from '../../../../assets/character/chungmyeong/shime13.png';
import up2 from '../../../../assets/character/chungmyeong/shime14.png';
import down1 from '../../../../assets/character/chungmyeong/shime5.png';
import down2 from '../../../../assets/character/chungmyeong/shime6.png';
import down3 from '../../../../assets/character/chungmyeong/shime4.png';

function CharacterImg() {
  let animation: any = null;
  let image: HTMLImageElement | null = null;
  let flag = true;

  function left() {
    if (image) {
      image.src = flag ? left1 : left2;
      flag = !flag;
      image.style.transform = `scaleX(1)`;
    }
  }

  function right() {
    if (image) {
      image.src = flag ? left1 : left2;
      flag = !flag;
      image.style.transform = `scaleX(-1)`;
    }
  }

  function stop() {
    if (image) {
      image.src = stopImg;
    }
  }

  function up() {
    if (image) {
      image.src = flag ? up1 : up2;
      flag = !flag;
      // image.style.transform = `scaleX(-1)`;
    }
  }
  function down() {
    if (image) {
      image.src = flag ? down1 : down2;
      flag = !flag;
    }
  }
  function downsleep() {
    if (image) {
      image.src = down3;
    }
  }
  // 이미지 태그가 바꼈을 때 한번만 실행
  useEffect(() => {
    image = document.querySelector('img');
    animation = setInterval(stop, 300);
  }, []);

  window.electron.ipcRenderer.on('character-move', (value: any) => {
    clearInterval(animation);
    switch (value) {
      case 'left':
        animation = setInterval(left, 300);
        break;
      case 'right':
        animation = setInterval(right, 300);
        break;
      case 'stop':
        animation = setInterval(stop, 300);
        break;
      case 'up':
        animation = setInterval(up, 300);
        break;
      case 'down':
        animation = setInterval(down, 300);
        break;
      case 'downsleep':
        animation = setInterval(downsleep, 300);
        break;
    }
  });

  return <img width="100" alt="icon" src={stopImg} />;
}

export default CharacterImg;

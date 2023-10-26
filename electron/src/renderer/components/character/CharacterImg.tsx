import { useEffect } from 'react';
import stopImg from '../../../../assets/character/chungmyeong/shime1.png';
import left1 from '../../../../assets/character/chungmyeong/shime2.png';
import left2 from '../../../../assets/character/chungmyeong/shime3.png';

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

  useEffect(() => {
    image = document.querySelector('img');
    animation = setInterval(stop, 400);
    console.log('animation : ', animation);
  }, []);

  window.electron.ipcRenderer.on('character-move', (value: any) => {
    // value : direction
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
    }
  });

  return <img width="100" alt="icon" src={stopImg} />;
}

// window.electron.ipcRenderer.on('character-move', (value: any) => {
//   // value : direction
//   console.log('변화!!', value);
//   console.log('animation : ', animation);
//   clearInterval(animation);
//   switch (direction) {
//     case 'left':
//       animation = setInterval(left, 400);
//       break;
//     case 'right':
//       animation = setInterval(right, 400);
//       break;
//     case 'stop':
//       animation = setInterval(stop, 400);
//       break;
//   }
// });
// 방향 전환
// image.style.transform = `scaleX(-1)`;
// image.style.transform = `scaleX(1)`;

export default CharacterImg;

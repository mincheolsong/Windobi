import { useState } from 'react';
import stop from '../../../../assets/character/chungmyeong/shime1.png';
import left1 from '../../../../assets/character/chungmyeong/shime2.png';
import left2 from '../../../../assets/character/chungmyeong/shime3.png';


function CharacterImg() {
  const image: HTMLImageElement | null = document.querySelector('img');
  const [direction, setDirection] = useState('left');
  let flag = true;

  setInterval(() => {
    console.log("방향: ", direction);
    switch (direction) {
      case 'left':
        if (image) {
          image.src = flag ? left1 : left2;
          // image.style.transform = `scaleX(1)`;
          flag = !flag;
        }
        break;
      case 'right':
        if (image) {
          image.src = flag ? left1 : left2;
          // image.style.transform = `scaleX(-1)`
          flag = !flag;
        }
        break;
      case 'stop':
        if(image) {
          image.src = stop;
        }
        break;
    }
  }, 400);

  window.electron.ipcRenderer.on('character-move', (value: any) => {
    // value : direction
    setDirection(value);
  });

  return <img width="100" alt="icon" src={stop} />;
}

export default CharacterImg;

// 방향 전환
// image.style.transform = `scaleX(-1)`;
// image.style.transform = `scaleX(1)`;
// setInterval(() => {

//   switch(direction){
//     case "left":
//       if (image) {
//         if (flag) {
//           image.src = left1;
//         } else {
//           image.src = left2;
//         }
//         image.style.transform = `scaleX(1)`
//         flag = !flag;
//       }
//       break;
//     case "right":
//       if(image) {
//         if (flag) {
//           image.src = left1;
//         } else {
//           image.src = left2;
//         }

//         flag = !flag;
//       }
//       break;
//     case "stop":
//       break;
//   }

// }, 400);

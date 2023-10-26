import { useEffect } from 'react';
import stopImg from '../../../../assets/character/chungmyeong/shime1.png';
import left1 from '../../../../assets/character/chungmyeong/shime2.png';
import left2 from '../../../../assets/character/chungmyeong/shime3.png';
import up1  from '../../../../assets/character/chungmyeong/shime13.png';
import up2  from '../../../../assets/character/chungmyeong/shime14.png';

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


  useEffect(() => {
    image = document.querySelector('img');
    animation = setInterval(stop, 300);
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
      case 'up':
        animation = setInterval(up, 300);
        break;
    }
  });

  return <img width="100" alt="icon" src={stopImg} />;
}


export default CharacterImg;

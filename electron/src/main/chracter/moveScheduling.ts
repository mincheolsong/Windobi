import { mainVariables } from '../windows';

const max = 3;
// const behavior = ['left', 'right', 'stop', 'up', 'down']; // 현재 2까지 사용


function moveScheduling() {
  const { character } = mainVariables;
  let flag = true;
  const flag2 = character.fallTrigger;
  while (flag && !flag2) {
    const rand = Math.floor(Math.random() * max);
    // rand값에 따라 (0,1,2) 멈추거나(2) 오른쪽가거나(1) 왼쪽으로 가기(0)
    switch (rand) {
      case 0:
        if (character.curX > 0) {
          // 왼쪽 벽을 안넘어간 경우
          flag = false;
          if (character.direction !== 'left') character.transition = true;
          character.direction = 'left';
        }
        break;
      case 1:
        if (character.curX < character.maxWidth - character.winWidth) {
          // 오른쪽 벽을 안넘긴 경우
          flag = false;
          if (character.direction !== 'right') character.transition = true;
          character.direction = 'right';
        }
        break;
      case 2:
        // 이미지2개 번갈아가면서 띄우기
        flag = false;
        if (character.direction !== 'stop') character.transition = true;
        character.direction = 'stop';
        break;
    }
  }
}

export default moveScheduling;

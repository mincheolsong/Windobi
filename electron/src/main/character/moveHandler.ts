import { mainVariables, mainWindow } from '../windows';
import moveScheduling from './moveScheduling';
import moving from './moving';

const { curX, curY, winHeight, winWidth } = mainVariables.character;

const moveHandler = () => {
  // 초기위치 지정
  mainWindow.setBounds({
    x: curX,
    y: curY,
    width: winWidth,
    height: winHeight,
  });

  // 이동 시작
  mainVariables.characterMoveId = setInterval(moving, 30, mainVariables.character);
  mainVariables.scheduleId = setInterval(moveScheduling, 2000); // 스케줄링 시작
};

export default moveHandler;

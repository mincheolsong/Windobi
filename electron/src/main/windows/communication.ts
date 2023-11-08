import { throttle, delay } from 'lodash';
import { ipcMain } from 'electron';
import mainWindow from './main';
import {
  mainVariables,
  menuVariables,
  menuWindow,
  subVariables,
  subWindow,
} from '.';

type Area = 1 | 2 | 3 | 4;

const halfDisplay = {
  width: mainVariables.primaryDisplay.bounds.width / 2,
  height: mainVariables.primaryDisplay.bounds.height / 2,
};

const INTER_SECOND = 5;
const REFRESH_TIME = 250;
const MAX_TICK = REFRESH_TIME / INTER_SECOND;

// 메인윈도우가 어느 사분면에 있는지 확인
const getArea = (): Area => {
  const { x, y, width, height } = mainWindow.getBounds();

  const windowCenter = {
    x: x + width / 2,
    y: y + height / 2,
  };

  // 1사분면
  if (
    windowCenter.x > halfDisplay.width &&
    windowCenter.y < halfDisplay.height
  ) {
    return 1;
  }
  // 2사분면
  if (
    windowCenter.x <= halfDisplay.width &&
    windowCenter.y < halfDisplay.height
  ) {
    return 2;
  }
  // 3사분면
  if (
    windowCenter.x <= halfDisplay.width &&
    windowCenter.y >= halfDisplay.height
  ) {
    return 3;
  }
  // 4사분면
  if (
    windowCenter.x > halfDisplay.width &&
    windowCenter.y >= halfDisplay.height
  ) {
    return 4;
  }

  return 1;
};

// 메인윈도우와 서브 윈도우의 위치로부터 서브 윈도우의 위치를 반환
const nextPosition = () => {
  const area = getArea();

  const { x: mainX, y: mainY } = mainWindow.getBounds();
  const { width: mainWidth, height: mainHeight } = mainVariables;

  const { width: subWidth, height: subHeight } = subVariables;

  let afterX = 0;
  let afterY = 0;
  if (area === 1) {
    afterX = mainX - subWidth;
    afterY = mainY + mainHeight;
  } else if (area === 2) {
    afterX = mainX + mainWidth;
    afterY = mainY + mainHeight;
  } else if (area === 3) {
    afterX = mainX + mainWidth;
    afterY = mainY - subHeight;
  } else if (area === 4) {
    afterX = mainX - subWidth;
    afterY = mainY - subHeight;
  }

  return { afterX, afterY };
};

// 서브 윈도우를 메인 윈도우에 맞게 이동
const moveSubWindow = throttle(() => {
  const { x: prevX, y: prevY } = subWindow.getBounds();
  const { width: subWidth, height: subHeight } = subVariables;

  const { afterX, afterY } = nextPosition();

  const update = (tick: number) => {
    const currX =
      prevX + Math.floor(((afterX - prevX) / MAX_TICK) * (tick + 1));
    const currY =
      prevY + Math.floor(((afterY - prevY) / MAX_TICK) * (tick + 1));

    subWindow.setBounds({
      x: currX,
      y: currY,
      width: subWidth,
      height: subHeight,
    });
  };

  for (let i = 1; i <= MAX_TICK; i += 1) {
    delay(update, INTER_SECOND * i, i);
  }
}, REFRESH_TIME);

// 메뉴 윈도우를 메인 윈도우에 맞게 이동
const moveMenuWindow = throttle(() => {
  const { x: mainX, y: mainY } = mainWindow.getBounds();
  const { width: mainWidth, height: mainHeight } = mainVariables;
  const { width: menuWidth, height: menuHeight } = menuVariables;

  menuWindow.setBounds({
    x: mainX - Math.floor(menuWidth / 2) + Math.floor(mainWidth / 2),
    y: mainY - Math.floor(menuHeight / 2) + Math.floor(mainHeight / 2),
    width: menuWidth,
    height: menuHeight,
  });
});

// 서브 윈도우의 boundary를 재설정
const onChangeSizeSub = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  subVariables.width = width;
  subVariables.height = height;

  const { afterX, afterY } = nextPosition();
  subWindow.setBounds({
    x: afterX,
    y: afterY,
    width: Math.max(width, 1),
    height: Math.max(height, 1),
  });
};

// 초기화 작업
const initialize = () => {
  // 메인 윈도우가 이동할때 발생
  mainWindow.on('move', () => {
    moveSubWindow();
    moveMenuWindow();
  });

  // 서브 윈도우의 사이즈가 바뀔 때 발생할 이벤트
  ipcMain.on('size', (_event, { width, height }) => {
    onChangeSizeSub({ width, height });
  });
};
export default initialize;

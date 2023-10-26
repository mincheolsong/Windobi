import { BrowserWindow, screen, ipcMain } from 'electron';
import { throttle, delay } from 'lodash';

type Area = 1 | 2 | 3 | 4;

let halfWidth = 0;
let halfHeight = 0;

let subWidth = 0;
let subHeight = 0;

let menuWidth = 100;
let menuHeight = 100;

const getArea = (main: BrowserWindow): Area => {
  const { x, y, width, height } = main.getBounds();

  const windowCenter = {
    x: x + width / 2,
    y: y + height / 2,
  };

  // 1사분면
  if (windowCenter.x > halfWidth && windowCenter.y < halfHeight) {
    return 1;
  }
  // 2사분면
  if (windowCenter.x <= halfWidth && windowCenter.y < halfHeight) {
    return 2;
  }
  // 3사분면
  if (windowCenter.x <= halfWidth && windowCenter.y >= halfHeight) {
    return 3;
  }
  // 4사분면
  if (windowCenter.x > halfWidth && windowCenter.y >= halfHeight) {
    return 4;
  }

  return 1;
};

const onMoveEvent = (main: BrowserWindow, sub: BrowserWindow) => {
  const INTER_SECOND = 5;
  const REFRESH_TIME = 250;
  const MAX_TICK = REFRESH_TIME / INTER_SECOND;

  const onChangeMove = throttle(() => {
    const {
      x: mainX,
      y: mainY,
      width: mainWidth,
      height: mainHeight,
    } = main.getBounds();

    const area = getArea(main);
    const { x: prevX, y: prevY } = sub.getBounds();

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

    const update = (tick: number) => {
      sub.setBounds({
        x: prevX + Math.floor(((afterX - prevX) / MAX_TICK) * (tick + 1)),
        y: prevY + Math.floor(((afterY - prevY) / MAX_TICK) * (tick + 1)),
        width: subWidth,
        height: subHeight,
      });
    };

    for (let i = 1; i <= MAX_TICK; i += 1) {
      delay(update, INTER_SECOND * i, i);
    }
  }, REFRESH_TIME);

  main.on('move', () => {
    onChangeMove();
    // setTimeout(() => {
    //   sub.setSize(subWidth, subHeight);
    // }, REFRESH_TIME);
  });
};

const interWindowCommunication = (main: BrowserWindow, sub: BrowserWindow) => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: displayWidth, height: displayHeight } =
    primaryDisplay.workAreaSize;

  subWidth = sub.getBounds().width;
  subHeight = sub.getBounds().height;

  halfWidth = displayWidth / 2;
  halfHeight = displayHeight / 2;

  onMoveEvent(main, sub);

  ipcMain.on('size', (event, arg) => {
    const { width, height } = arg;
    subWidth = width;
    subHeight = height;
    sub.setSize(subWidth, subHeight);
  });
};

const onMenuEvent = (main: BrowserWindow, menu: BrowserWindow) => {
  const INTER_SECOND = 5;
  const REFRESH_TIME = 10;
  const MAX_TICK = REFRESH_TIME / INTER_SECOND;

  const onChangeMove = throttle(() => {
    const {
      x: mainX,
      y: mainY,
      width: mainWidth,
      height: mainHeight,
    } = main.getBounds();

    const update = () => {
      menu.setBounds({
        x: mainX - Math.floor(menuWidth / 2) + Math.floor(mainWidth / 2),
        y: mainY - Math.floor(menuHeight / 2) + Math.floor(mainHeight / 2),
        width: menuWidth,
        height: menuHeight,
      });
    };

    for (let i = 1; i <= MAX_TICK; i += 1) {
      delay(update, INTER_SECOND * i, i);
    }
  }, REFRESH_TIME);

  main.on('move', () => {
    onChangeMove();
  });
};

const interMenuWindowCommunication = (
  main: BrowserWindow,
  menu: BrowserWindow,
) => {
  menuWidth = menu.getBounds().width;
  menuHeight = menu.getBounds().height;

  onMenuEvent(main, menu);
  ipcMain.on('sizeUpMenuWindow', (event, arg) => {
    const {
      x: mainX,
      y: mainY,
      width: mainWidth,
      height: mainHeight,
    } = main.getBounds();
    menuWidth = 400;
    menuHeight = 400;
    menu.setBounds({
      width: 400,
      height: 400,
      x: mainX - Math.floor(menuWidth / 2) + Math.floor(mainWidth / 2),
      y: mainY - Math.floor(menuHeight / 2) + Math.floor(mainHeight / 2),
    });
  });

  ipcMain.on('sizeDownMenuWindow', (event, arg) => {
    const {
      x: mainX,
      y: mainY,
      width: mainWidth,
      height: mainHeight,
    } = main.getBounds();
    menuWidth = 100;
    menuHeight = 100;
    menu.setBounds({
      width: 100,
      height: 100,
      x: mainX - Math.floor(menuWidth / 2) + Math.floor(mainWidth / 2),
      y: mainY - Math.floor(menuHeight / 2) + Math.floor(mainHeight / 2),
    });
  });
};

export { interWindowCommunication, interMenuWindowCommunication };

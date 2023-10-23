import { BrowserWindow, screen } from 'electron';

type Area = 1 | 2 | 3 | 4;

let halfWidth = 0;
let halfHeight = 0;

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
  main.on('move', () => {
    const { x, y } = main.getBounds();
    sub.setBounds({
      x: x + 50,
      y: y + 50,
      width: 200,
      height: 200,
    });
  });
};

const interWindowCommunication = (main: BrowserWindow, sub: BrowserWindow) => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: displayWidth, height: displayHeight } =
    primaryDisplay.workAreaSize;
  halfWidth = displayWidth / 2;
  halfHeight = displayHeight / 2;

  onMoveEvent(main, sub);
};

export default interWindowCommunication;

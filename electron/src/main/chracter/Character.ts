import { BrowserWindow } from 'electron';

// 캐릭터 객체
// 현재 좌표, 방향, 윈도우의 초기 크기, 최대 크기를 가짐

class Character {
  mainWindow: BrowserWindow;
  curX: number;
  curY: number;
  direction: string;
  winWidth: number;
  winHeight: number;
  maxWidth: number;
  maxHeight: number;
  transition: boolean;

  constructor(
    mainWindow: BrowserWindow,
    maxHeight: number,
    maxWidth: number,
    winWidth: number,
    winHeight: number,
  ) {
    this.mainWindow = mainWindow;
    this.winWidth = winWidth;
    this.winHeight = winHeight;

    this.curX = maxWidth - winWidth;
    this.curY = maxHeight - winHeight;

    this.mainWindow.setBounds({
      x: this.curX,
      y: this.curY,
      width: winWidth,
      height: winHeight,
    });

    this.direction = 'stop';
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.transition = false;
  }
}

export default Character;

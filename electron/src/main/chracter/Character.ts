/* eslint-disable import/no-cycle */
// 캐릭터 객체
// 현재 좌표, 방향, 윈도우의 초기 크기, 최대 크기를 가짐
import { mainVariables, mainWindow } from '../windows';

type TDirection =
  | 'left'
  | 'right'
  | 'stop'
  | 'up'
  | 'down'
  | 'downsleep'
  | 'click';

class Character {
  #curX: number;

  #curY: number;

  winWidth: number;

  winHeight: number;

  maxWidth: number;

  maxHeight: number;

  transition: boolean;

  fallTrigger: boolean;

  #direction: TDirection;

  #prevDirection: TDirection;

  constructor(
    maxWidth: number,
    maxHeight: number,
    winWidth: number,
    winHeight: number,
  ) {
    this.winWidth = winWidth;
    this.winHeight = winHeight;
    this.#curX = maxWidth - winWidth;
    this.#curY = maxHeight - winHeight;

    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.transition = false;
    this.fallTrigger = false;

    this.#direction = 'stop';
    this.#prevDirection = 'down';
  }

  get curX() {
    return this.#curX;
  }

  get curY() {
    return this.#curY;
  }

  set position({ nextX, nextY }: { nextX: number; nextY: number }) {
    if (this.#curX !== nextX || this.#curY !== nextY) {
      const { width, height } = mainVariables;

      mainWindow.setBounds({
        x: nextX,
        y: nextY,
        width,
        height,
      });
    }

    this.#curX = nextX;
    this.#curY = nextY;
  }

  get direction(): TDirection {
    return this.#direction;
  }

  set direction(value) {
    this.#prevDirection = this.#direction;
    this.#direction = value;

    if (this.#prevDirection !== this.#direction) {
      mainWindow.webContents.send('character-move', value);
    }
  }
}

export default Character;

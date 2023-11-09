import { ipcMain, screen } from 'electron';
import fs from 'fs';
import path from 'path';
import { mainVariables, mainWindow, menuWindow } from '../windows';
import tray, { variables as trayVariables } from '../tray/tray';

let moveTimer: IntervalId = null;

const characterHandler = () => {
  toggleMenuHandler();
  characterListHandler();
  characterImagesHandler();
  changeCharacterHandler();
  getImageHandler();
  deleteCharacterHandler();
  addCharacterHandler();
  characterLeftClickHandler();
  startMoveHandler();
  stopMoveHandler();
};

/**
 * 'toggleMenuOn' : 캐릭터 우클릭 시 메뉴 윈도우를 보여준다
 */
const toggleMenuHandler = () => {
  ipcMain.on('toggleMenuOn', () => {
    mainWindow.show();
    menuWindow.show();
    mainWindow.moveTop();
    menuWindow.webContents.send('toggleMenuOn'); // MenuModal.tsx에 메뉴 on/off 애니메이션 효과를 위해서 send
  });
};

/**
 * 'character-list' : 캐릭터의 리스트(이름만)를 불러온다
 */
const characterListHandler = () => {
  ipcMain.handle('character-list', async () => {
    const RESOURCE_PATH = 'assets/character';
    const characterList = fs.readdirSync(RESOURCE_PATH);
    const result = characterList.map((character) => {
      const image = fs.readFileSync(
        path.join(RESOURCE_PATH, character, 'stop', '1.png'),
        { encoding: 'base64' },
      );

      return { name: character, image };
    });
    return result;
  });
};

/**
 * 'character-images' : 해당 캐릭터의 이미지들을 불러온다
 */
const characterImagesHandler = () => {
  type TMotion = 'click' | 'down' | 'move' | 'stop' | 'up';
  type TMotionImage = {
    click: Array<string>;
    down: Array<string>;
    move: Array<string>;
    stop: Array<string>;
    up: Array<string>;
  };
  ipcMain.handle('character-images', async (_event, character: string) => {
    const RESOURCE_PATH = 'assets/character';
    const TARGET_DIRECTORY = path.join(RESOURCE_PATH, character);
    const motions: Array<TMotion> = ['click', 'down', 'move', 'stop', 'up'];
    const motionImages: TMotionImage = {
      click: [],
      down: [],
      move: [],
      stop: [],
      up: [],
    };
    motions.forEach((motion) => {
      try {
        const imageList = fs.readdirSync(path.join(TARGET_DIRECTORY, motion));
        for (const image of imageList) {
          const base64Image = fs.readFileSync(
            path.join(TARGET_DIRECTORY, motion, image),
            { encoding: 'base64' },
          );
          motionImages[motion].push(base64Image);
        }
      } catch (e) {
        console.log(e);
      }
    });

    // 이미지를 불러올때 tray의 이미지도 변경하자
    tray.setImage(path.join(TARGET_DIRECTORY, 'stop', '1.png'));

    return motionImages;
  });
};

/**
 * 'change-character' : 캐릭터 변경 이벤트(sub -> main으로 전달하기 위해)
 */
const changeCharacterHandler = () => {
  ipcMain.on('change-character', (_event, character) => {
    mainWindow.webContents.send('change-character', character);
  });
};

/**
 * 'get-image' : path로부터 파일 이미지를 base64형식으로 불러오기
 */
const getImageHandler = () => {
  ipcMain.handle('get-image', (_event, filePath: string) => {
    return fs.readFileSync(filePath, { encoding: 'base64' });
  });
};

/**
 * 'delete-character' : 캐릭터이름으로부터 해당 캐릭터(디렉터리)를 삭제
 */
const deleteCharacterHandler = () => {
  ipcMain.handle('delete-character', (_event, name: string) => {
    const RESOURCE_PATH = 'assets/character';
    if (!fs.existsSync(path.join(RESOURCE_PATH, name))) {
      return false;
    }
    fs.rmSync(path.join(RESOURCE_PATH, name), { recursive: true, force: true });
    return true;
  });
};

/**
 * 'add-character' : 캐릭터를 생성(디렉터리 및 이미지파일)
 */
const addCharacterHandler = () => {
  type TAddCharacter = {
    name: string;
    stop: Array<string>;
    move: Array<string>;
    click: Array<string>;
    down: Array<string>;
    up: Array<string>;
  };
  ipcMain.handle(
    'add-character',
    (_event, { name, stop, move, click, down, up }: TAddCharacter) => {
      const result = {
        success: false,
        message: '',
      };

      if (name.length === 0 || stop.length > 10) {
        result.success = false;
        result.message = '캐릭터 이름은 1~9글자여야합니다';
        return result;
      }

      if (
        stop.length === 0 ||
        move.length === 0 ||
        click.length === 0 ||
        down.length === 0 ||
        up.length === 0
      ) {
        result.success = false;
        result.message = '각 모션마다 최소 1장의 이미지가 필요합니다';
        return result;
      }

      const RESOURCE_PATH = 'assets/character';

      if (fs.existsSync(path.join(RESOURCE_PATH, name))) {
        result.success = false;
        result.message = '이미 존재하는 캐릭터 이름입니다';
        return result;
      }

      fs.mkdirSync(path.join(RESOURCE_PATH, name));

      const imageList = [
        { motion: 'stop', images: stop },
        { motion: 'move', images: move },
        { motion: 'click', images: click },
        { motion: 'down', images: down },
        { motion: 'up', images: up },
      ];

      imageList.forEach(({ motion, images }) => {
        fs.mkdirSync(path.join(RESOURCE_PATH, name, motion));
        images.forEach((image, index) => {
          fs.writeFileSync(
            path.join(RESOURCE_PATH, name, motion, `${index + 1}.png`),
            image,
            'base64',
          );
        });
      });

      result.success = true;

      return result;
    },
  );
};

/**
 * 'character-left-click' : 캐릭터를 좌클릭 하였을 때 동작
 */
const characterLeftClickHandler = () => {
  ipcMain.on('character-left-click', () => {
    mainWindow.moveTop();
    trayVariables.menu.popup();
  });
};

// 캐릭터 움직이기 시작 동작을 할 때
const startMoveHandler = () => {
  const { character } = mainVariables;

  ipcMain.on('start-move', () => {
    character.direction = 'click';
    if (moveTimer !== null) clearInterval(moveTimer);
    moveTimer = setInterval(() => {
      const { x, y } = screen.getCursorScreenPoint();
      const nextX = x - 50;
      const nextY = y - 50;
      character.position = { nextX, nextY };
    }, 10);
  });
};

// 캐릭터 멈추기 동작을 할 때
const stopMoveHandler = () => {
  ipcMain.on('stop-move', () => {
    mainVariables.character.direction = 'stop';
    if (moveTimer !== null) {
      clearInterval(moveTimer);
    }
  });
};

export default characterHandler;

/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import { ipcMain, screen } from 'electron';
import fs from 'fs';
import path from 'path';
import { TWindows } from '../main';

let moveTimer: ReturnType<typeof setInterval> | null = null;

const characterHandler = (windows: TWindows) => {
  toggleMenuHandler(windows);
  characterListHandler();
  characterImagesHandler();
  changeCharacterHandler(windows);
  getImageHandler();
  deleteCharacterHandler();
  addCharacterHandler();
  characterLeftClickHandler(windows);
  startMoveHandler(windows);
  stopMoveHandler();
};

// 캐릭터 우클릭 시 메뉴 윈도우를 보여줘야한다
const toggleMenuHandler = (windows: TWindows) => {
  const { main, menu } = windows;
  ipcMain.on('toggleMenuOn', () => {
    main?.show();
    menu?.show();
    main?.moveTop();
    menu?.webContents.send('toggleMenuOn'); // MenuModal.tsx에 메뉴 on/off 애니메이션 효과를 위해서 send
  });
};

// 캐릭터의 리스트를 불러온다
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

// 해당 캐릭터의 이미지들을 불러온다
const characterImagesHandler = () => {
  type TMotion = 'click' | 'down' | 'move' | 'stop' | 'up';
  type TMotionImage = {
    click: Array<string>;
    down: Array<string>;
    move: Array<string>;
    stop: Array<string>;
    up: Array<string>;
  };
  ipcMain.handle('character-images', async (event, character: string) => {
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

    return motionImages;
  });
};

// 캐릭터 변경 이벤트(sub -> main으로 전달하기 위해)
const changeCharacterHandler = (windows: TWindows) => {
  ipcMain.on('change-character', (event, character) => {
    windows.main?.webContents.send('change-character', character);
  });
};

// path로부터 파일 이미지를 base64형식으로 불러오기
const getImageHandler = () => {
  ipcMain.handle('get-image', (event, filePath: string) => {
    return fs.readFileSync(filePath, { encoding: 'base64' });
  });
};

// 캐릭터이름으로부터 해당 캐릭터(디렉터리)를 삭제
const deleteCharacterHandler = () => {
  ipcMain.handle('delete-character', (event, name: string) => {
    const RESOURCE_PATH = 'assets/character';
    if (!fs.existsSync(path.join(RESOURCE_PATH, name))) {
      return false;
    }
    fs.rmSync(path.join(RESOURCE_PATH, name), { recursive: true, force: true });
    return true;
  });
};

// 캐릭터를 생성(디렉터리 및 이미지파일)
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
    (event, { name, stop, move, click, down, up }: TAddCharacter) => {
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

      const images = [
        { motion: 'stop', images: stop },
        { motion: 'move', images: move },
        { motion: 'click', images: click },
        { motion: 'down', images: down },
        { motion: 'up', images: up },
      ];

      images.forEach(({ motion, images }) => {
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

// 캐릭터를 좌클릭 하였을 때 동작
const characterLeftClickHandler = (windows: TWindows) => {
  ipcMain.on('character-left-click', () => {
    windows.main?.moveTop();
    windows.menu?.webContents.send('character-left-click');
  });
};

// 캐릭터 움직이기 시작 동작을 할 때
const startMoveHandler = (windows: TWindows) => {
  const { main } = windows;
  ipcMain.on('start-move', () => {
    main?.webContents.send('character-move', 'click');
    moveTimer = setInterval(() => {
      const { x, y } = screen.getCursorScreenPoint();
      main?.setBounds({
        width: 100,
        height: 100,
        x: x - 50,
        y: y - 50,
      });
    }, 10);
  });
};

// 캐릭터 멈추기 동작을 할 때
const stopMoveHandler = () => {
  ipcMain.on('stop-move', () => {
    if (moveTimer) {
      clearInterval(moveTimer);
    }
  });
};

export default characterHandler;

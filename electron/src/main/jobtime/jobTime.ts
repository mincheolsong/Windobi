import ActiveWindow, { WindowInfo } from '@paymoapp/active-window';
import { SubActivemapValue, TActiveMap, TSubActiveMap } from './jobTime.d';
import * as JobDB from './jobTimeDB';
import * as SubJobDB from './subJobTimeDB';

const TICK_TIME = 10; // TIME_TICK당 한번씩 사용중인 프로그램을 수집
const SAVE_TICK = 6;

const activeMap: TActiveMap = new Map(); // key: application, value: {tick, icon, path}
const subActiveMap: TSubActiveMap = new Map(); // key: application, value: Map<sub_application, tick>
const subActiveHandler = new Map();
const extensionMap = new Map();

setExtensions();
setSubApplicationHandler();

// // 짧은 주기마다 현재 활성화된 윈도우를 map에 저장하자`
setInterval(() => {
  try {
    const activeWindow = ActiveWindow.getActiveWindow();

    processJobTime(activeWindow);
    processSubJobTime(activeWindow);
  } catch (e) {
    /* empty */
  }
}, TICK_TIME * 1000);

// // 긴 주기마다 현재까지 저장된 것들을 DB로 넣어주자
setInterval(
  () => {
    JobDB.insertAll(activeMap, TICK_TIME);
    SubJobDB.insertAll(subActiveMap, TICK_TIME);
  },
  TICK_TIME * 1000 * SAVE_TICK,
); // SAVE_TICK에 한번 DB에 저장을 수행

// #region 활성화된 윈도우에 대해 어떻게 처리할 지 정의

const processJobTime = (activeWindow: WindowInfo) => {
  const { application, icon, path } = activeWindow;
  const saved = activeMap.get(application);
  if (saved) {
    saved.tick += 1;
  } else {
    activeMap.set(application, { tick: 1, icon, path });
  }
};

const processSubJobTime = (activeWindow: WindowInfo) => {
  const { application } = activeWindow;
  const handler = subActiveHandler.get(application);
  if (handler) {
    const sub_application = handler(activeWindow);
    if (sub_application) {
      // 만약 정상적으로 해당 application의 실행 정보를 받아 왔으면
      if (!subActiveMap.has(application)) {
        // application에 대해 정보가 없었으면 넣자
        subActiveMap.set(application, new Map());
      }
      const subApplicationMap = subActiveMap.get(application) as SubActivemapValue;
      if (!subApplicationMap.has(sub_application)) {
        subApplicationMap.set(sub_application, 0);
      }
      const savedTick = subApplicationMap.get(sub_application) as number;
      subApplicationMap.set(sub_application, savedTick + 1);
    }
  }
};

// #endregion

// // 각각의 확장자에 대해 정의
function setExtensions() {
  extensionMap.set('js', 'Javascript');
  extensionMap.set('ts', 'Typescript');
  extensionMap.set('jsx', 'React(JS)');
  extensionMap.set('tsx', 'React(TS)');

  extensionMap.set('html', 'HTML');
  extensionMap.set('css', 'CSS');

  extensionMap.set('java', 'Java');
  extensionMap.set('jsp', 'Java');

  extensionMap.set('php', 'Php');

  extensionMap.set('pl', 'Perl');

  extensionMap.set('c', 'C');
  extensionMap.set('cpp', 'C++');
  extensionMap.set('cs', 'C#');

  extensionMap.set('py', 'Python');
}

// #region 어플리케이션별 세부 정보 핸들러 정의

// // 각각의 application의 세부정보에 대해 추출
function setSubApplicationHandler() {
  subActiveHandler.set('Visual Studio Code', vscodeHandler);
  subActiveHandler.set('IntelliJ IDEA', intellijHandler);
  subActiveHandler.set('KakaoTalk', kakaoTalkHandler);
  subActiveHandler.set('Google Chrome', chromeHandler);
}

/**
 * VS Code에 대해 처리
 * @param { WindowInfo } activeWindow
 * @returns { string } 언어
 */
type TLanguage = string | null;
function vscodeHandler(activeWindow: WindowInfo): TLanguage {
  const { title } = activeWindow;
  for (const [key, value] of extensionMap) {
    if (title.match(new RegExp(`^.*(.${key} )`))) {
      // 만약 해당 확장자로 끝나는 파일이면
      return value;
    }
  }

  // 파일 확장자에 대해 처리하지 못하였으면
  return null;
}

/**
 * Intellij IDEA에 대해 처리
 * @param { WindowInfo } activeWindow
 * @returns {string} 언어
 */
function intellijHandler(activeWindow: WindowInfo): TLanguage {
  return vscodeHandler(activeWindow);
}

/**
 * KakaoTalk에 대해 처리
 * @param { WindowInfo } activeWindow
 * @returns {string} 대화방
 */
type TRoom = string;
function kakaoTalkHandler(activeWindow: WindowInfo): TRoom {
  return activeWindow.title;
}

/**
 * Google Chrome에 대해 처리
 * @param { WindowInfo } activeWindow
 * @returns {string} 탭 이름
 */
type TTab = string;
function chromeHandler(activeWindow: WindowInfo): TTab {
  const { title } = activeWindow;
  let index = title.lastIndexOf(' - ');
  if (index === -1) return title;

  let sub_application = title.substring(0, index);
  index = sub_application.lastIndexOf(' - ');
  if (index === -1) return sub_application;

  sub_application = sub_application.substring(index + 3, sub_application.length);
  return sub_application;
}
// #endregion

export {};

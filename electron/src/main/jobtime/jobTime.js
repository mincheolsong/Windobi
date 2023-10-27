/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-use-before-define */
const { ActiveWindow } = require('@paymoapp/active-window');
const fs = require("fs");
const { dbInstance } = require('./jobTimeDB');
const { dbInstance: subDbInstance } = require('./subJobTimeDB');

/**
 * @typedef {{ 
 *  title: string, 
 *  application: 
 *  string, 
 *  path: string, 
 *  pid: number, 
 *  icon: string, 
 *  windows?: { 
 *   isUWPApp: boolean, 
 *   uwpPackage: string
 *  }
 * }} WindowInfo
 */


const TICK_TIME = 10; // TIME_TICK당 한번씩 사용중인 프로그램을 수집
const SAVE_TICK = 6;

const activeMap = new Map(); // key: application, value: {tick, icon, path}
const subActiveMap = new Map(); // key: application, value: Map<sub_application, tick>
const subActiveHandler = new Map();
const extensionMap = new Map();

const fd = fs.openSync("log.txt", "a");

setExtensions();
setSubApplicationHandler();

dbInstance.init();
dbInstance.createTable();

subDbInstance.init();
subDbInstance.createTable();

// 짧은 주기마다 현재 활성화된 윈도우를 map에 저장하자
setInterval(() => {
  try {
    const activeWindow = ActiveWindow.getActiveWindow();

    processJobTime(activeWindow);
    processSubJobTime(activeWindow);
  } catch (e) {}
}, TICK_TIME * 1000);

// 긴 주기마다 현재까지 저장된 것들을 DB로 넣어주자
setInterval(
  () => {
    dbInstance.insertAll(activeMap, TICK_TIME);
    subDbInstance.insertAll(subActiveMap, TICK_TIME);
  },
  TICK_TIME * 1000 * SAVE_TICK,
); // SAVE_TICK에 한번 DB에 저장을 수행

/**
 * 
 * @param {WindowInfo} activeWindow 
 */
const processJobTime = (activeWindow) => {
  const { application, icon, path } = activeWindow;
  if (activeMap.has(application)) {
    const saved = activeMap.get(application);
    saved.tick += 1;
  } else {
    activeMap.set(application, { tick: 1, icon, path });
  }
};

/**
 * 각각의 application에 대해 처리
 * @param {WindowInfo} activeWindow
 */
const processSubJobTime = (activeWindow) => {
  const { application } = activeWindow;
  const handler = subActiveHandler.get(application);
  fs.appendFileSync(fd, `application : ${application}\n`, 'utf8');
  if (handler) {
    const sub_application = handler(activeWindow);
    if (sub_application) {
      // 만약 정상적으로 해당 application의 실행 정보를 받아 왔으면
      if (!subActiveMap.has(application)) {
        // application에 대해 정보가 없었으면 넣자
        subActiveMap.set(application, new Map());
      }
      const subApplicationMap = subActiveMap.get(application);
      if (!subApplicationMap.has(sub_application)) {
        subApplicationMap.set(sub_application, 0);
      }
      const savedTick = subApplicationMap.get(sub_application);
      subApplicationMap.set(sub_application, savedTick + 1);
    }
  }
};

// 각각의 확장자에 대해 정의
function setExtensions() {
  extensionMap.set('js', 'Javascript');
  extensionMap.set('ts', 'Javascript');
  extensionMap.set('jsx', 'Javascript');
  extensionMap.set('tsx', 'Javascript');

  extensionMap.set('java', 'Java');
  extensionMap.set('jsp', 'Java');

  extensionMap.set('php', 'Php');

  extensionMap.set('pl', 'Perl');

  extensionMap.set('c', 'C');
  extensionMap.set('cpp', 'C++');
  extensionMap.set('cs', 'C#');

  extensionMap.set('py', 'Python');
}

// 각각의 application의 세부정보에 대해 추출
function setSubApplicationHandler() {
  subActiveHandler.set('Visual Studio Code', vscodeHandler);
  subActiveHandler.set("IntelliJ IDEA", intellijHandler)
  subActiveHandler.set("KakaoTalk", kakaoTalkHandler)
  subActiveHandler.set("Google Chrome", chromeHandler)
}

/**
 * VS Code에 대해 처리
 * @param { WindowInfo } activeWindow
 * @returns { string } 언어
 */
function vscodeHandler(activeWindow) {
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
function intellijHandler(activeWindow) {
  return vscodeHandler(activeWindow)
}

/**
 * KakaoTalk에 대해 처리
 * @param { WindowInfo } activeWindow
 * @returns {string} 언어
 */
function kakaoTalkHandler(activeWindow){
  return activeWindow.title;
}

/**
 * Google Chrome에 대해 처리
 * @param { WindowInfo } activeWindow
 * @returns {string} 언어
 */
function chromeHandler(activeWindow){
  const {title} = activeWindow;
  let index = title.lastIndexOf(" - ");
  if(index === -1) return title;
  
  let sub_application = title.substring(0, index);
  index = sub_application.lastIndexOf(" - ");
  if(index === -1) return sub_application;

  sub_application = sub_application.substring(index+3, sub_application.length)
  return sub_application;
}
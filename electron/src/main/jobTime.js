const { ActiveWindow } = require('@paymoapp/active-window');
const { dbInstance } = require('./jobTimeDB');

const TICK_TIME = 1; // TIME_TICK당 한번씩 사용중인 프로그램을 수집
const SAVE_TICK = 6;

const activeMap = new Map();
dbInstance.init();
dbInstance.createTable();

// 짧은 주기마다 현재 활성화된 윈도우를 map에 저장하자
setInterval(() => {
  try {
    const activeWindow = ActiveWindow.getActiveWindow();
    const { application, icon } = activeWindow;
    if (activeMap.has(application)) {
      const saved = activeMap.get(application);
      saved.tick += 1;
    } else {
      activeMap.set(application, { tick: 1, icon });
    }
  } catch (e) {}
}, TICK_TIME * 1000);

// 긴 주기마다 현재까지 저장된 것들을 DB로 넣어주자
setInterval(
  () => {
    dbInstance.insertAll(activeMap, TICK_TIME);
  },
  TICK_TIME * 1000 * SAVE_TICK,
); // SAVE_TICK에 한번 DB에 저장을 수행

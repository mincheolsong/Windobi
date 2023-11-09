/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import './MenuModal.scss';
import jobtime from '../../../../assets/icons/jobtime.svg';
import calendar from '../../../../assets/icons/calendar.svg';
import notification from '../../../../assets/icons/alarm.svg';
import chatGPT from '../../../../assets/icons/chatGPT.svg';
import news from '../../../../assets/icons/news.svg';
import setting from '../../../../assets/icons/setting.svg';
import login from '../../../../assets/icons/login.svg';
import close from '../../../../assets/icons/close.svg';
import weather from '../../../../assets/icons/weather.svg';
function MenuModal() {
  const [active, setActive] = useState(false);
  const { ipcRenderer } = window.electron;
  const [currentIndex, setCurrentIndex] = useState(0);
  const menuItems = [
    { jobtime },
    { calendar },
    { notification },
    { chatGPT },
    { setting },
    { close },
    { news },
    { email: login },
  ];

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      setCurrentIndex((currentIndex + 1) % menuItems.length);
    } else {
      setCurrentIndex((currentIndex - 1 + menuItems.length) % menuItems.length);
    }
  };

  const reorderedItems = [
    ...menuItems.slice(currentIndex),
    ...menuItems.slice(0, currentIndex),
  ];

  useEffect(() => {
    ipcRenderer.on('toggleMenuOn', () => {
      setActive(() => true);
      ipcRenderer.sendMessage('stopMoving');
    });

    ipcRenderer.on('character-left-click', () => {
      setActive(() => false); // 클릭하면 메뉴를 닫음(애니메이션)
      ipcRenderer.sendMessage('hideMenuWindow');
    });
  }, []);

  const navigate = (path: string) => {
    setActive(() => false); // 클릭하면 메뉴를 닫음(애니메이션)
    ipcRenderer.sendMessage('hideMenuWindow');

    if (path === 'close') {
      ipcRenderer.sendMessage('restartMoving');
    } else {
      ipcRenderer.sendMessage('sub', path);
    }
  };

  return (
    <div
      className={active ? 'menu active' : 'menu'}
      onWheel={handleWheel}
      style={{ WebkitUserSelect: 'none' }}
    >
      <div className="icons">
        {reorderedItems.map((item, index) =>
          Object.keys(item)[0] === 'close' ? (
            <div className="rotater" key={index}>
              <div className="btn btn-icon close-btn">
                <img
                  className="fa"
                  src={item[Object.keys(item)[0]]}
                  onClick={() => navigate(`${Object.keys(item)[0]}`)}
                />
              </div>
            </div>
          ) : (
            <div className="rotater" key={index}>
              <div className="btn btn-icon">
                <img
                  className="fa"
                  src={item[Object.keys(item)[0]]}
                  onClick={() => navigate(`${Object.keys(item)[0]}`)}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default MenuModal;

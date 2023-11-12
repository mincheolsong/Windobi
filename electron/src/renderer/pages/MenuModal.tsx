import React, { useEffect, useState } from 'react';
import '../components/menu/MenuModal.scss';
import jobtime from '../../../assets/icons/jobtime.svg';
import alarm from '../../../assets/icons/alarm.svg';
import chatGPT from '../../../assets/icons/chatGPT.svg';
import setting from '../../../assets/icons/setting.svg';
import login from '../../../assets/icons/login.svg';
import close from '../../../assets/icons/close.svg';
import weather from '../../../assets/icons/weather.svg';
import music from '../../../assets/icons/music.svg';

function MenuModal() {
  const [active, setActive] = useState(false);
  const { ipcRenderer } = window.electron;
  const [currentIndex, setCurrentIndex] = useState(0);

  const menuItems = [
    { path: 'notification', icon: alarm },
    { path: 'googleOAuth', icon: music },
    { path: 'jobtime', icon: jobtime },
    { path: 'chatGPT', icon: chatGPT },
    { path: 'setting', icon: setting },
    { path: 'close', icon: close },
    { path: 'weather', icon: weather },
    { path: 'email', icon: login },
  ];

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0) {
      setCurrentIndex((currentIndex + 1) % menuItems.length);
    } else {
      setCurrentIndex((currentIndex - 1 + menuItems.length) % menuItems.length);
    }
  };

  const reorderedItems = [...menuItems.slice(currentIndex), ...menuItems.slice(0, currentIndex)];

  useEffect(() => {
    ipcRenderer.on('show-menu', () => {
      setActive(() => true);
    });

    ipcRenderer.on('hide-menu', () => {
      setActive(() => false);
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
        {reorderedItems.map(({ path, icon }) => {
          return (
            <div className="rotater" key={path}>
              <div className={`btn btn-icon ${path === 'close' && 'close-btn'}`}>
                <img className="fa" src={icon} onClick={() => navigate(path)} alt={path} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MenuModal;

import React, { useEffect, useState } from 'react';
import '../components/menu/MenuModal.scss';
import { LuMailPlus, LuMailSearch } from 'react-icons/lu';
import { IconType } from 'react-icons';
import { TbReport } from 'react-icons/tb';
import jobtime from '../../../assets/icons/jobtime.svg';
import chatGPT from '../../../assets/icons/chatGPT.svg';
import setting from '../../../assets/icons/setting.svg';
import close from '../../../assets/icons/close.svg';
import weather from '../../../assets/icons/weather.svg';
import music from '../../../assets/icons/music.svg';

type TItem = {
  path: string;
  icon: IconType | string;
};

function MenuModal() {
  const [active, setActive] = useState(false);
  const { ipcRenderer } = window.electron;
  const [currentIndex, setCurrentIndex] = useState(0);

  const menuItems: Array<TItem> = [
    { path: 'googleOAuth', icon: music },
    { path: 'report', icon: TbReport },
    { path: 'jobtime', icon: jobtime },
    { path: 'chatGPT', icon: chatGPT },
    { path: 'setting', icon: setting },
    { path: 'close', icon: close },
    { path: 'weather', icon: weather },
    { path: 'notification', icon: LuMailSearch },
    { path: 'email', icon: LuMailPlus },
  ];

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
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
    } else if (path === 'report') {
      // 리포트를 보여줘야 하면
      ipcRenderer.sendMessage('show-report');
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
        {reorderedItems.map(({ path, icon: Icon }) => {
          return (
            <div className="rotater" key={path}>
              <div
                className={`btn btn-icon ${path === 'close' && 'close-btn'}`}
              >
                {typeof Icon === 'string' ? (
                  <img
                    className="fa"
                    src={Icon}
                    onClick={() => navigate(path)}
                    alt={path}
                  />
                ) : (
                  <Icon className="fa" onClick={() => navigate(path)} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MenuModal;

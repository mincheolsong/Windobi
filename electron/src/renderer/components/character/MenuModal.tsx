/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import './MenuModal.scss';
import jobtime from '../../../../assets/icons/jobtime.svg';
import calendar from '../../../../assets/icons/calendar.svg';
import alarm from '../../../../assets/icons/alarm.svg';
import chatGPT from '../../../../assets/icons/chatGPT.svg';
import close from '../../../../assets/icons/close.svg';
import setting from '../../../../assets/icons/setting.svg';

function MenuModal() {
  const [active, setActive] = useState(false);
  const { ipcRenderer } = window.electron;
  const [currentIndex, setCurrentIndex] = useState(0);
  const menuItems = [
    { jobtime: jobtime },
    { calendar: calendar },
    { notification: alarm },
    { chatGPT: chatGPT },
    { setting: setting },
    { test0: null },
    { test1: null },
    { test3: close },
  ];

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      // Scroll down - move items clockwise
      setCurrentIndex((currentIndex + 1) % menuItems.length);
    } else {
      // Scroll up - move items counterclockwise
      setCurrentIndex((currentIndex - 1 + menuItems.length) % menuItems.length);
    }
  };

  const reorderedItems = [
    ...menuItems.slice(currentIndex),
    ...menuItems.slice(0, currentIndex),
  ];

  useEffect(() => {
    console.log('Menu Window');
    ipcRenderer.on('toggleMenuOn', () => {
      setActive(true);
      ipcRenderer.sendMessage('stopMoving');
    });

    ipcRenderer.on('toggleMenuClose', () => {
      setActive(false);
      ipcRenderer.sendMessage('restartMoving');
    });

    //
  }, []);

  const navigate = (path: string) => {
    ipcRenderer.sendMessage('sub', path);
    setActive(false); // 클릭하면 메뉴를 닫음(애니메이션)
  };

  return (
    <div className={active ? 'menu active' : 'menu'} onWheel={handleWheel}>
      <div className="icons">
        {reorderedItems.map((item, index) => (
          <div className="rotater" key={index}>
            <div className="btn btn-icon">
              <img
                className="fa"
                src={item[Object.keys(item)[0]]}
                onClick={() => navigate(`${Object.keys(item)[0]}`)}
              />
            </div>
          </div>
        ))}

        {/* <div className="rotater">
          <div className="btn btn-icon">
            <img
              className="fa"
              src={statisticImg}
              onClick={() => navigate('jobtime')}
            />
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <img className="fa" src={calendar} />
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <img className="fa" src={alarm} />
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <img className="fa" src={chatGPT} />
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <img className="fa" src={setting} />
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <i className="fa fa-linkedin">f</i>
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <i className="fa fa-github">g</i>
          </div>
        </div>
        <div
          className="rotater "
          // onClick={() => {
          //   setActive(false);
          //   ipcRenderer.sendMessage('restartMoving');
          // }}
        >
          <div className="btn btn-icon ">
            <img className="fa " src={close}></img>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default MenuModal;

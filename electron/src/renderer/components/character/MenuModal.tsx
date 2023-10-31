/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import './MenuModal.scss';
import statisticImg from '../../../../assets/icons/statistics.svg';
import calendar from '../../../../assets/icons/calendar.svg';
import alarm from '../../../../assets/icons/alarm.svg';
import chatGPT from '../../../../assets/icons/chatGPT.svg';
import close from '../../../../assets/icons/close.svg';
import setting from '../../../../assets/icons/setting.svg';

function MenuModal() {
  const [active, setActive] = useState(false);
  const { ipcRenderer } = window.electron;

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
    console.log('navigate');
    setActive(false); // 클릭하면 메뉴를 닫음(애니메이션)
  };

  return (
    <div
      className={active ? 'menu active' : 'menu'}
      onWheel={(e) => {
        console.log(e.deltaY); // -면 위쪽으로 +면 아래쪽
      }}
    >
      <div className="icons">
        <div className="rotater">
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
        </div>
      </div>
    </div>
  );
}

export default MenuModal;

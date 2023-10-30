/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import './MenuModal.scss';
import statisticImg from '../../../../assets/icons/statistics.svg';
import calendar from '../../../../assets/icons/calendar.svg';
import alarm from '../../../../assets/icons/alarm.svg';
import chatGPT from '../../../../assets/icons/chatGPT.svg';

function MenuModal() {
  const [active, setActive] = useState(false);
  const { ipcRenderer } = window.electron;

  useEffect(() => {
    console.log('Menu Window');
    window.electron.ipcRenderer.on('toggleMenuOn', () => {
      setActive(true);
      window.electron.ipcRenderer.sendMessage('stopMoving');
    });

    window.electron.ipcRenderer.on('toggleMenuClose', () => {
      setActive(false);
      window.electron.ipcRenderer.sendMessage('restartMoving');
    });
  }, []);

  const navigate = (path: string) => {
    ipcRenderer.sendMessage('sub', path);
  };

  return (
    <div className={active ? 'menu active' : 'menu'}>
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
            <i className="fa fa-dribbble">e</i>
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
        <div className="rotater">
          <div className="btn btn-icon">
            <i className="fa fa-behance">h</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuModal;

import { useEffect, useState } from 'react';
import './MenuModal.scss';
import { useNavigate } from 'react-router-dom';
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
    });

    window.electron.ipcRenderer.on('toggleMenuClose', () => {
      setActive(false);
    });
  }, []);

  const navigate = (path: string) => {
    ipcRenderer.sendMessage('sub', path);
  };

  return (
    <div className={active ? 'menu active' : 'menu'}>
      {/* <div
        className="btn trigger"
        onClick={() => {
          if (!active) {
            window.electron.ipcRenderer.sendMessage('sizeUpMenuWindow', {});
          } else {
            // 메뉴가 x버튼 모양인 경우
            window.electron.ipcRenderer.sendMessage('toggleMenu', {});
          }
          setActive(!active);
        }}
      >
        <span className="line"></span>
      </div> */}
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

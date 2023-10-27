import { useEffect, useState } from 'react';
import './MenuModal.scss';

function MenuModal() {
  const [active, setActive] = useState(true);
  const { ipcRenderer } = window.electron;

  // useEffect(() => {
  //   ipcRenderer.on('');
  // }, []);
  return (
    <div className="menu active">
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
            <i className="fa fa-codepen">a</i>
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <i className="fa fa-facebook">b</i>
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <i className="fa fa-google-plus">c</i>
          </div>
        </div>
        <div className="rotater">
          <div className="btn btn-icon">
            <i className="fa fa-twitter">d</i>
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

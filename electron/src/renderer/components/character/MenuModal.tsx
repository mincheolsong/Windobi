import { ipcRenderer } from 'electron';
import { useEffect, useState, useRef } from 'react';
import './MenuModal.scss';

function MenuModal() {
  const [active, setActive] = useState(false);

  return (
    <div className={active ? 'menu active' : 'menu'}>
      <div
        className="btn trigger"
        onClick={() => {
          if (!active) {
            window.electron.ipcRenderer.sendMessage('sizeUpMenuWindow', {});
          } else {
            window.electron.ipcRenderer.sendMessage('sizeDownMenuWindow', {});
          }
          setActive(!active);
        }}
      >
        <span className="line"></span>
      </div>
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

import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

const weatherHandler = () => {
  setImage();
};

const setImage = () => {
  const imges = [
    '02n',
    '01n',
    '03n',
    '04n',
    '09n',
    '10n',
    '11n',
    '13n',
    '50n',
    '02d',
    '01d',
    '03d',
    '04d',
    '09d',
    '10d',
    '11d',
    '13d',
    '50d',
  ];
  ipcMain.handle('weatherHandler', (event) => {
    const dir = 'assets/weather';
    const result = {};
    imges.forEach((img) => {
      result[img] = fs.readFileSync(path.join(dir, `${img}.png`), { encoding: 'base64' });
    });
    return result;
  });
};

export default weatherHandler;

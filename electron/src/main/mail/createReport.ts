import { BrowserWindow, app } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../util';
import EmailTemplate from "./EmailTemplate";
// import ChartJSImage from 'chart.js-image';
import { jsPDF } from "jspdf";
const { dbInstance } = require('../jobtime/jobTimeDB');
const { dbInstance: subDbInstance } = require('../jobtime/subJobTimeDB');

async function createReport(date: Date) {
  const result = EmailTemplate();

  dbInstance.init();
  subDbInstance.init();
  // const programData = await dbInstance.getByDay(date);
  // const programDetailData = await subDbInstance(date);
  // programData : {application : '프로그램이름', active_time: '사용한 시간', icon: '프로그램 아이콘'}

  const doc = new jsPDF();
  doc.text("Hello world!", 10, 10);
  doc.save("./a4.pdf");

  setTimeout(async () => {
    const chartWindow = new BrowserWindow({
      width: 300,
      height: 300,
      show: true,
      frame: true,
      focusable: true,
      // show: false,
      // frame: false,
      // focusable: false,
      transparent: true,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, '../preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    });
    await chartWindow.loadURL(resolveHtmlPath('index.html'));

    chartWindow.webContents.closeDevTools();
    chartWindow.webContents.send('sub', 'createchart');


  }, 5000);


  // const ChartJsImage = require('chartjs-to-image');

  // const myChart = new ChartJsImage();
  // myChart.setConfig({
  //   type: 'bar',
  //   data: { labels: ['Hello world', 'Foo bar'], datasets: [{ label: 'Foo', data: [1, 2] }] },
  // });
  // const dataUrl = await myChart.toDataUrl();
  // myChart.toFile('./pieChart.png');

}

export default createReport;

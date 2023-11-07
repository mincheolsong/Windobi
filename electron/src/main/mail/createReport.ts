
const { dbInstance } = require('../jobtime/jobTimeDB');
const { dbInstance: subDbInstance } = require('../jobtime/subJobTimeDB');


async function createReport(date: Date) {
  let result = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>HTML Email Template</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div>
          <h1>일일 사용량</h1>
          <p>오늘의 보고서</p>
        </div>
      </body>
    </html>
  `;
  dbInstance.init();
  subDbInstance.init();
  // const result = await dbInstance.getByDay(date);


  return result;

}



export default createReport;

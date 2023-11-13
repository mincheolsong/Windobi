import EmailTemplate from './EmailTemplate';

const { dbInstance } = require('../jobtime/jobTimeDB');
const { dbInstance: subDbInstance } = require('../jobtime/subJobTimeDB');

async function createReport(date: Date) {
  const result = EmailTemplate();

  dbInstance.init();
  subDbInstance.init();
  const programData = await dbInstance.getByDay(date);
  // const programDetailData = await subDbInstance(date);
  // programData : {application : '프로그램이름', active_time: '사용한 시간', icon: '프로그램 아이콘'}
}

export default createReport;

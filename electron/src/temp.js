const date = new Date(1699394110 * 1000);
console.log('getUTC: ', date.toUTCString().substring(0, 16));
console.log('getDate: ', date.toTimeString());
const cur_time = new Date();
console.log(cur_time.getTime());
const date2 = new Date(1699434000 * 1000);
console.log('계산 시간은', date2.toTimeString());
console.log('CurTime:', cur_time.getTime() < 1700000000 * 1000);

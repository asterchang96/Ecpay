import moment from 'moment-timezone';

export function getCurrentTaipeiTimeString(
  format?: 'DatetimeString' | 'Datetime',
) {
  const taipeiTime = moment(Date.now()).tz('Asia/Taipei');
  const date = taipeiTime.format('YYYY/MM/DD HH:mm:ss');

  const [year, month, day, hour, minute, second] = [
    taipeiTime.year(),
    taipeiTime.month() + 1,
    taipeiTime.date(),
    taipeiTime.hours(),
    taipeiTime.minutes(),
    taipeiTime.seconds(),
  ].map((value) => `${value}`.padStart(2, '0'));

  return format === 'DatetimeString'
    ? `${year}${month}${day}${hour}${minute}${second}`
    : format === 'Datetime'
      ? date
      : `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}


export const parseTime = (time: number) => {
  if (time >= 10) return time;
  return `0${time}`;
}

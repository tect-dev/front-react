export const refineDatetime = (raw) => {
  const [date, time ] = raw.split("T")
  const [yyyy, MM, dd ] = date.split("-")
  const hhmmss = time.split('.')[0]
  const [ hh, mm, ss ] = hhmmss.split(':')
  return `${yyyy}년 ${MM}월 ${dd}일 ${hh}시 ${mm}분 ${ss}초`
}
export default function addDots(number) {
  const str = number.toString();
  const parts = [];
  let i = str.length - 1;

  while (i >= 0) {
    parts.unshift(str.slice(Math.max(i - 2, 0), i + 1));
    i -= 3;
  }

  return parts.join('.');
}
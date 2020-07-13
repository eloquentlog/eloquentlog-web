export const truncate = (s: string, n: number) => {
  if (s === null) {
    return '';
  }
  if (s.length > n) {
    return s.substr(0, n - 1) + '...';
  }
  return s;
};
